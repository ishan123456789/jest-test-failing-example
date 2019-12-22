import axios from "axios";
import _ from "lodash";
import moment from "moment";
import { OrderHelper } from "./orders.helper";
import { Order, OrderFromDB, OrderModel } from "./orders.interface";

export class OrderService extends OrderHelper {
    public async orderAlreadyExist(order: Order): Promise<boolean> {
        return !!(await OrderModel.findOne({ internalId: order.internalId }));
    }
    public async createOrder(order: Order): Promise<Order | void> {
        try {
            const insertedOrder = await this.insertOrderInDB(order) as OrderFromDB;
            await this.updateOrderAndIncident(true, true, false, insertedOrder);
            return order;
        } catch (e) {
            console.error("Create order error", e);
        }
    }
    public async insertOrderInDB(order: Order): Promise<Order> {
        return OrderModel.findOneAndUpdate({ order: order.internalId }, { $set: { ...order } }, { upsert: true, new: true }) as unknown as Order;
    }
    /**
     * Based on the arguments passed it does below tasks:
     * 1. Triggers orderIsLate check
     * 2. Checks if the order was delayed one if so update the time in partner tracker
     * 3. Send to partner trackert with current status
     */
    public async updateOrderAndIncident(
        isLateCheck: boolean,
        isSendToTracker: boolean,
        isDelayIncident: boolean,
        order: OrderFromDB,
    ) {
        console.info("updateOrderAndIncident");
        if (isLateCheck) {
            await this.scheduleOrderIsLateCheck(order);
        }
        if (isDelayIncident) {
            await this.createUpdateDelayIncident(order);
        }
        if (isSendToTracker) {
            await this.sendToPartnerTracker(order);
        }
    }

    /**
     * Schedules a setTimeout delay if the request object is in accepted state
     * After the setTimeout delay, checkIsOrderLate will be performed to assess
     * whether the order is delayed.
     */
    public async scheduleOrderIsLateCheck(order: Order) {
        try {
            const {
                status: { timeline = [] } = {},
                delivery: { expectedDeliveryTime = "", address: { street = "" } = {} } = {},
                platform = "",
            } = order;
            console.info('this.getTimelineEvent(timeline, "accepted")', this.getTimelineEvent(timeline, "accepted"));
            console.info("expectedDeliveryTime", expectedDeliveryTime);
            if (!!this.getTimelineEvent(timeline, "accepted")) {
                if (expectedDeliveryTime) {
                    if (platform.toLowerCase() === "foodora" && !!street.match(/foodora/i)) { return; }
                    const now = moment();
                    let delay = moment.duration(moment(expectedDeliveryTime).diff(now)).asSeconds();
                    // minimum delay of 5 minutes
                    delay = delay + 5 * 60;
                    setTimeout(() => {
                        this.checkIsOrderLate(order);
                        console.log("called after scheduled delay");
                    }, 200 || delay * 1000);
                    console.info("scheduled checkIsOrderLate for", order.internalId, "delay in seconds", delay);
                } else {
                    logger.warn(
                        "Warning: order && order.deliveryTime not available during scheduleOrderIsLateCheck:",
                        order,
                    );
                }
            }
        } catch (e) {
            console.error("Error during scheduleOrderIsLateCheck");
            console.error(e.message);
        }
    }
    /**
     * Returns true if an order is expected to be late at the time of dispatch
     * Using google maps distance time added to the dispatch time to approximate
     * the actual time an order would arrive at the customer
     */
    public async checkIsOrderLate(orderDetails: Order): Promise<boolean | null> {
        let isLate = false;
        try {
            // Need to get updated order
            const order = await OrderModel.findOne({ internalId: orderDetails.internalId });
            if (!order) { return null; }
            const { status: { timeline = [] } = {}, delivery: { expectedDispatchTime = "" } = {} } = order;
            // Considering dispatched staus mean isOnTheWay
            if (
                order?.cancellation &&
                !this.getTimelineEvent(timeline, "dispatched") &&
                expectedDispatchTime
            ) {
                if (moment().diff(expectedDispatchTime) > 0) { isLate = true; }
                this.createUpdateDelayIncident(order as unknown as OrderFromDB);
            } else {
                if (!expectedDispatchTime) { console.error("Expected dispatch time not present for", expectedDispatchTime); }
                console.info("order is not late ", order.internalId);
            }
        } catch (e) {
            console.error("error during checkIsOrderLate.", e);
            console.error("order", orderDetails.internalId);
        }
        return isLate;
    }
    /**
     * Create incident in partner-tracker app
     * Checks if a request body object is in isOnTheWay state. If so, checks whether
     * a delivery delay incidents for the same order exists and attempts to update
     * the incident in the partner-tracker app with the new onTheWayTime
     */
    public async createUpdateDelayIncident(order: OrderFromDB) {
        try {
            const apiUrl = process.env.TRACKER_API_URL + "/incidents/" + order.deliverydelayIncident ? order.deliverydelayIncident : "";
            if (!order) { return; }
            if (order && order.deliverydelayIncident && !this.isOnTheWay(order)) { return; }
            const {
                status: { timeline = [] } = {},
                delivery: { expectedDeliveryTime = "", expectedDispatchTime = "" } = {}
            } = order;
            const result = await axios[order.deliverydelayIncident ? "put" : "post"](
                apiUrl,
                {
                    brand:
                    order.brand,
                    data: {
                        acceptanceTime: this.getTimelineEvent(timeline, "accepted")?.occurredAt,
                        deliveryTime: this.getTimelineEvent(timeline, "received")?.occurredAt,
                        dispatchedTime: this.getTimelineEvent(timeline, "dispatched")?.occurredAt,
                        distanceSeconds: moment(expectedDeliveryTime).diff(moment(expectedDispatchTime)),
                        orderData: order,
                        orderNumber: order.externalId,
                        orderTime: order.createdAt,
                    },
                    outletIdentifier: order.outletIdentifier,
                    type: "deliverydelay",
                }, {
                headers: {
                    Authorization: "Bearer " + process.env.TRACKER_API_KEY,
                    "Content-type": "application/json",
                }
            });
            console.info(`Successfully ${order.deliverydelayIncident ? "updated" : "created"} incident in partner tracker`, result);
            // Create an entry in our db for the above deliverDelayIncident
            if (!order.deliverydelayIncident) {
                const resultData = result.data.data;
                const updateData: any = { updatedAt: new Date() };
                updateData[resultData.type + "Incident"] = resultData._id;
                await OrderModel.update(
                    {
                        _id: order._id,
                    },
                    {
                        $set: updateData,
                    },
                );
            }

        } catch (err) {
            console.error("received error when trying to create incident in partner tracker");
            console.error(err.message);
        }
    }

    private async sendToPartnerTracker(orderIn: OrderFromDB) {
        try {
                    const order = (await OrderModel.findOne({ internalId: orderIn.internalId })) as OrderFromDB | null;
        if (!order) {
            throw new Error(`no order exists with id ${orderIn.internalId}`);
        }
        const {
                status: { timeline = [], current = "" } = {},
                internalId ="",
                outletIdentifier="",
                brand=""
            } = order;
        const apiUrl = process.env.TRACKER_API_URL;
        await axios.post(
            apiUrl + "/order",
            {
                brand,
                deliveryTime: this.getTimelineEvent(timeline, "received")?.occurredAt,
                id: internalId,
                orderData: order,
                outletIdentifier,
                status: current,
            },
            {
                headers: {
                    Authorization: "Bearer " + process.env.TRACKER_API_KEY,
                    "Content-type": "application/json",
                }
            }
        );
        console.info("successfully posted order data to partner tracker");
        } catch(e) {
            console.error("Error while sending to partner", e?.message || e);
        }

    }
}

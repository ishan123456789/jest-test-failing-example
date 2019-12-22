import _ from "lodash";
import { Timeline } from "./order.additional.interface";
import { Order } from "./orders.interface";
/**
 * Just include the manipulations and other stuff
 * related to data except anthing related to Database
 */
export class OrderHelper {
    /**
     * Filter timeline and returns item having status of
     * a particular type
     */
    getTimelineEvent(timeline: Timeline[], statusToCheck: string): Timeline | null {
        if (_.isEmpty(timeline)) return null;
        return timeline.filter(timelineItem => timelineItem.status === statusToCheck)[0];
    }
    /**
     * Filter timeline and returns item having status of
     * a particular type
     */
    // TODO: Write test case for this
    isOnTheWay(order: Order): boolean {
        const { status, status: { timeline = [] } = {} } = order;
        return status?.current === "dispatched" && timeline.filter(i => i.status === "received").length === 0;
    }
}

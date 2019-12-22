// import axios from "axios";
import { advanceTo } from "jest-date-mock";
import { OrderModel } from "../orders.interface";
import { OrderService } from "../orders.service";
import {
    exampleOrder,
    exampleOrderDiffPlatform,
    exampleOrderWithLateDelivery,
    exampleOrderWithValidDelivery,
} from "./orders.helper.data";
const mockOrderModel = (OrderModel as unknown) as jest.Mock<typeof OrderModel> &
    typeof OrderModel;
jest.mock("../orders.interface");
jest.mock("axios");

describe("Order Helper", () => {
    let orderService: OrderService;
    beforeEach(() => {
        mockOrderModel.mockClear();
        orderService = new OrderService();
        advanceTo(new Date(2020, 5, 27, 12, 30, 30)); // reset to date time.
    });
    it("Checks create", async () => {
        mockOrderModel.create = jest.fn(() => exampleOrder) as any;
        const spy = jest
            .spyOn(orderService, "updateOrderAndIncident")
            .mockImplementation(() => Promise.resolve(exampleOrder) as any);

        await orderService.createOrder(exampleOrder);
        expect(mockOrderModel.create).toHaveBeenLastCalledWith(exampleOrder);
        expect(spy).toHaveBeenLastCalledWith(true, true, false, exampleOrder);
    });
    it("Checks scheduleOrderIsLateCheck", async () => {
        jest.useFakeTimers();
        orderService.scheduleOrderIsLateCheck(exampleOrderDiffPlatform);
        expect(setTimeout).toHaveBeenLastCalledWith(
            expect.any(Function),
            2070000,
        );
    });
    it("Checks checkIsOrderLate", async () => {
        /** dispatchTime not present */
        mockOrderModel.findOne = jest.fn(() => exampleOrder) as any;
        let order = { ...exampleOrder };
        let isOrderLate = await orderService.checkIsOrderLate(order);
        expect(isOrderLate).toEqual(false);
        expect(mockOrderModel.findOne).toHaveBeenCalled();

        /** dispatchTime present in future */
        mockOrderModel.findOne = jest.fn(
            () => exampleOrderWithValidDelivery,
        ) as any;
        order = { ...exampleOrder };
        isOrderLate = await orderService.checkIsOrderLate(order);
        expect(isOrderLate).toEqual(false);

        /** dispatchTime present in past */
        mockOrderModel.findOne = jest.fn(
            () => exampleOrderWithLateDelivery,
        ) as any;
        order = { ...exampleOrder };
        isOrderLate = await orderService.checkIsOrderLate(order);
        expect(isOrderLate).toEqual(true);
    });
    // it("Check createUpdateDelayIncident", async () => {
    //     const postMock = jest.fn(() => ({}));
    //     const putMock = jest.fn(() => ({}));
    //     (axios.post as jest.Mock<any>).mockImplementationOnce(postMock);
    //     (axios.put as jest.Mock<any>).mockImplementationOnce(putMock);
    //     let res = await orderService.createUpdateDelayIncident(({} as unknown) as OrderFromDB);
    //     expect(res).toBe(undefined);
    // });
});

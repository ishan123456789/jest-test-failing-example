import { OrderHelper } from "../orders.helper";
import { exampleOrder } from "./orders.helper.data";

describe("Order Helper", () => {
    let helperService: OrderHelper;
    beforeAll(() => {
        helperService = new OrderHelper();
    });
    it("Check Timeline", () => {
        const {
            status: { timeline },
        } = exampleOrder;
        expect(helperService.getTimelineEvent(timeline, "accepted")).toEqual({ status: "accepted", occurredAt: "" });
        expect(helperService.getTimelineEvent([], "accepted")).toEqual(null);
    });
});

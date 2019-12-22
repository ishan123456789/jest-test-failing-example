import { OrdersController } from "../orders.controller";
import { OrderService } from "../orders.service";

describe("Order Controller", () => {
    it("Tests if functions exists", () => {
        const order = new OrdersController(new OrderService());
        expect(order).toBeTruthy();
    });
});

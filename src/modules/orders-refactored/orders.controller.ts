import { ParameterizedContext } from "koa";
import Router from "koa-router";
import { OrderValidationSchema } from "./orders.interface";
import { OrderService } from "./orders.service";

export class OrdersController {
    constructor(private orderService: OrderService) {}
    /**
     *  @route /order
     *  @method post
     */
    public index = async (
        ctx: ParameterizedContext<any, Router.IRouterParamContext<any, {}>>,
    ): Promise<void> => {
        try {
            await OrderValidationSchema.validate(ctx.request.body);
            this.orderService.createOrder(ctx.request.body);
            ctx.body = "Success";
        } catch (e) {
            ctx.log.error("Error", e);
            ctx.throw(400, e.message || e);
        }
    };
}

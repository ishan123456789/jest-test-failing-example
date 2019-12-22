import Router from "koa-router";
import { OrdersController } from "./orders.controller";
import { OrderService } from "./orders.service";

const router = new Router();

const orders: OrdersController = new OrdersController(new OrderService());
router.post("/", orders.index);

export const orderRoute = router.routes();

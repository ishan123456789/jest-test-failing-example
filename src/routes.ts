import Router from "koa-router";
import { orderRoute } from "./modules/orders-refactored/orders.routes";
const apiRouter = new Router();
apiRouter.use("/order", orderRoute);

export default apiRouter;

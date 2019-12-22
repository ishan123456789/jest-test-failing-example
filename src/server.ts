import Koa from "koa";
import pino from "koa-pino-logger";
import helmet from "koa-helmet";
import compress from "koa-compress";
import bodyParser from "koa-bodyparser";
import apiRouter from "./routes";
import mongoose from "mongoose";
import authMiddleware from "./helper/auth.middleware";
import cors from "@koa/cors";
import { checkOriginAgainstWhitelist } from "./common/whitelist";
import { logger } from "./helper/logger";

const app = new Koa();
app.use(helmet())
    .use(bodyParser())
    .use(
        pino({
            level: process.env.DEBUG_LEVEL || "debug",
        }),
    )
    .use(
        compress({
            threshold: 2048,
            flush: require("zlib").Z_SYNC_FLUSH,
        }),
    )
    .use(authMiddleware)
    .use(apiRouter.routes())
    .use(cors({ origin: checkOriginAgainstWhitelist }));
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/OrderStats", {
        useNewUrlParser: true,
        reconnectTries: 10,
        useUnifiedTopology: true,
    })
    .catch(error => logger.error("Error while connecting to mongodb", error));
const port = process.env.PORT || 1337;
logger.info(`Server running on port http://localhost:${port}`);
export default app.listen(port);

import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import compress from "koa-compress";
import helmet from "koa-helmet";
import mongoose from "mongoose";
import apiRouter from "./routes";

const app = new Koa();
app.use(helmet())
    .use(bodyParser())

    .use(
        compress({
            threshold: 2048,
            flush: require("zlib").Z_SYNC_FLUSH,
        }),
    )
    .use(apiRouter.routes())
    .use(cors({ origin: checkOriginAgainstWhitelist }));
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1/OrderStats", {
        useNewUrlParser: true,
        reconnectTries: 10,
        useUnifiedTopology: true,
    })
    .catch(error => console.error("Error while connecting to mongodb", error));
const port = process.env.PORT || 1337;
console.info(`Server running on port http://localhost:${port}`);
export default app.listen(port);

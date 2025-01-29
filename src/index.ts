import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import mongoose from "mongoose";

let server: ReturnType<typeof app.listen>;

mongoose
  .connect(env.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");

    server = app.listen(env.PORT, () => {
      const { NODE_ENV, HOST, PORT } = env;
      logger.info(`${NODE_ENV} server running on http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB", error);
    process.exit(1);
  });

const onCloseSignal = () => {
  logger.info("sigint received, shutting down");
  server.close(async () => {
    await mongoose.connection.close();
    logger.info("server closed");
    process.exit();
  });
  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);

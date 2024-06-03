import ExpressApp from "./app";
import { appConfig } from "./config";

export const expressApp = new ExpressApp();

process.on("SIGINT", () => {
  expressApp.close();
  process.exit(1);
});

expressApp
  .listen(appConfig.port)
  .then(() => {})
  .catch((error) => {});

import connectToMongoDb from "./db";
import initializeEnvConfigs from "./config";

async function appBootUp() {
  initializeEnvConfigs();
  connectToMongoDb();
}

export default appBootUp;

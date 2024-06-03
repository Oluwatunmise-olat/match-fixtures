import mongoose from "mongoose";

import { dbConfig } from "@app/config";

export default function connectToMongoDb() {
  mongoose
    .connect(dbConfig.mongodb.uri)
    .then(() => {})
    .catch((error) => {
      process.exit(1);
    });
}

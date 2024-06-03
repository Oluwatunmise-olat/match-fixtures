require("dotenv").config();

const dbConfig = {
  mongodb: {
    uri: process.env.MONGO_URI,
  },
};

const appConfig = {
  port: process.env.PORT || 34003,
  app_name: process.env.APP_NAME || "match-fixtures",
};

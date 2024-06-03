import bodyParser from "body-parser";
import cors from "cors";
import "reflect-metadata";
import express from "express";
import { container, injectable } from "tsyringe";

import bootUp from "./bootup";
import { Server } from "./shared/types/http.type";
import { RedisClient } from "./shared/utils/redis.utils";
import applicationRoutes from "./shared/routes/index.routes";

@injectable()
class App {
  public server: Server;

  constructor() {
    bootUp();
    this.initializeApp();
    this.initializeAppMiddlewares();
  }

  private initializeApp() {
    this.server = express();
    container.resolve(RedisClient);
  }

  private initializeAppMiddlewares() {
    this.server.use(cors({ origin: "*" }));
    this.server.use(bodyParser.json({ limit: "10mb" }));
    this.server.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
    // this.server.use(loggerMiddleware)

    applicationRoutes(this.server);
  }

  public async close() {
    container.resolve(RedisClient).disconnect();
  }

  public async listen(port: number) {
    await this.server.listen(port);
  }
}

export default App;

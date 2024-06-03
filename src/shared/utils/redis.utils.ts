import type { RedisClientType } from "redis";
import * as redis from "redis";
import { singleton } from "tsyringe";

import { redisConfig } from "@config/index";

@singleton()
export class RedisClient {
  private instance: RedisClientType;

  constructor() {
    this.instance = redis.createClient({
      socket: { host: redisConfig.host, port: redisConfig.port },
      password: redisConfig.password ?? "",
    });

    this.instance.connect();
    this.registerLoggers();
  }

  getInstance(): RedisClientType {
    if (!this.instance) new RedisClient();
    return this.instance;
  }

  private registerLoggers() {
    this.instance.on("error", () => {});

    this.instance.on("connect", () => {});
  }

  disconnect() {
    if (this.instance) this.instance.quit();
  }
}

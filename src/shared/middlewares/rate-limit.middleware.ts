import { StatusCodes } from "http-status-codes";
import ms from "ms";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { container } from "tsyringe";
import { Request, Response } from "express";

import { RateLimitingConfig } from "@app/shared/types/base.type";
import { errorResponse } from "../utils/http.utils";
import { RedisClient } from "../utils/redis.utils";

const redisClient = container.resolve(RedisClient).getInstance();

export default (rateLimitingConfig: RateLimitingConfig) => {
  const redisRateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate-limiter",
    points: rateLimitingConfig.maxRequests,
    duration: ms(rateLimitingConfig.window) / 1000,
  });

  return async (request: Request, response: Response, next: any) => {
    try {
      // Rate limit based on authorization header or ip address
      await redisRateLimiter.consume(
        (request.headers?.authorization ||
          request.headers["x-forwarded-for"] ||
          request.socket.remoteAddress) as string
      );

      return next();
    } catch (err) {
      const rlResIp = await redisRateLimiter.get(
        (request.headers?.authorization ||
          request.headers["x-forwarded-for"] ||
          request.socket.remoteAddress) as string
      );
      const retryInSecs = Math.round(rlResIp!.msBeforeNext / 1000) || 1;

      response.setHeader("Retry-After", String(retryInSecs));
      return errorResponse({
        response,
        errorStatusCode: StatusCodes.TOO_MANY_REQUESTS,
        message: "Too many requests",
      });
    }
  };
};

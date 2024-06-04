import jwt from "jsonwebtoken";

import { appConfig } from "@app/config";
import { JwtPayloadContract } from "../types/jwt.type";

export const generateJwtToken = (
  payload: JwtPayloadContract,
  expiresIn: number = 60 * 60
) => {
  return jwt.sign(payload, appConfig.app_key!, {
    expiresIn,
  });
};

export const decodeJwtToken = (token: string) => {
  const decoded = jwt.verify(token, appConfig.app_key!) as JwtPayloadContract;
  return decoded;
};

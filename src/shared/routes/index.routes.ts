import { appConfig } from "@app/config";
import { Server } from "../types/http.type";

export default (server: Server) => {
  const apiVersion = appConfig.version;
};

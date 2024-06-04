export type RateLimitingConfig = {
  maxRequests: number;
  window: string;
};

export type ServiceLayerResponse<T = any> = {
  status: boolean;
  message: string;
  data?: T;
  errorStatusCode?: number;
};

export type ObjectLiteral = {
  [key: string]: any;
};

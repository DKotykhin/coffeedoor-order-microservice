/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "health.check";

export interface Empty {
}

export interface HealthCheckResponse {
  status: HealthCheckResponse_ServingStatus;
}

export enum HealthCheckResponse_ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
  UNRECOGNIZED = -1,
}

export const HEALTH_CHECK_PACKAGE_NAME = "health.check";

export interface HealthCheckClient {
  check(request: Empty): Observable<HealthCheckResponse>;
}

export interface HealthCheckController {
  check(request: Empty): Promise<HealthCheckResponse> | Observable<HealthCheckResponse> | HealthCheckResponse;
}

export function HealthCheckControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["check"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("HealthCheck", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("HealthCheck", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HEALTH_CHECK_SERVICE_NAME = "HealthCheck";

import cors from "cors";
import { ConfigModule } from "@medusajs/framework/types";
import { parseCorsOrigins } from "@medusajs/framework/utils";
import {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework";

export async function applyStoreCors(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const configModule: ConfigModule = req.scope.resolve("configModule");

  return cors({
    origin: parseCorsOrigins(configModule.projectConfig.http.storeCors),
    credentials: true,
  })(req, res, next);
}

import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";

export default function (
  _req: MedusaRequest,
  _res: MedusaResponse,
  next: MedusaNextFunction
) {
  return next();
}

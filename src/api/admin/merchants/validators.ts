import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "@medusajs/framework/zod";

export const AdminGetMerchantsParamsFields = z.object({
  q: z.string().optional(),
});

export type AdminGetMerchantsParamsType = z.infer<typeof AdminGetMerchantsParams>;

export const AdminGetMerchantsParams = z.object({
  ...createFindParams({
    limit: 50,
    offset: 0,
  }).shape,
  ...AdminGetMerchantsParamsFields.shape,
});

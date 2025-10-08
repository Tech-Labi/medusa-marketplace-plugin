import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

export const AdminGetMerchantsParamsFields = z.object({
  q: z.string().optional(),
});

export type AdminGetMerchantsParamsType = z.infer<typeof AdminGetMerchantsParams>;
export const AdminGetMerchantsParams = createFindParams({
  limit: 50,
  offset: 0,
}).merge(AdminGetMerchantsParamsFields);

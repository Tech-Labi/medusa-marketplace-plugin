import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { UserDTO } from "@medusajs/framework/types";
import { getMerchantsListWorkflow } from "../../../workflows/get-merchants-list";
import { AdminGetMerchantsParamsType } from "./validators";

export const GET = async (req: MedusaRequest<AdminGetMerchantsParamsType>, res: MedusaResponse) => {
  const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;
  const { result } = await getMerchantsListWorkflow(req.scope).run({
    input: {
      userId: loggedInUser.id,
      isSuperAdmin: !!loggedInUser.metadata?.is_super_admin,
      ...req.queryConfig.pagination,
      ...req.filterableFields,
    },
  });
  const { merchants, metadata } = result;
  res.json({
    merchants,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  });
};

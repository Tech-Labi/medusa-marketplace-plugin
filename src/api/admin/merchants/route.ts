import { MedusaRequest, MedusaResponse, refetchEntities } from "@medusajs/framework/http";
import { UserDTO } from "@medusajs/framework/types";
import { AdminGetMerchantsParamsType } from "./validators";

export const GET = async (req: MedusaRequest<AdminGetMerchantsParamsType>, res: MedusaResponse) => {
  const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;

  const response = await refetchEntities({
    entity: "store",
    idOrFilter: req?.filterableFields,
    scope: req.scope,
    fields: req.queryConfig?.fields,
    pagination: {
      ...req.queryConfig?.pagination,
      order: { created_at: "DESC" },
    },
  });

  const merchants = response.data.map((merchant) => ({
    ...merchant,
    store_id: merchant.id,
    user_id: merchant?.users[0]?.id,
    store_name: merchant.name,
    user_email: merchant?.users[0]?.email,
    status: "active",
    can_impersonate: !!loggedInUser.metadata?.is_super_admin,
  }));

  res.json({
    merchants,
    count: response.metadata.count,
    offset: response.metadata.skip,
    limit: response.metadata.take,
  });
};

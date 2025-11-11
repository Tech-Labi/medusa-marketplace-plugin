import { MedusaRequest } from "@medusajs/framework/http";
import { OperatorMap } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { NextFunction } from "express";

type MerchantStoresFilter = {
  q?: string;
  store_id?: OperatorMap<string>;
  user_id?: string;
  id?: string[] | string;
};

export function maybeApplyStoreSearchFilter() {
  return async function applyDateRangeFilter(req: MedusaRequest, _, next: NextFunction) {
    const filterableFields: MerchantStoresFilter = req.filterableFields;

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const q = filterableFields.q;
    delete filterableFields.q;

    if (!q) {
      return next();
    } else {
      const { data: users } = await query.graph({
        entity: "user",
        fields: ["id", "email"],
        filters: {
          email: { $ilike: `%${q}%` },
        },
      });

      const { data: usersStore } = await query.graph({
        entity: "user_store",
        fields: ["id", "user_id", "store_id"],
        filters: {
          user_id: [...users.map(user => user.id)],
        },
      });

      Object.assign(filterableFields, {
        $or: [{ id: [...usersStore.map(u => u.store_id)] }, { name: { $ilike: `%${q}%` } }],
      });
    }

    return next();
  };
}

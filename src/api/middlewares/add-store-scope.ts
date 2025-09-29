import { type MedusaNextFunction, type MedusaRequest, type MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { UserDTO } from "@medusajs/framework/types";
import { container } from "@medusajs/framework"

import * as cookie from "cookie";
import { asValue } from "awilix";

export async function addStoreScope(req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) {
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const storeId = cookies?.store_id;

  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as UserDTO;
  if (!loggedInUser) {
    return next();
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: stores } = await query.graph({
    entity: "user_store",
    fields: ["id", "store_id"],
    filters: {
      user_id: [loggedInUser.id],
    },
  });

  if (stores?.length > 0) {
    const id = stores.find((store) => store.store_id === storeId) ? storeId : stores[0].store_id;

    req.scope.register({
      currentStore: asValue({ id }),
    });
    // We use it for the import [product created hook], because we pause the workflow until it is confirmed. After confirmation, we get the container from the initial Medusa — https://github.com/medusajs/medusa/blob/develop/packages/modules/workflow-engine-inmemory/src/services/workflow-orchestrator.ts#L502
    container.register({
      currentStore: asValue({ id }),
    });
  } else if (loggedInUser.metadata?.is_super_admin) {
    const { data: stores } = await query.graph({
      entity: "store",
      fields: ["id", "name"],
      filters: {
        metadata: [
          {
            is_super_admin: true,
          },
        ],
      },
    });
    req.scope.register({
      currentStore: asValue({ id: stores[0].id }),
    });
    // We use it for the import [product created hook], because we pause the workflow until it is confirmed. After confirmation, we get the container from the initial Medusa — https://github.com/medusajs/medusa/blob/develop/packages/modules/workflow-engine-inmemory/src/services/workflow-orchestrator.ts#L502
    container.register({
      currentStore: asValue({ id: stores[0].id }),
    });
  }
  return next();
}

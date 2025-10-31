import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";
import { CreateStoreInput } from "..";

export const checkUnickStoreNameStep = createStep(
  "check-unick-user-store-name",
  async ({ user_id, store_name }: CreateStoreInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data: stores } = await query.graph({
      entity: "user_store",
      fields: ["id", "store.*"],
      filters: {
        user_id: [user_id],
      },
    });
    const isExist = stores.find((store) => store.store.name === store_name);
    if (isExist)
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The store with name "${store_name}" already exists`
      );
  }
);

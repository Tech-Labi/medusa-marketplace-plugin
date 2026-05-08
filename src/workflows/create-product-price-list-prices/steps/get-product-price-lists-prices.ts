import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreatePriceListPriceWorkflowDTO } from "@medusajs/types";
import { SUPER_ADMIN_STORE_NAME } from "../../../constants";

export type GetProductPriceListPricesInput = {
  prices: CreatePriceListPriceWorkflowDTO[];
};

export const getProductPriceListPricesStep = createStep(
  "get-super-admin-price-lists",
  async (input: GetProductPriceListPricesInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { prices } = input;

    const { data: superAdminStores } = await query.graph({
      entity: "store",
      fields: ["id"],
      filters: {
        name: SUPER_ADMIN_STORE_NAME,
      },
    });

    const { data: allPriceLists } = await query.graph({
      entity: "price_list_store",
      fields: ["id", "price_list.id"],
      filters: {
        store_id: superAdminStores.map(({ id }) => id),
      },
    });

    const priceListIds: string[] = allPriceLists
      .map(({ price_list }) => price_list.id);
    const createInput = priceListIds.map((id) => ({ id, prices }));

    return new StepResponse(createInput);
  }
);

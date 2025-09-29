import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreatePriceListPriceWorkflowDTO } from "@medusajs/types";

export type GetProductPriceListPricesInput = {
  prices: CreatePriceListPriceWorkflowDTO[];
};

export const getProductPriceListPricesStep = createStep(
  "get-super-admin-price-lists",
  async (input: GetProductPriceListPricesInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { prices } = input;

    const { data: stores } = await query.graph({
      entity: "store",
      fields: ["id"],
      filters: {
        metadata: {
          is_super_admin: true,
        },
      },
    });

    const { data: allPriceLists } = await query.graph({
      entity: "price_list_store",
      fields: ["id", "price_list.id"],
      filters: {
        store_id: stores.map(({ id }) => id),
      },
    });

    const priceListIds: string[] = allPriceLists
      .map(({ price_list }) => price_list.id);
    const createInput = priceListIds.map((id) => ({ id, prices }));

    return new StepResponse(createInput);
  }
);

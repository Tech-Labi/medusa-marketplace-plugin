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

    const { data: allPriceLists } = await query.graph({
      entity: "price_list",
      fields: ["id", "title", "stores.*"],
    });

    const priceListIds: string[] = allPriceLists
      .filter(({ stores }) => !stores?.length)
      .map(({ id }) => id);
    const createInput = priceListIds.map((id) => ({ id, prices }));

    return new StepResponse(createInput);
  }
);

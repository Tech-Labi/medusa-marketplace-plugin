import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ProductDTO } from "@medusajs/types";
import { createPriceListPricesWorkflow } from "@medusajs/medusa/core-flows";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { getProductPriceListPricesStep } from "./steps/get-product-price-lists-prices";

export const createProductPriceListPricesWorkflowId =
  "create-product-price-list-prices-workflow";

export interface CreateProductPriceListPricesWorkflowInput {
  products: ProductDTO[];
  userId: string;
}

export const createProductPriceListPricesWorkflow = createWorkflow(
  createProductPriceListPricesWorkflowId,
  (input: WorkflowData<CreateProductPriceListPricesWorkflowInput>) => {
    const { products, userId } = input;
    const store = getStoreStep({
      userId,
      fields: ["store.supported_currencies.*"],
    });

    const data = transform({ store, products }, ({ store, products }) => {
      const currencyCodes = store.supported_currencies.map(
        ({ currency_code }) => currency_code
      );

      const variantIds = products.flatMap(({ variants }) =>
        variants.map(({ id }) => id)
      );

      return {
        prices: variantIds.flatMap((variantId) =>
          currencyCodes.map((currency_code) => ({
            amount: 0,
            currency_code,
            variant_id: variantId,
          }))
        ),
      };
    });

    const createInput = getProductPriceListPricesStep(data);
    createPriceListPricesWorkflow.runAsStep({
      input: {
        data: createInput,
      },
    });

    return new WorkflowResponse(void 0);
  }
);

import {
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ProductDTO } from "@medusajs/types";
import {
  createPriceListPricesWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows";
import { getProductPriceListPricesStep } from "./steps/get-product-price-lists-prices";

export const createProductPriceListPricesWorkflowId =
  "create-product-price-list-prices-workflow";

export interface CreateProductPriceListPricesWorkflowInput {
  products: ProductDTO[];
  storeId: string;
}

export const createProductPriceListPricesWorkflow = createWorkflow(
  createProductPriceListPricesWorkflowId,
  (input: WorkflowData<CreateProductPriceListPricesWorkflowInput>) => {
    const { products, storeId } = input;

    const { data: stores } = useQueryGraphStep({
      entity: "store",
      fields: ["*", "supported_currencies.*"],
      filters: {
        id: storeId,
      },
    });

    const store = stores[0];

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

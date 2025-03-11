import { CartDTO } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import productStoreLink from "../../../links/product-store";

export type ValidateSingleStoreForProductsStepInput = {
  cart: CartDTO;
};

export const validateSingleStoreForProductsStepId =
  "validate-single-store-for-products";
/**
 * This step validates that all products belong to the same store to ensure consistency in processing.
 */
export const validateSingleStoreForProducts = createStep(
  validateSingleStoreForProductsStepId,
  async (data: ValidateSingleStoreForProductsStepInput, { container }) => {
    const { cart } = data;
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const productsIds = cart.items.map((item) => item.product_id);
    const { data: productsStores } = await query.graph({
      entity: productStoreLink.entryPoint,
      fields: ["*"],
      filters: {
        product_id: productsIds,
      },
    });

    if (productsStores.length !== 0) {
      const referenceStoreId = productsStores[0].store_id;
      const mismatchedProducts: string[] = productsStores
        .filter(({ store_id }) => store_id !== referenceStoreId)
        .map(({ product_id }) => product_id);

      if (mismatchedProducts.length > 0) {
        const mismatchedProductIds = mismatchedProducts.join(", ");

        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Products with IDs ${mismatchedProductIds} belong to different stores`
        );
      }
    }

    return new StepResponse(void 0);
  }
);

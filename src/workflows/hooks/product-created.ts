import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkProductToStoreWorkflow } from "../link-product-to-store";
import { createProductPriceListPricesWorkflow } from "../create-product-price-list-prices";

createProductsWorkflow.hooks.productsCreated(
  async ({ products }, { container }) => {
    console.log("HOOK productsCreated", products);

    const currentStore = container.resolve("currentStore") as Pick<StoreDTO, 'id'>;
    await Promise.all(
      products.map(({ id }) =>
        linkProductToStoreWorkflow(container).run({
          input: {
            productId: id,
            storeId: currentStore.id,
          },
        })
      )
    );

    if (process.env.IS_CHANNEL_PRICING_ENABLED) {
      await createProductPriceListPricesWorkflow(container).run({
        input: {
          products,
          storeId: currentStore.id,
        },
      });
    }
  }
);

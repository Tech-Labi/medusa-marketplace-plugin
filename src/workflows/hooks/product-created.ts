import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkProductToStoreWorkflow } from "../link-product-to-store";

createProductsWorkflow.hooks.productsCreated(async ({ products }, { container }) => {
  console.log("HOOK productsCreated", products);

  const currentStore = container.resolve("currentStore") as StoreDTO;
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
});

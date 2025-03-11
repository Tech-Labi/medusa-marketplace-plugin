import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { UserDTO } from "@medusajs/framework/types";
import { linkProductToStoreWorkflow } from "../link-product-to-store";

createProductsWorkflow.hooks.productsCreated(
  async ({ products }, { container }) => {
    console.log("HOOK productsCreated", products);

    const loggedInUser = container.resolve("loggedInUser") as UserDTO;
    await Promise.all(
      products.map(({ id }) =>
        linkProductToStoreWorkflow(container).run({
          input: {
            productId: id,
            userId: loggedInUser.id,
          },
        })
      )
    );
  }
);

import { StoreDTO, UserDTO } from "@medusajs/framework/types";
import { createStockLocationsWorkflow } from "@medusajs/medusa/core-flows";
import { linkStockLocationToStoreWorkflow } from "../link-stock-location-to-store";

createStockLocationsWorkflow.hooks.stockLocationsCreated(async ({ stockLocations }, { container }) => {
  console.log("HOOK stockLocationsCreated", stockLocations);

  const loggedInUser = container.resolve("loggedInUser") as UserDTO;
  const currentStore = container.resolve("currentStore") as StoreDTO;
  if (loggedInUser)
    await linkStockLocationToStoreWorkflow(container).run({
      input: {
        stockLocations,
        userId: loggedInUser.id,
        storeId: currentStore.id,
      },
    });
});

import { StoreDTO } from "@medusajs/framework/types";
import { createStockLocationsWorkflow } from "@medusajs/medusa/core-flows";
import { linkStockLocationToStoreWorkflow } from "../link-stock-location-to-store";

createStockLocationsWorkflow.hooks.stockLocationsCreated(async ({ stockLocations }, { container }) => {
  console.log("HOOK stockLocationsCreated", stockLocations);

  const currentStore = container.resolve("currentStore") as Pick<StoreDTO, 'id'>;
  if (currentStore)
    await linkStockLocationToStoreWorkflow(container).run({
      input: {
        stockLocations,
        storeId: currentStore.id,
      },
    });
});

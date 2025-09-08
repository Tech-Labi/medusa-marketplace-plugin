import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

export const retrieveStockLocationStep = createStep("retrieve-stock-location", async (_, { container }) => {
  const stockLoactionService = container.resolve(Modules.STOCK_LOCATION);

  const existingStockLocation = await stockLoactionService.listStockLocations({});

  if (existingStockLocation.length > 0) {
    return new StepResponse({ stockLocation: existingStockLocation[0] });
  }
  return new StepResponse({ stockLocation: null });
});

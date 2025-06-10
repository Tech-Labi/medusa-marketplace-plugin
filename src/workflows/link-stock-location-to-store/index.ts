import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";

import { linkStockLocationsToStoreStep } from "./steps/link-stock-location-to-store";
import { StockLocationDTO } from "@medusajs/framework/types";

export type LinkStockLocationToStoreInput = {
  stockLocations: StockLocationDTO[];
  storeId?: string;
};

export const linkStockLocationToStoreWorkflow = createWorkflow(
  "link-stock-location-to-store",
  (input: LinkStockLocationToStoreInput) => {
    const { stockLocations, storeId } = input;

    const stock_location_ids = transform({ stockLocations }, (data) => data.stockLocations.map(({ id }) => id));

    const stockLocationStoreLinks = when("check-is-need-to-link-store-to-stock-location", input, (input) => {
      return !!input.storeId;
    }).then(() => {
      return linkStockLocationsToStoreStep({
        stock_location_ids,
        store_id: storeId,
      });
    });

    return new WorkflowResponse({ stockLocations, stockLocationStoreLinks });
  }
);

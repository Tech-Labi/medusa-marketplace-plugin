import { defineLink } from "@medusajs/framework/utils";
import StockLocationModule from "@medusajs/medusa/stock-location";
import StoreModule from "@medusajs/medusa/store";

export default defineLink(
  StockLocationModule.linkable.stockLocation,
  StoreModule.linkable.store
);

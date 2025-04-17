import { defineLink } from "@medusajs/framework/utils";
import StockLocationModule from "@medusajs/medusa/stock-location";
import StoreModule from "@medusajs/medusa/store";

export default defineLink(
  {
    linkable: StockLocationModule.linkable.stockLocation,
    isList: true
  },
  {
    linkable: StoreModule.linkable.store,
    isList: true
  }
);

import { defineLink } from "@medusajs/framework/utils";
import PRICING from "@medusajs/medusa/pricing";
import StoreModule from "@medusajs/medusa/store";

export default defineLink(
  PRICING.linkable.priceList,
  StoreModule.linkable.store
);

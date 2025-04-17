import { defineLink } from "@medusajs/framework/utils";
import PRICING from "@medusajs/medusa/pricing";
import StoreModule from "@medusajs/medusa/store";

export default defineLink(
  {
    linkable: PRICING.linkable.priceList,
    isList: true
  },
  {
    linkable: StoreModule.linkable.store,
    isList: true,
  }
)

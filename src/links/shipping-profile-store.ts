import { defineLink } from "@medusajs/framework/utils";
import FulfillmentModule from "@medusajs/medusa/fulfillment";
import StoreModule from "@medusajs/medusa/store";

export default defineLink(
  {
    linkable: FulfillmentModule.linkable.shippingProfile,
    isList: true
  },
  {
    linkable: StoreModule.linkable.store,
    isList: true
  }
);

import { defineLink } from "@medusajs/framework/utils";
import FulfillmentModule from "@medusajs/medusa/fulfillment";
import StoreModule from "@medusajs/medusa/store";

export default defineLink(
  FulfillmentModule.linkable.shippingProfile,
  StoreModule.linkable.store
);

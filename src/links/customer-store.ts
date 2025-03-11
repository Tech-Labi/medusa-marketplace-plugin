import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import StoreModule from "@medusajs/medusa/store";

export default defineLink(
  CustomerModule.linkable.customer,
  StoreModule.linkable.store
);

import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import StoreModule from "@medusajs/medusa/store";

export default defineLink(
  {
    linkable: CustomerModule.linkable.customer,
    isList: true
  },
  {
    linkable: StoreModule.linkable.store,
    isList: true,
  }
)

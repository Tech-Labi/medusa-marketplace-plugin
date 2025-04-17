import OrderModule from "@medusajs/medusa/order";
import StoreModule from "@medusajs/medusa/store";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  {
    linkable: OrderModule.linkable.order,
    isList: true
  },
  {
    linkable: StoreModule.linkable.store,
    isList: true,
  }
)

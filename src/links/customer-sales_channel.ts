import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import SalesChannelModule from "@medusajs/medusa/sales-channel";

export default defineLink(
  {
    linkable: CustomerModule.linkable.customer,
    isList: true,
  },
  SalesChannelModule.linkable.salesChannel
);

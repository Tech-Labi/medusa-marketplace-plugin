import PromotionModule from "@medusajs/medusa/promotion";
import StoreModule from "@medusajs/medusa/store";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  {
    linkable: PromotionModule.linkable.campaign,
    isList: true,
  },
  {
    linkable: StoreModule.linkable.store,
    isList: true,
  }
);

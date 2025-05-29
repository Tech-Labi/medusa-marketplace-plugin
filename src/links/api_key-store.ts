import ApiKeyModule from "@medusajs/medusa/api-key";
import StoreModule from "@medusajs/medusa/store";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
  {
    linkable: ApiKeyModule.linkable.apiKey,
    isList: true,
  },
  StoreModule.linkable.store
);

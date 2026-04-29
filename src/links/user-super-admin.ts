import { defineLink } from "@medusajs/framework/utils";
import UserModule from "@medusajs/medusa/user";
import SuperAdminModule from "../modules/super-admin";

export default defineLink(
  UserModule.linkable.user,
  SuperAdminModule.linkable.superAdmin,
);

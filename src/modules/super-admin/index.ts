import { Module } from "@medusajs/framework/utils";
import SuperAdminModuleService from "./service";

export const SUPER_ADMIN_MODULE = "super_admin";

export default Module(SUPER_ADMIN_MODULE, {
  service: SuperAdminModuleService,
});

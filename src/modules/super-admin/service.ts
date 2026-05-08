import { MedusaService } from "@medusajs/framework/utils";
import SuperAdmin from "./models/super-admin";

class SuperAdminModuleService extends MedusaService({
  SuperAdmin,
}) {}

export default SuperAdminModuleService;

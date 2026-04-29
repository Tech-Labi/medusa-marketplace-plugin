import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { SUPER_ADMIN_MODULE } from "../../../modules/super-admin";
import SuperAdminModuleService from "../../../modules/super-admin/service";

export const createSuperAdminStep = createStep(
  "create-super-admin-step",
  async (_, { container }) => {
    const service: SuperAdminModuleService = container.resolve(SUPER_ADMIN_MODULE);
    const superAdmin = await service.createSuperAdmins({});

    return new StepResponse(superAdmin, { id: superAdmin.id });
  },
  async (compensationInput, { container }) => {
    if (!compensationInput?.id) {
      return;
    }
    const service: SuperAdminModuleService =
      container.resolve(SUPER_ADMIN_MODULE);
    await service.deleteSuperAdmins([compensationInput.id]);
  },
);

import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";
import { SUPER_ADMIN_MODULE } from "../../../modules/super-admin";

type LinkUserToSuperAdminInput = {
  userId: string;
  superAdminId: string;
};

export const linkUserToSuperAdminStep = createStep(
  "link-user-to-super-admin-step",
  async ({ userId, superAdminId }: LinkUserToSuperAdminInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    await link.create({
      [Modules.USER]: { user_id: userId },
      [SUPER_ADMIN_MODULE]: { super_admin_id: superAdminId },
    });

    return new StepResponse(null, { userId, superAdminId });
  },
  async ({ userId, superAdminId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);
    await link.dismiss({
      [Modules.USER]: { user_id: userId },
      [SUPER_ADMIN_MODULE]: { super_admin_id: superAdminId },
    });
  },
);

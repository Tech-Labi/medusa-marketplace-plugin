import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";
import { SUPER_ADMIN_MODULE } from "../../../modules/super-admin";

type DismissUserSuperAdminLinkInput = {
  userId: string;
  superAdminId: string;
};

export const dismissUserSuperAdminLinkStep = createStep(
  "dismiss-user-super-admin-link-step",
  async (
    { userId, superAdminId }: DismissUserSuperAdminLinkInput,
    { container },
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    await link.dismiss({
      [Modules.USER]: { user_id: userId },
      [SUPER_ADMIN_MODULE]: { super_admin_id: superAdminId },
    });

    return new StepResponse(null, { userId, superAdminId });
  },
  async ({ userId, superAdminId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);
    await link.create({
      [Modules.USER]: { user_id: userId },
      [SUPER_ADMIN_MODULE]: { super_admin_id: superAdminId },
    });
  },
);

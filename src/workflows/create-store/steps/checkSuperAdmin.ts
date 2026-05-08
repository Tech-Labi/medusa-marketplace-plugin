import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";
import { CreateStoreInput } from "..";

export const checkSuperAdminStep = createStep(
  "check-super-admin",
  async ({ user_id }: CreateStoreInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const {
      data: [user],
    } = await query.graph({
      entity: "user",
      fields: ["id", "super_admin.id"],
      filters: { id: user_id },
    });

    if (user?.super_admin?.id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Super Admin could not create multiple stores"
      );
    }
  }
);

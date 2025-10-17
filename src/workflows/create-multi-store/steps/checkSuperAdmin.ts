import { MedusaError, Modules } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";
import { IUserModuleService } from "@medusajs/types";
import { CreateMultiStoreInput } from "..";

export const checkSuperAdminStep = createStep(
  "check-super-admin",
  async ({ user_id }: Omit<CreateMultiStoreInput, "store_name">, { container }) => {
    const userService: IUserModuleService = container.resolve(Modules.USER);
    const users = await userService.listUsers({
      id: [user_id],
    });
    const user = users[0];
    if (user?.metadata?.is_super_admin === true) {
      throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Super Admin could not create multiple stores");
    }
  }
);

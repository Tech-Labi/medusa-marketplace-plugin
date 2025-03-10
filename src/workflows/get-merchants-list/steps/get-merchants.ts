import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export type GetMerchantsStepInput = {
  userId: string;
  isSuperAdmin: boolean;
};

export interface MerchantDTO {
  id: string;
  store_name: string;
  user_email: string;
  status: string;
  can_impersonate: boolean;
}

export const getMerchantsStep = createStep(
  "get-merchants-step",
  async ({ userId, isSuperAdmin }: GetMerchantsStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data: users } = await query.graph({
      entity: "user",
      fields: ["id", "email", "store.name"],
      filters: isSuperAdmin ? {} : { id: userId },
    });

    const merchants: MerchantDTO[] = users
      .filter((u) => !!u.store)
      .map((u) => ({
        id: u.id,
        store_name: u.store.name,
        user_email: u.email,
        status: "active",
        can_impersonate: isSuperAdmin,
      }));

    return new StepResponse(merchants);
  }
);

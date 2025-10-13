import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export type GetMerchantsStepInput = {
  userId: string;
  isSuperAdmin: boolean;
  skip?: number;
  take?: number;
  q?: string;
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
  async ({ userId, isSuperAdmin, skip, take, q }: GetMerchantsStepInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const filters = {
      ...(isSuperAdmin ? {} : { user_id: userId }),
    };
    if (q && q.length > 0) {
      const { data: users } = await query.graph({
        entity: "user",
        fields: ["id", "email"],
        filters: {
          email: { $ilike: `%${q}%` },
        },
      });
      const { data: stores } = await query.graph({
        entity: "store",
        fields: ["id", "name"],
        filters: {
          name: { $ilike: `%${q}%` },
        },
      });
      Object.assign(filters, {
        $or: [{ store_id: [...stores.map((store) => store.id)] }, { user_id: [...users.map((user) => user.id)] }],
      });
    } else {
      Object.assign(filters, { $or: [{ store_id: { $ne: null } }] });
    }

    const { data: users, metadata } = await query.graph({
      entity: "user_store",
      fields: ["id", "user_id", "user.email", "store.name"],
      filters: filters,
      pagination: {
        skip: skip,
        take: take,
      },
    });

    const merchants: MerchantDTO[] = users.map((u) => ({
      id: u.user_id,
      store_name: u.store.name,
      user_email: u.user.email,
      status: "active",
      can_impersonate: isSuperAdmin,
    }));

    return new StepResponse({ merchants, metadata });
  }
);

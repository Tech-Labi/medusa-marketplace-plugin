import { createHook, createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createStoresWorkflow } from "@medusajs/medusa/core-flows";

import { createUserStep } from "./steps/create-user";
import { getSalesChannelStep } from "./steps/get-sales-channel";
import { linkUserToStoreStep } from "./steps/link-user-to-store";

export type CreateStoreInput = {
  store_name: string;
  email: string;
  password: string;
  is_super_admin?: boolean;
  metadata?: Record<string, any>;
};

export const createStoreWorkflow = createWorkflow("create-store", (input: CreateStoreInput) => {
  const { user, registerResponse } = createUserStep(input);
  const salesChannel = getSalesChannelStep();

  const storesData = transform({ input, salesChannel }, (data) => [
    {
      name: data.input.store_name,
      supported_currencies: [{ currency_code: "usd", is_default: true }],
      default_sales_channel_id: data.salesChannel.id,
      metadata: data.input.is_super_admin ? { ...data.input.metadata, is_super_admin: true } : data.input.metadata,
    },
  ]);

  const stores = createStoresWorkflow.runAsStep({
    input: {
      stores: storesData,
    },
  });

  const store = stores[0];

  // super admins users do not have a link to store
  // so they will see all products and orders
  const userStoreLinkArray = when(input, (input) => {
    return !input.is_super_admin;
  }).then(() => {
    return linkUserToStoreStep({ userId: user.id, storeId: store.id });
  });

  const storeCreated = createHook("storeCreated", {
    storeId: store.id,
    salesChannel,
    userId: user.id,
  });

  return new WorkflowResponse(
    {
      store,
      user,
      userStoreLinkArray,
      registerResponse,
    },
    {
      hooks: [storeCreated],
    }
  );
});

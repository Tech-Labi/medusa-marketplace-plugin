import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createStoresWorkflow } from "@medusajs/medusa/core-flows";
import { getSalesChannelStep } from "../create-store/steps/get-sales-channel";
import { linkUserToStoreStep } from "../create-store/steps/link-user-to-store";
import { checkUnickStoreNameStep } from "./steps/checkUnickStoreName";
import { checkSuperAdminStep } from "./steps/checkSuperAdmin";

export type CreateMultiStoreInput = {
  store_name: string;
  user_id: string;
};

export const createMultiStoreWorkflow = createWorkflow("create-multi-store", (input: CreateMultiStoreInput) => {
  checkSuperAdminStep(input);
  checkUnickStoreNameStep(input);

  const salesChannel = getSalesChannelStep();

  const storesData = transform({ input, salesChannel }, (data) => [
    {
      name: data.input.store_name,
      supported_currencies: [{ currency_code: "usd", is_default: true }],
      default_sales_channel_id: data.salesChannel.id,
    },
  ]);

  const stores = createStoresWorkflow.runAsStep({
    input: {
      stores: storesData,
    },
  });

  const store = stores[0];

  const userStoreLinkArray = linkUserToStoreStep({ userId: input.user_id, storeId: store.id });

  return new WorkflowResponse({
    store,
    userStoreLinkArray,
  });
});

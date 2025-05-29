import {
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { linkApiKeyToStoreStep } from "./steps/link-apikey-to-store";

export type LinkApiKeyToStoreInput = {
  apiKeyId: string;
  storeId?: string;
  userId?: string;
};

export const linkApiKeyToStoreWorkflow = createWorkflow(
  "link-apikey-to-store",
  (input: LinkApiKeyToStoreInput) => {
    const storeIdFromUser = when("check_user_id", input, (input) => {
      return !!input.userId;
    }).then(() => {
      const store = getStoreStep(input.userId);
      return store.id;
    });

    const storeId = transform(
      { storeId: input.storeId, storeIdFromUser },
      (data) => data.storeId || data.storeIdFromUser
    );

    const apiKeyStoreLinkArray = linkApiKeyToStoreStep({
      apiKeyId: input.apiKeyId,
      storeId,
    });

    return new WorkflowResponse({
      apiKeyStoreLinkArray,
    });
  }
);

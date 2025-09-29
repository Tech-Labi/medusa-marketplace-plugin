import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { linkApiKeyToStoreStep } from "./steps/link-apikey-to-store";

export type LinkApiKeyToStoreInput = {
  apiKeyId: string;
  storeId: string;
};

export const linkApiKeyToStoreWorkflow = createWorkflow(
  "link-apikey-to-store",
  (input: LinkApiKeyToStoreInput) => {
    const apiKeyStoreLinkArray = linkApiKeyToStoreStep(input);

    return new WorkflowResponse({
      apiKeyStoreLinkArray,
    });
  }
);

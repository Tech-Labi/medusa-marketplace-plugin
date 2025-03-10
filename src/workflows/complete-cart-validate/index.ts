import { CartDTO } from "@medusajs/framework/types";
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { validateSingleStoreForProducts } from "./steps/validate-single-store-for-products";

export type CompleteCartValidateWorkflowInput = {
  cart: CartDTO;
};

export const completeCartValidateWorkflow = createWorkflow(
  "complete-cart-validate-workflow",
  (input: CompleteCartValidateWorkflowInput) => {
    validateSingleStoreForProducts(input);
    return new WorkflowResponse({ input });
  }
);

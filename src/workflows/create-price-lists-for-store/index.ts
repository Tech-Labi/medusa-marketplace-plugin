import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk";
import {
  createPriceListsWorkflow,
  CreatePriceListsWorkflowInput as MedusaCreatePriceListsWorkflowInput,
} from "@medusajs/medusa/core-flows";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { linkPriceListsToStoreStep } from "./steps/link-price-list-to-store";

export const createPriceListsForStoreWorkflowId =
  "create-price-lists-for-store-workflow";

export type CreatePriceListsWorkflowInput = {
  userId: string;
} & MedusaCreatePriceListsWorkflowInput;

export const createPriceListsForStoreWorkflow = createWorkflow(
  createPriceListsForStoreWorkflowId,
  (input: WorkflowData<CreatePriceListsWorkflowInput>) => {
    const { price_lists_data, userId } = input;

    const priceLists = createPriceListsWorkflow.runAsStep({
      input: { price_lists_data },
    });

    const price_list_ids = transform({ priceLists }, (data) =>
      data.priceLists.map(({ id }) => id)
    );

    const priceListStoreLinks = when(
      "check-is-need-to-link-store-to-price-list",
      input,
      (input) => {
        return !!input.userId;
      }
    ).then(() => {
      const store = getStoreStep(userId);
      return linkPriceListsToStoreStep({
        price_list_ids,
        store_id: store.id,
      });
    });

    return new WorkflowResponse({ priceLists, priceListStoreLinks });
  }
);

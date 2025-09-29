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
import { linkPriceListsToStoreStep } from "./steps/link-price-list-to-store";

export const createPriceListsForStoreWorkflowId =
  "create-price-lists-for-store-workflow";

export type CreatePriceListsWorkflowInput = {
  store_id: string;
} & MedusaCreatePriceListsWorkflowInput;

export const createPriceListsForStoreWorkflow = createWorkflow(
  createPriceListsForStoreWorkflowId,
  (input: WorkflowData<CreatePriceListsWorkflowInput>) => {
    const { price_lists_data, store_id } = input;

    const priceLists = createPriceListsWorkflow.runAsStep({
      input: { price_lists_data },
    });

    const price_list_ids = transform({ priceLists }, (data) =>
      data.priceLists.map(({ id }) => id)
    );

    const priceListStoreLinks = linkPriceListsToStoreStep({
      price_list_ids,
      store_id,
    });

    return new WorkflowResponse({ priceLists, priceListStoreLinks });
  }
);

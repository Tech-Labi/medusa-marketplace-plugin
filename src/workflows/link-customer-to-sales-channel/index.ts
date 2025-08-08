import {
  createWorkflow,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { linkCustomersToCustomerGroupWorkflow } from "@medusajs/medusa/core-flows";
import { linkCustomersToSalesChannelStep } from "./steps/link-customers-to-sales-channel";
import { getCustomerGroupStep } from "./steps/get-customer-group";

export const linkCustomersToSalesChannelWorkflowId =
  "link-customers-to-sales-channel";

export interface LinkCustomerToSalesChannelWorkflowInput {
  sales_channel_id: string;
  customer_ids: string[];
}

export const linkCustomersToSalesChannelWorkflow = createWorkflow(
  linkCustomersToSalesChannelWorkflowId,
  (input: WorkflowData<LinkCustomerToSalesChannelWorkflowInput>) => {
    const salesChannelCustomerLinks = when(
      "sales-channel-exists",
      input,
      (input) => {
        return !!input.sales_channel_id;
      }
    ).then(() => {
      return linkCustomersToSalesChannelStep(input);
    });

    const customerGroupId = getCustomerGroupStep(input.sales_channel_id);

    when("customer-group-exist", customerGroupId, (customerGroupId) => {
      return !!customerGroupId;
    }).then(() => {
      linkCustomersToCustomerGroupWorkflow.runAsStep({
        input: {
          id: customerGroupId,
          add: input.customer_ids,
        },
      });
    });

    return new WorkflowResponse({ customerGroupId, salesChannelCustomerLinks });
  }
);

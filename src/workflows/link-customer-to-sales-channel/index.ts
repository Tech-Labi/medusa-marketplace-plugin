import {
  createWorkflow,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { linkCustomersToCustomerGroupWorkflow } from "@medusajs/medusa/core-flows";
import { getCustomerGroupStep } from "./steps/get-customer-group";

export const linkCustomersToSalesChannelWorkflowId =
  "link-customers-to-customer-group-by-sales-channel";

export interface LinkCustomerToSalesChannelWorkflowInput {
  sales_channel_id: string;
  customer_id: string;
}

export const linkCustomersToSalesChannelWorkflow = createWorkflow(
  linkCustomersToSalesChannelWorkflowId,
  (input: WorkflowData<LinkCustomerToSalesChannelWorkflowInput>) => {
    const customerGroupId = getCustomerGroupStep(input.sales_channel_id);

    when(customerGroupId, (customerGroupId) => {
      return customerGroupId;
    }).then(() => {
      linkCustomersToCustomerGroupWorkflow.runAsStep({
        input: {
          id: customerGroupId,
          add: [input.customer_id],
        },
      });
    });

    return new WorkflowResponse(void 0);
  }
);

import {
  createHook,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { AdditionalData, CreateCustomerDTO } from "@medusajs/types";
import { createCustomersWithDublicateValidationStep } from "./steps/create-customers";
import { emitEventStep } from "@medusajs/medusa/core-flows";
import { CustomerWorkflowEvents } from "@medusajs/framework/utils";

export type CreateCustomersWorkflowInput = {
  customersData: CreateCustomerDTO[];
} & AdditionalData;

export const createCustomersWorkflowId = "create-customers-multi-store";

export const createCustomersWorkflow = createWorkflow(
  createCustomersWorkflowId,
  (input: WorkflowData<CreateCustomersWorkflowInput>) => {
    const { createdCustomers, allCustomers } = createCustomersWithDublicateValidationStep(input.customersData);

    const customersCreated = createHook("customersCreated", {
      customers: allCustomers,
      additional_data: input.additional_data,
    });

    const customerIdEvents = transform({ createdCustomers }, ({ createdCustomers }) => {
      return createdCustomers.map((v) => {
        return { id: v.id };
      });
    });

    emitEventStep({
      eventName: CustomerWorkflowEvents.CREATED,
      data: customerIdEvents,
    });

    return new WorkflowResponse(allCustomers, {
      hooks: [customersCreated],
    });
  }
);

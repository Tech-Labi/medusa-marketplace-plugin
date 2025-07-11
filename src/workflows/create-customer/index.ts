import {
  createHook,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createCustomersWorkflow } from "@medusajs/medusa/core-flows";
import { AdditionalData, CreateCustomerDTO } from "@medusajs/types";
import { validateCustomersDublicationStep } from "./steps/validate-customers-dublication";

export type CreateCustomersWorkflowInput = {
  customersData: CreateCustomerDTO[];
} & AdditionalData;

export const createCustomersWorkflowId = "create-customers-multi-store";

export const createCustomCustomersWorkflow = createWorkflow(
  createCustomersWorkflowId,
  (input: WorkflowData<CreateCustomersWorkflowInput>) => {
    const { customersToCreate, existingCustomers } = validateCustomersDublicationStep(input.customersData);

    const createdCustomers = createCustomersWorkflow.runAsStep({ input: { customersData: customersToCreate } });

    const customers = transform({ createdCustomers, existingCustomers }, ({ createdCustomers, existingCustomers }) => {
      return [...createdCustomers, ...existingCustomers];
    });

    const customersCreated = createHook("customersStoreLink", {
      createdCustomers: createdCustomers,
      existingCustomers: existingCustomers,
      customers: customers,
      additional_data: input.additional_data,
    });

    return new WorkflowResponse(customers, {
      hooks: [customersCreated],
    });
  }
);

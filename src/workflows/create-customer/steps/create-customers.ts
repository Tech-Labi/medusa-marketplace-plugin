import { CreateCustomerDTO, CustomerDTO, ICustomerModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";

export type CreateCustomersStepInput = CreateCustomerDTO[];

export const createCustomersStepId = "create-customers-with-dublicate-validation";

export const createCustomersWithDublicateValidationStep = createStep(
  createCustomersStepId,
  async (data: CreateCustomersStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER);

    const emails = [...new Set(data.map((c) => c.email))];

    const existingCustomers: CustomerDTO[] = await service.listCustomers({ email: emails });
    const existingByEmail = new Map(existingCustomers.map((customer) => [customer.email, customer]));

    const customersToCreate = data.filter((c) => !existingByEmail.has(c.email));

    const createdCustomers = await service.createCustomers(customersToCreate);

    const allCustomers = [...createdCustomers, ...existingCustomers];

    const createdCustomerIds = createdCustomers.map((c) => c.id);

    return new StepResponse({ allCustomers, createdCustomers }, createdCustomerIds);
  },
  async (createdCustomerIds, { container }) => {
    if (!createdCustomerIds?.length) {
      return;
    }

    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER);

    await service.deleteCustomers(createdCustomerIds);
  }
);

import { CreateCustomerDTO, CustomerDTO, ICustomerModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk";

export type CreateCustomersStepInput = CreateCustomerDTO[];

export const validateCustomersDublicationStepId = "validate-customers-dublication";

export const validateCustomersDublicationStep = createStep(
  validateCustomersDublicationStepId,
  async (data: CreateCustomersStepInput, { container }) => {
    const service = container.resolve<ICustomerModuleService>(Modules.CUSTOMER);

    const emails = [...new Set(data.map((c) => c.email))];

    const existingCustomers: CustomerDTO[] = await service.listCustomers({ email: emails });
    const existingByEmail = new Map(existingCustomers.map((customer) => [customer.email, customer]));

    const customersToCreate: CreateCustomersStepInput = data.filter((c) => !existingByEmail.has(c.email));

    return new StepResponse({ customersToCreate, existingCustomers });
  }
);

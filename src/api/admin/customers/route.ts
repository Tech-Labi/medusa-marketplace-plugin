import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { AdditionalData, HttpTypes } from "@medusajs/framework/types";
import { refetchCustomer } from "@medusajs/medusa/api/admin/customers/helpers";
import { AdminCreateCustomerType } from "@medusajs/medusa/api/admin/customers/validators";
import { createCustomCustomersWorkflow } from "../../../workflows/create-customer";

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateCustomerType & AdditionalData>,
  res: MedusaResponse<HttpTypes.AdminCustomerResponse>
) => {
  const { additional_data, ...rest } = req.validatedBody;

  const createCustomers = createCustomCustomersWorkflow(req.scope);

  const customersData = [
    {
      ...rest,
      created_by: req.auth_context.actor_id,
    },
  ];

  const { result } = await createCustomers.run({
    input: { customersData, additional_data },
  });

  const customer = await refetchCustomer(result[0].id, req.scope, req.queryConfig.fields);

  res.status(200).json({ customer });
};

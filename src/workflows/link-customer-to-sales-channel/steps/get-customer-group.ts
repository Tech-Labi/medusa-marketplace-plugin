import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const getCustomerGroupStep = createStep<string, string, void>(
  "get-customer-group",
  async (sales_channel_id: string, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY);

    const { data: superAdmins } = await query.graph({
      entity: "user",
      fields: ["id"],
      filters: {
        metadata: {
          is_super_admin: true,
        },
      },
    });

    const { data: salesChannels } = await query.graph({
      entity: "sales_channel",
      fields: ["name"],
      filters: {
        id: sales_channel_id,
      },
    });

    const { data: customerGroups } = await query.graph({
      entity: "customer_group",
      fields: ["id", "name"],
      filters: {
        name: salesChannels[0].name,
        created_by: superAdmins.map(({ id }) => id),
      },
    });

    return new StepResponse(customerGroups[0]?.id);
  }
);

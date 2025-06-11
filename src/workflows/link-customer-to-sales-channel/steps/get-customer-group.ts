import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const getCustomerGroupStep = createStep(
  "get-customer-group",
  async (salesChannelId: string, { container }) => {
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
        id: salesChannelId,
      },
    });

    const { data: customerGroups } = await query.graph({
      entity: "customer_group",
      fields: ["id", "name"],
      filters: {
        name: salesChannels[0].name,
        created_by: superAdmins[0].id,
      },
    });

    return new StepResponse(customerGroups[0]?.id);
  }
);

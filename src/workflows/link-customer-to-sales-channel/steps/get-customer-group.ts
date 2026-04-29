import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const getCustomerGroupStep = createStep<string, string, void>(
  "get-customer-group",
  async (sales_channel_id: string, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY);

    const { data: superAdminLinks } = await query.graph({
      entity: "super_admin",
      fields: ["user.id"],
    });
    const superAdmins = superAdminLinks
      .map((link) => link.user)
      .filter((u) => !!u?.id);

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

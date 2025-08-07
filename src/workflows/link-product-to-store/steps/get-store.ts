import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type GetStoreInput = {
  userId: string;
  fields?: string[];
};

export const getStoreStep = createStep(
  "get-store",
  async (input: GetStoreInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { userId, fields: additionalFields } = input;
    const fields = ["id", "email", "stores.*"];

    const { data: users } = await query.graph({
      entity: "user",
      fields: additionalFields ? [...fields, ...additionalFields] : fields,
      filters: {
        id: [userId],
      },
    });

    const store = users[0].stores[0];

    return new StepResponse(store);
  }
);

import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: stores } = await query.graph({
      entity: "user_store",
      fields: ["id", "store.*", "user.*"],
      filters: {
        user_id: [req.params.id as string],
      },
    });

    res.status(200).json(stores);
  } catch (error) {
    throw new MedusaError(MedusaErrorTypes.DB_ERROR, error.message);
  }
}

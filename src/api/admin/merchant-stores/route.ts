import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils";
import { UserDTO } from "@medusajs/types";

export async function GET(req: MedusaRequest<{ userId: string }>, res: MedusaResponse): Promise<void> {
  try {
    const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: stores } = await query.graph({
      entity: "user_store",
      fields: ["id", "store.*", "user.*"],
      filters: {
        user_id: [loggedInUser.id || req.body.userId],
      },
    });

    res.status(200).json(stores);
  } catch (error) {
    throw new MedusaError(MedusaErrorTypes.DB_ERROR, error.message);
  }
}

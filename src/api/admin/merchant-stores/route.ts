import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils";
import { UserDTO } from "@medusajs/types";
import { CreateMultiStoreInput, createMultiStoreWorkflow } from "../../../workflows/create-multi-store";

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

// curl -X POST http://localhost:9000/stores/multi -d '{ "user_id":"user_01JWB3NT890JHRJR98MMJ6E0H2", "store_name": "www2"}' -H 'Content-Type: application/json'
export async function POST(req: MedusaRequest<CreateMultiStoreInput>, res: MedusaResponse): Promise<void> {
  let userId: string;
  try {
    const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;
    userId = loggedInUser.id;
  } catch {
    userId = req.body.user_id;
  }

  try {
    const {
      result: { store },
    } = await createMultiStoreWorkflow(req.scope).run({
      input: {
        user_id: userId || req.body.user_id,
        store_name: req.body.store_name,
      },
    });
    res.json({
      message: "Ok",
      storeId: store.id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
}

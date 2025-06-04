import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

import { CreateMultiStoreInput, createMultiStoreWorkflow } from "../../../workflows/create-multi-store";
import { UserDTO } from "@medusajs/types";

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

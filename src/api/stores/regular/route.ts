import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

import {
  CreateStoreInput,
  createStoreWorkflow,
} from "../../../workflows/create-store";

// curl -X POST http://localhost:9000/stores/regular -d '{ "email":"regular_admin@test.com", "password": "123"}' -H 'Content-Type: application/json'

export async function POST(
  req: MedusaRequest<CreateStoreInput>,
  res: MedusaResponse
): Promise<void> {
  try {
    const { result } = await createStoreWorkflow(req.scope).run({
      input: req.body,
    });
    res.json({
      message: "Ok",
      user: result.user,
    });
  } catch (error) {
    console.error("/stores/regular error", error);

    res.status(422).json({
      message: error.message || "Error creating regular store",
      error: error.message || error,
    });
  }
}

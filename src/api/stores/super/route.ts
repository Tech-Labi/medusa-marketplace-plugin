import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

import {
  CreateStoreInput,
  createStoreWorkflow,
} from "../../../workflows/create-store";
import { createSuperAdminWorkflow } from "../../../workflows/create-super-admin";
import { SUPER_ADMIN_STORE_NAME } from "../../../constants";

// curl -X POST http://localhost:9000/stores/super -d '{ "email":"admin@test.com", "password": "123"}' -H 'Content-Type: application/json' -H 'Authorization: 123'

export async function POST(
  req: MedusaRequest<CreateStoreInput>,
  res: MedusaResponse
): Promise<void> {
  try {
    const { result } = await createStoreWorkflow(req.scope).run({
      input: {
        ...req.body,
        is_super_admin: true,
        store_name: SUPER_ADMIN_STORE_NAME,
      },
    });

    await createSuperAdminWorkflow(req.scope).run({
      input: {
        user_id: result.user.id,
      },
    });

    res.json({
      message: "Ok",
    });
  } catch (error) {
    console.error("/stores/super error", error);

    res.status(422).json({
      message: error.message || "Error creating super store",
      error: error.message || error,
    });
  }
}

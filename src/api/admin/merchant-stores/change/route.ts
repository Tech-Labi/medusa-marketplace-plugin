import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { UserDTO } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type ChangeStoreReqBody = {
  store_id: string;
};

export const POST = async (req: AuthenticatedMedusaRequest<ChangeStoreReqBody>, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  try {
    const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;

    const { store_id } = req.body;
    const { data: stores } = await query.graph({
      entity: "user_store",
      fields: ["id", "store.*", "user.*"],
      filters: {
        user_id: [loggedInUser.id],
        store_id: [store_id],
      },
    });

    if (stores.length > 0) {
      res.setHeader("Set-Cookie", `store_id=${store_id}; Path=/; HttpOnly; SameSite=Lax`);
      res.status(200).json({ message: "Store switched", store_id });
    } else {
      return res.status(403).json({ message: "Access denied to store" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error setting cashback",
      error: error.message,
    });
  }
};

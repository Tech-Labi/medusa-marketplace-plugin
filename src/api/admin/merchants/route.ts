import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { UserDTO } from "@medusajs/framework/types";
import { getMerchantsListWorkflow } from "../../../workflows/get-merchants-list";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;

  const { result } = await getMerchantsListWorkflow(req.scope).run({
    input: {
      userId: loggedInUser.id,
    },
  });

  res.json({
    merchants: result,
  });
};

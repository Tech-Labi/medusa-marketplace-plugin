import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { UserDTO } from "@medusajs/framework/types";
import { getMerchantsListWorkflow } from "../../../workflows/get-merchants-list";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;
  const limit = req.query.limit as string;
  const offset = req.query.offset as string;
  const searchString = req.query.search as string;
  const { result } = await getMerchantsListWorkflow(req.scope).run({
    input: {
      userId: loggedInUser.id,
      isSuperAdmin: !!loggedInUser.metadata?.is_super_admin,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      searchString,
    },
  });

  res.json({
    merchants: result.merchants,
    pagination: result.pagination,
  });
};

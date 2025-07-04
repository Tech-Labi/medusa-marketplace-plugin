import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { HttpTypes, UserDTO } from "@medusajs/framework/types";
import { fetchPriceList } from "@medusajs/medusa/api/admin/price-lists/helpers";
import { AdminCreatePriceListType } from "@medusajs/medusa/api/admin/price-lists/validators";
import { createPriceListsForStoreWorkflow } from "../../../workflows/create-price-lists-for-store";

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreatePriceListType>,
  res: MedusaResponse<HttpTypes.AdminPriceListResponse>
) => {
  const workflow = createPriceListsForStoreWorkflow(req.scope);
  const loggedInUser = req.scope.resolve("loggedInUser") as UserDTO;
  const { result } = await workflow.run({
    input: { price_lists_data: [req.validatedBody], user: loggedInUser },
  });

  const price_list = await fetchPriceList(
    result.priceLists[0].id,
    req.scope,
    req.queryConfig.fields
  );

  res.status(200).json({ price_list });
};

import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IUserModuleService } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const reqQuery: any = req.query as any;
  const userId = reqQuery.userId;

  const userService = req.scope.resolve<IUserModuleService>(Modules.USER);

  const userToImpersonate = await userService.retrieveUser(userId);
  if (!userToImpersonate) {
    return res.status(404).send("User not found");
  }
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: stores } = await query.graph({
    entity: "user_store",
    fields: ["id", "store.*", "user.*"],
    filters: {
      user_id: [userToImpersonate.id],
    },
  });
  const storeId = stores[0].store_id;
  res.append("Set-Cookie", "store_id=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  res.append("Set-Cookie", `store_id=${storeId}; Path=/; HttpOnly; SameSite=Lax`);

  req.session.impersonate_user_id = userToImpersonate.id;
  res.status(200).json({
    impersionated_as: {
      email: userToImpersonate.email,
      id: userToImpersonate.id,
    },
  });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  delete req.session.impersonate_user_id;
  res.append("Set-Cookie", "store_id=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  res.status(200).send();
};

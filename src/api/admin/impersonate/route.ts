import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IUserModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query: any = req.query as any;
  const userId = query.userId;

  const userService = req.scope.resolve<IUserModuleService>(Modules.USER);

  const userToImpersonate = await userService.retrieveUser(userId);
  if (!userToImpersonate) {
    return res.status(404).send("User not found");
  }

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
  res.status(200).send();
};

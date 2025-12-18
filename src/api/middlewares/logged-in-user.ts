import type {
  MedusaNextFunction,
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import {
  IUserModuleService,
  IApiKeyModuleService,
} from "@medusajs/framework/types";

export async function registerLoggedInUser(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const allowApiKeysForVendors =
    process.env.ALLOW_API_KEYS_FOR_VENDORS == "true";
  let userIdFromApiKey;

  if (
    allowApiKeysForVendors &&
    req.auth_context?.actor_type === "api-key" &&
    req.auth_context?.actor_id
  ) {
    const apiKeyId = req.auth_context?.actor_id;
    const apiKeyService = req.scope.resolve<IApiKeyModuleService>(
      Modules.API_KEY
    );
    const apiKey = await apiKeyService.retrieveApiKey(apiKeyId);
    userIdFromApiKey = apiKey.created_by;
  }

  const userModuleService: IUserModuleService = req.scope.resolve(Modules.USER);
  const userId =
    req.session?.impersonate_user_id ||
    req.session?.auth_context?.actor_id ||
    userIdFromApiKey;
  if (userId) {
    const user = await userModuleService.retrieveUser(userId);
    req.scope.register({
      loggedInUser: {
        resolve: () => user,
      },
    });
  }

  next();
}

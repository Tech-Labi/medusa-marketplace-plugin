import type {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
} from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import {
  IApiKeyModuleService,
  IUserModuleService,
} from "@medusajs/framework/types";
import { container } from "@medusajs/framework";

export async function registerLoggedInUser(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  const allowApiKeysForVendors =
    process.env.ALLOW_API_KEYS_FOR_VENDORS !== "false";

  let userId;

  // API request with Publishable API key
  const publishableApiKey = req.headers["x-publishable-api-key"];
  if (publishableApiKey) {
    const apiKeyService = container.resolve<IApiKeyModuleService>(
      Modules.API_KEY,
    );
    const apiKeys = await apiKeyService.listApiKeys({
      token: publishableApiKey,
    });
    if (apiKeys.length === 0) {
      res.status(403).json({
        type: "invalid_request_error",
        message: "Forbidden",
      });
      return;
    }
    const apiKey = apiKeys[0];
    userId = apiKey.created_by;

    // Dashboard request
  } else if (
    req.session?.impersonate_user_id ||
    req.session?.auth_context?.actor_id
  ) {
    userId =
      req.session?.impersonate_user_id || req.session?.auth_context?.actor_id;

    // API request with Secret API key
  } else if (
    allowApiKeysForVendors &&
    req.auth_context?.actor_type === "api-key" &&
    req.auth_context?.actor_id
  ) {
    // {
    //     actor_id: 'apk_01KABDR1KYS5R4QPY1HVM70EX6',
    //     actor_type: 'api-key',
    //     auth_identity_id: '',
    //     app_metadata: {}
    //   }
    const apiKeyId = req.auth_context?.actor_id;
    const apiKeyService = container.resolve<IApiKeyModuleService>(
      Modules.API_KEY,
    );
    const apiKey = await apiKeyService.retrieveApiKey(apiKeyId);
    userId = apiKey.created_by;

    // login via js sdk
  } else if (
    req.auth_context?.actor_type === "user" &&
    req.auth_context?.actor_id
  ) {
    userId = req.auth_context?.actor_id;
  } else {
    // We want to return FORBIDDEN here
    // but there is a case where login via js SDK.
    // The request to /admin/users/me does not have a session yet, so we need to allow it.
    //
    // res.status(403).json({
    //     type: "invalid_request_error",
    //     message: "Forbidden",
    // });
    //
    next();
    return;
  }

  const userModuleService: IUserModuleService = req.scope.resolve(Modules.USER);
  const user = await userModuleService.retrieveUser(userId);

  req.scope.register({
    loggedInUser: {
      resolve: () => user,
    },
  });

  next();
}

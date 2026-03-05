import type {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
} from "@medusajs/framework/http";
import { container } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  IApiKeyModuleService,
  IStoreModuleService,
} from "@medusajs/framework/types";

export async function registerCurrentStore(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  let apiKeyId;
  let storeId;

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
    apiKeyId = apiKeys[0].id;

    // Dashboard request
  } else if (
    req.session?.impersonate_user_id ||
    req.session?.auth_context?.actor_id
  ) {
    storeId = req.cookies["store_id"];
    if (!storeId) {
      // do nothing, can't get a store anyhow
      //
      next();
      return;
    }
    // API request with Secret API key
  } else if (
    req.auth_context?.actor_type === "api-key" &&
    req.auth_context?.actor_id
  ) {
    // {
    //     actor_id: 'apk_01KABDR1KYS5R4QPY1HVM70EX6',
    //     actor_type: 'api-key',
    //     auth_identity_id: '',
    //     app_metadata: {}
    //   }
    apiKeyId = req.auth_context?.actor_id;
  } else {
    res.status(403).json({
      type: "invalid_request_error",
      message: "Forbidden",
    });
    return;
  }

  // get store by api key
  let store;
  if (apiKeyId) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data: apiKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "store.*"],
      filters: {
        id: [apiKeyId],
      },
    });
    store = apiKeys[0].store;
  } else {
    const storeService = container.resolve<IStoreModuleService>(Modules.STORE);
    store = await storeService.retrieveStore(storeId);
  }

  req.scope.register({
    currentStore: {
      resolve: () => store,
    },
  });

  next();
}

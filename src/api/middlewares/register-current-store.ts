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
  UserDTO,
} from "@medusajs/framework/types";
import * as cookie from "cookie";

export async function registerCurrentStore(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction,
) {
  let apiKeyId;
  let storeId;

  const loggedInUser = req.scope.resolve("loggedInUser", {
    allowUnregistered: true,
  }) as UserDTO;
  if (!loggedInUser) {
    return next();
  }

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
    // request from Admin panel
    //
    // check if active store selected (Multi-Store feature)
    const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
    const cookieStoreId = cookies?.store_id;
    if (!cookieStoreId) {
      // then let's just grab 1st store of user
      const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
      const { data: stores } = await query.graph({
        entity: "user_store",
        fields: ["id", "store_id"],
        filters: {
          user_id: [loggedInUser.id],
        },
      });
      storeId = stores[0]?.store_id;
      if (!storeId) {
        // TODO: if use both dashboard and iso platform
        next();
        return;
      }
    } else {
      storeId = cookieStoreId;
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
    // request via js sdk
  } else if (
    req.auth_context?.actor_type === "user" &&
    req.auth_context?.actor_id
  ) {
    // a user does not have any stores, so do nothing here
    next();
    return;
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

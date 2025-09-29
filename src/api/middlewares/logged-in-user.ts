import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { IUserModuleService } from "@medusajs/framework/types";
import { container } from "@medusajs/framework"

export async function registerLoggedInUser(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const userModuleService: IUserModuleService = req.scope.resolve(Modules.USER);
  const userId =
    req.session?.impersonate_user_id || req.session?.auth_context?.actor_id;
  if (userId) {
    const user = await userModuleService.retrieveUser(userId);
    req.scope.register({
      loggedInUser: {
        resolve: () => user,
      },
    });
    // We use it for the import [product created hook], because we pause the workflow until it is confirmed. After confirmation, we get the container from the initial Medusa — https://github.com/medusajs/medusa/blob/develop/packages/modules/workflow-engine-inmemory/src/services/workflow-orchestrator.ts#L502
    container.register({
      loggedInUser: {
        resolve: () => user,
      },
    });
  }

  next();
}

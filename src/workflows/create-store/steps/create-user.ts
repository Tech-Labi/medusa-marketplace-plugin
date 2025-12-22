import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreateStoreInput } from "..";
import { Modules } from "@medusajs/framework/utils";
import {
  IUserModuleService,
  IAuthModuleService,
  AuthenticationInput,
} from "@medusajs/framework/types";

export type CreateUserStepCompensationInput = {
  userId?: string;
  authIdentityId?: string;
};

export const createUserStep = createStep(
  "create-user-step",
  async (
    input: Required<
      Omit<CreateStoreInput, "user_id" | "store_name" | "metadata">
    >,
    { container }
  ) => {
    const userService: IUserModuleService = container.resolve(Modules.USER);
    const authService: IAuthModuleService = container.resolve(Modules.AUTH);
    const compensationInput: CreateUserStepCompensationInput = {};

    try {
      // 1. create user
      const user = await userService.createUsers({
        ...input,
        metadata: input.is_super_admin ? { is_super_admin: true } : undefined,
      });
      compensationInput.userId = user.id;

      // 2. create auth identity
      const registerResponse = await authService.register("emailpass", {
        body: {
          email: input.email,
          password: input.password,
        },
      } as AuthenticationInput);
      compensationInput.authIdentityId = registerResponse.authIdentity.id;

      // 3. attach auth identity to user
      await authService.updateAuthIdentities({
        id: registerResponse.authIdentity.id,
        app_metadata: {
          user_id: user.id,
        },
      });

      // 4. do we want to authenticate immediately?
      //
      // const authenticationResponse = await authService.authenticate("emailpass", {
      //   body: {
      //     email: input.email,
      //     password: input.password,
      //   },
      // } as AuthenticationInput);

      return new StepResponse({ user, registerResponse }, compensationInput);
    } catch (error) {
      return StepResponse.permanentFailure(
        error,
        compensationInput
      );
    }
  },
  async (input: CreateUserStepCompensationInput, { container }) => {
    const userService: IUserModuleService = container.resolve(Modules.USER);
    const authService: IAuthModuleService = container.resolve(Modules.AUTH);

    if (input?.userId) {
      await userService.deleteUsers([input.userId]);
    }
    if (input?.authIdentityId) {
      await authService.deleteAuthIdentities([input.authIdentityId]);
    }
  }
);

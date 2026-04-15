import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreateStoreInput } from "..";
import { Modules } from "@medusajs/framework/utils";
import {
  IUserModuleService,
  IAuthModuleService,
  AuthenticationInput,
} from "@medusajs/framework/types";

type CreateUserInput = {
  email: string;
  password: string;
  is_super_admin?: boolean;
  metadata?: Record<string, any>;
};

export type CreateUserStepCompensationInput = {
  userId?: string;
  authIdentityId?: string;
  metadata?: Record<string, any>;
};

export const createUserStep = createStep(
  "create-user-step",
  async (input: CreateUserInput, { container }) => {
    const userService: IUserModuleService = container.resolve(Modules.USER);
    const authService: IAuthModuleService = container.resolve(Modules.AUTH);
    const compensationInput: CreateUserStepCompensationInput = {};

    try {
      const metadata = input.metadata || {};
      // 1. create user
      const user = await userService.createUsers({
        ...input,
        metadata: input.is_super_admin ? { ...metadata, is_super_admin: true } : metadata,
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
      return StepResponse.permanentFailure(error, compensationInput);
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
  },
);

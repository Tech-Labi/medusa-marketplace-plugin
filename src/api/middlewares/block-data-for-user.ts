import {
  type MedusaNextFunction,
  type MedusaRequest,
  type MedusaResponse,
} from "@medusajs/framework/http";
import type { LoggedInUser } from "./logged-in-user";

export enum UserType {
  ADMIN,
  VENDOR,
}

export interface FilterableField {
  name: string;
  value: any;
}

export const blockDataForUser = (
  userType: UserType,
  { name, value }: FilterableField = { name: "id", value: [] }
) => {
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    if (!req.filterableFields) {
      return next();
    }

    const loggedInUser = req.scope.resolve("loggedInUser", {
      allowUnregistered: true,
    }) as LoggedInUser | undefined;
    if (!loggedInUser) {
      return next();
    }

    const isSuperAdmin =
      !!loggedInUser.super_admin?.id && !req.session.impersonate_user_id;
    const isBlocked =
      (isSuperAdmin && userType === UserType.ADMIN) ||
      (!isSuperAdmin && userType === UserType.VENDOR);

    if (isBlocked) {
      req.filterableFields[name] = value;
    }

    return next();
  };
};

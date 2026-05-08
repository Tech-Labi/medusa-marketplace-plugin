import { isImpersonated } from "../../../utils/impersonate";
import { useMe } from "./users";
import { AdminUserWithSuperAdmin } from "../../../api/middlewares/logged-in-user";

export function useIsSuperAdmin() {
  const { user } = useMe();

  const isSuperAdmin = !!(user as AdminUserWithSuperAdmin)?.super_admin?.id && !isImpersonated();

  return { isSuperAdmin, user, isLoading: !user };
}

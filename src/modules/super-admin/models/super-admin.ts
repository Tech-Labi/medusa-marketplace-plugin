import { model } from "@medusajs/framework/utils";

const SuperAdmin = model.define("super_admin", {
  id: model.id().primaryKey(),
});

export default SuperAdmin;

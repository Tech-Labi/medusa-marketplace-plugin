export const defaultMerchantsFields = ["id", "name", "created_at", "users.*"];

export const listTransformQueryConfig = {
  defaults: defaultMerchantsFields,
  defaultLimit: 10,
  isList: true,
};

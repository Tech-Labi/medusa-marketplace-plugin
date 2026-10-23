const IMPERSIONATED_AS_KEY = "IMPERSIONATED_AS";

export const storeImpersonation = (email: string) => {
  localStorage.setItem(IMPERSIONATED_AS_KEY, email);
};

export const getImpersonatedAs = () => {
  return localStorage.getItem(IMPERSIONATED_AS_KEY);
};

export const clearImpersonation = () => {
  localStorage.removeItem(IMPERSIONATED_AS_KEY);
};

export const isImpersonated = () => {
  return !!getImpersonatedAs();
};

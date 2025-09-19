// src/utils/auth.ts
export const getAuthData = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getToken = () => getAuthData()?.data?.token;
export const getTenantId = () => getAuthData()?.data?.tenantId;
export const getUserId = () => getAuthData()?.data?.userId;
export const getRole = () => getAuthData()?.data?.user?.role;

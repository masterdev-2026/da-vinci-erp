import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:3333";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const userId =
    localStorage.getItem("davinci.userId") ??
    import.meta.env.VITE_DEV_USER_ID ??
    "dev-user";

  const companyId =
    localStorage.getItem("davinci.companyId") ??
    import.meta.env.VITE_DEV_COMPANY_ID ??
    "11111111-1111-1111-1111-111111111111";

  config.headers["x-user-id"] = userId;
  config.headers["x-company-id"] = companyId;

  return config;
});

export function setDevSession(params: { userId: string; companyId: string }) {
  localStorage.setItem("davinci.userId", params.userId);
  localStorage.setItem("davinci.companyId", params.companyId);
}

export function clearDevSession() {
  localStorage.removeItem("davinci.userId");
  localStorage.removeItem("davinci.companyId");
}
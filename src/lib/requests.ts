import axios from "axios";
import Cookies from "js-cookie";
import { isAuthenticated, user } from "@/stores/auth-stores.tsx";

const backendUrl = import.meta.env.PUBLIC_BACKEND_URL;

export async function postRequest(url: string, data: any) {
  return axios.post(`${backendUrl}${url}`, data, {
    headers: {
      Authorization: `Bearer ${Cookies.get("access")}`,
    },
  });
}

export async function getRequest(url: string) {
  return axios.get(`${backendUrl}${url}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("access")}`,
    },
  });
}

export async function loginRequest(
  username: string,
  password: string,
): Promise<void> {
  const response = await postRequest(`/login`, { username, password });
  Cookies.set("access", response.data.accessToken);
  Cookies.set("refresh", response.data.refreshToken);
  isAuthenticated.set(true);
  user.set(await fetchAccountInfo());
}

export async function logoutRequest(): Promise<void> {
  await postRequest(`/logout`, {});
  Cookies.remove("access");
  Cookies.remove("refresh");
  isAuthenticated.set(false);
  user.set(null);
}

export async function refreshRequest(): Promise<void> {
  const response = await postRequest(`/refresh`, {
    refreshToken: Cookies.get("refresh"),
  });
  Cookies.set("access", response.data.accessToken);
  Cookies.set("refresh", response.data.refreshToken);
}

export async function checkAndRefreshTokens() {
  const accessToken = Cookies.get("access");
  const refreshToken = Cookies.get("refresh");

  if (accessToken && refreshToken) {
    try {
      await refreshRequest();
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }
  return false;
}

export async function fetchAccountInfo() {
  try {
    const response = await getRequest("/account");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch account information:", error);
    throw error;
  }
}

import { history } from "umi";
import { clearAll, getToken } from "@/utils/localStorage";

const LOGIN_PATH = "/login";

const decodeTokenPayload = (token: string) => {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) {
      return null;
    }

    const normalizedPayload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload =
      normalizedPayload + "=".repeat((4 - (normalizedPayload.length % 4)) % 4);

    return JSON.parse(window.atob(paddedPayload)) as { exp?: number };
  } catch {
    return null;
  }
};

export const hasValidToken = () => {
  const token = getToken();
  if (!token) {
    return false;
  }

  const payload = decodeTokenPayload(token);
  return Boolean(payload?.exp && payload.exp > Math.floor(Date.now() / 1000));
};

export const redirectToLogin = () => {
  clearAll();

  if (typeof window === "undefined" || window.location.pathname === LOGIN_PATH) {
    return;
  }

  try {
    history.replace(LOGIN_PATH);
  } catch {
    // Umi history may not be ready if an early request fails.
    window.location.replace(LOGIN_PATH);
  }
};

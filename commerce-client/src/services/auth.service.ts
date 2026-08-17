import { UserProfile } from "@/types/user";
import { MOCK_USER } from "./mock-data";

export interface LoginPayload {
  emailOrPhone: string;
  password?: string;
  otp?: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: UserProfile; token: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = "mock_jwt_token_buyer_" + Date.now();
        const user = {
          ...MOCK_USER,
          email: payload.emailOrPhone.includes("@") ? payload.emailOrPhone : MOCK_USER.email,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("okz_auth_token", token);
        }
        resolve({ user, token });
      }, 250);
    });
  },

  async register(payload: { fullName: string; email: string; phone: string }): Promise<{ user: UserProfile; token: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = "mock_jwt_token_buyer_" + Date.now();
        const user: UserProfile = {
          ...MOCK_USER,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("okz_auth_token", token);
        }
        resolve({ user, token });
      }, 300);
    });
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_USER);
      }, 100);
    });
  },
};

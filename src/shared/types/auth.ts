import type { AuthUser } from "../../interface/auth";

export interface LoginResult {
  access_token: string;
  user: AuthUser;
}

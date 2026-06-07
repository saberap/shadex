import { Req, Res } from "@/core/types/api";

export const authApis = {
  login: {
    method: "POST",
    url: "/auth/login",
    request: Req<{
      username: string;
      password: string;
    }>(),
    response: Res<{
      roles: string[];
      groups: string[];
      resources: string[];
    }>(),
  },

  logout: {
    method: "POST",
    url: "/auth/logout",
    request: null,
    response: null,
  },
} as const;

export type AuthApiDefs = typeof authApis;

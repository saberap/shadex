import { type AuthApiDefs, authApis } from "./auth/apis";

export const apis = {
  auth: authApis,
} as const;

export type ApiDefinitions = {
  auth: AuthApiDefs;
};

export interface IError {
  type: string;
  title: string;
  status: number | string;
  detail: string;
  timestamp: number; // epoch milliseconds
  path: string;
}

export function createIErrorFromUnknown(err: unknown): IError {
  const nowMs = Date.now();

  // If already matches new shape, return as-is (best-effort)
  // small helpers to access unknown objects without 'any'
  const getString = (
    o: Record<string, unknown>,
    k: string,
    fallback = "",
  ): string => {
    const v = o[k];
    return typeof v === "string" ? v : fallback;
  };
  const getNumber = (
    o: Record<string, unknown>,
    k: string,
    fallback = nowMs,
  ): number => {
    const v = o[k];
    return typeof v === "number" ? v : fallback;
  };

  if (typeof err === "object" && err !== null) {
    const e = err as Record<string, unknown>;
    if ("detail" in e && "status" in e && "timestamp" in e) {
      return {
        type: getString(e, "type", "about:blank"),
        title: getString(e, "title", "Error"),
        status: getString(e, "status", "error"),
        detail: getString(
          e,
          "detail",
          getString(e, "message", "An error occurred"),
        ),
        timestamp: getNumber(e, "timestamp", nowMs),
        path: getString(e, "path", "/"),
      };
    }
  }

  // Fallback for older shape or unknowns
  let detail = "An error occurred";
  try {
    if (err instanceof Error) detail = err.message;
    else if (typeof err === "string") detail = err;
    else if (typeof err === "object" && err !== null) {
      const e = err as Record<string, unknown>;
      // Prefer `detail`, then `message`, then `localizedMessage`.
      const maybe =
        getString(e, "detail") ||
        getString(e, "message") ||
        getString(e, "localizedMessage");
      detail = maybe || JSON.stringify(e);
    }
  } catch (_) {
    // ignore
  }

  return {
    type: "about:blank",
    title: "Error",
    status: "error",
    detail,
    timestamp: nowMs,
    path: "/",
  };
}
export interface IResponse<T> {
  data: T;
}

export const Req = <T>() => ({}) as T;
export const Res = <T>() => ({}) as T;
export const Params = <T>() => ({}) as T;

export interface IChallengeRequest {
  challengeId: string;
  challengeResponse: string;
}

export interface IChallengeResponse {
  challengeId: string;
  challengeString: string;
  challengeMessage: string;
  challengeType: "DEFAULT" | "OTP" | "TOTP" | "PASSKEY";
  expiresIn: string;
}

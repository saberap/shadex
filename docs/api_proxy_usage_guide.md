# API Proxy Usage Guide

## Overview

This project uses a Next.js API route proxy to handle cross-origin API requests. This approach solves the `SameSite=Strict` cookie issue that occurs when making requests from the frontend to a different domain.

## Problem

When your Next.js app (running on `localhost` or your domain) makes requests to an external API (e.g., `https://api.neonteam.ir`), and that API tries to set cookies with `SameSite=Strict`, browsers will block those cookies because they come from a cross-site response.

**Error Message:**
```
This attempt to set a cookie via a Set-Cookie header was blocked because it had the "SameSite=Strict" attribute but came from a cross-site response, which was not the response to a top-level navigation.
```

## Solution

We use a Next.js API Route as a proxy that:
1. Receives requests from the frontend (same origin)
2. Forwards them to the actual API backend
3. Receives the response (including Set-Cookie headers)
4. Forwards the response back to the frontend
5. Optionally modifies `SameSite=Strict` to `SameSite=Lax` for compatibility

## Implementation

### 1. API Proxy Route

Located at: `src/app/api/proxy/[...path]/route.ts`

This catch-all route handles all HTTP methods (GET, POST, PUT, DELETE) and forwards them to the backend API.

**Key Features:**
- Forwards all request headers (except host, connection, content-length)
- Handles cookies in both directions
- Supports JSON, form-urlencoded, and multipart/form-data
- Modifies `SameSite=Strict` to `SameSite=Lax` automatically
- Preserves query parameters

### 2. HTTP Client Configuration

Located at: `src/core/utils/client.ts`

The client automatically uses the proxy when running in the browser and when enabled:

```typescript
const apiConfig: AxiosRequestConfig = {
  // Use proxy when enabled via environment variable
  baseURL:
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_API_PROXY === "true"
      ? "/api/proxy"
      : process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};
```

## Usage

No changes needed in your application code! The `useAPI` hook and `httpClient` automatically use the proxy.

### Example

```typescript
// In your component
const { mutateAsync: loginMutate } = useAPI(["auth", "login"], {
  isUrlEncoded: true,
});

// Make the request - it automatically goes through the proxy
await loginMutate({ username, password });
```

### Request Flow

1. **Frontend**: `POST /api/proxy/auth/login` (same origin)
2. **Proxy**: Forwards to `POST https://api.neonteam.ir/auth/login`
3. **Backend**: Returns response with `Set-Cookie: token=...; SameSite=Strict`
4. **Proxy**: Modifies to `Set-Cookie: token=...; SameSite=Lax`
5. **Frontend**: Receives cookie successfully

## Environment Variables

You need to configure these environment variables:

```env
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://api.neonteam.ir

# Enable/disable API proxy (true/false)
NEXT_PUBLIC_USE_API_PROXY=true
```

### Configuration Options

**`NEXT_PUBLIC_USE_API_PROXY=true`** (Recommended)
- Uses the Next.js proxy (`/api/proxy`)
- Solves SameSite cookie issues
- All requests go through same-origin

**`NEXT_PUBLIC_USE_API_PROXY=false`**
- Direct requests to backend API
- Use when backend has proper CORS and cookie configuration
- Or when you don't need cookies

### When to Use Each Setting

| Scenario | Setting | Reason |
|----------|---------|--------|
| Development (localhost) | `true` | Avoid SameSite cookie issues |
| Production (cross-domain) | `true` | Avoid SameSite cookie issues |
| Backend has `SameSite=Lax` or `SameSite=None` | `false` | Can use direct connection |
| No authentication cookies needed | `false` | Simpler, faster |
| Same domain deployment | `false` | No cross-origin issues |

## Benefits

✅ **Solves SameSite Cookie Issues**: Cookies are set on the same domain  
✅ **No CORS Issues**: All requests appear to be same-origin  
✅ **Transparent**: No code changes needed in components  
✅ **Secure**: Server-side requests can bypass browser restrictions  
✅ **Cookie Forwarding**: Automatically forwards authentication cookies  

## Alternative Solutions

If you don't want to use a proxy, you can:

### Option 1: Backend Changes (Requires Backend Access)

Ask your backend team to:
- Change `SameSite=Strict` to `SameSite=None; Secure` for cross-site requests
- Ensure CORS is properly configured with credentials support

### Option 2: Use the Same Domain

- Deploy frontend and backend on the same domain/subdomain
- Example: `app.neonteam.ir` (frontend) and `api.neonteam.ir` (backend)

## Troubleshooting

### Cookies Still Not Working?

1. **Check Browser DevTools**: 
   - Network tab → Check if cookies are being sent/received
   - Application tab → Check cookie storage

2. **Verify Proxy is Working**:
   - Check Network tab for requests to `/api/proxy/*`
   - Should see 200 status codes

3. **Check withCredentials**:
   - Ensure `withCredentials: true` in axios config

4. **HTTPS Requirement**:
   - In production, ensure both frontend and backend use HTTPS
   - For `SameSite=None`, cookies MUST have `Secure` flag (HTTPS only)

### Development Environment

The proxy works with both HTTP (development) and HTTPS (production). For local HTTPS development, the project includes self-signed certificates in the `certificates/` directory.

## Testing

Test the proxy by checking the Network tab:

```typescript
// Make any API call
const { data } = await httpClient.post("/auth/login", { 
  username: "test", 
  password: "test" 
});

// Should see:
// Request URL: http://localhost:3000/api/proxy/auth/login
// Actual API: https://api.neonteam.ir/auth/login (in server logs)
```

## Production Considerations

- The proxy adds minimal latency (one extra hop)
- Consider rate limiting on the proxy route
- Monitor proxy route performance
- Use Next.js caching when appropriate
- Consider using Edge Runtime for better performance

```typescript
// Add to route.ts for edge runtime
export const runtime = 'edge';
```

## Related Files

- `/src/app/api/proxy/[...path]/route.ts` - Proxy implementation
- `/src/core/utils/client.ts` - HTTP client with proxy configuration
- `/src/core/hooks/useAPI.ts` - API hook that uses the client
- `/.env.local` - Environment variables

## References

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [CORS with credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)

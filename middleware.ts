import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize rate limiting only if Redis credentials are available
let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
  }
} catch (error) {
  console.warn("Rate limiting disabled: Redis not configured", error);
}

export default async function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http: 'unsafe-inline' 'unsafe-eval' https://vercel.live;
    style-src 'self' 'unsafe-inline' https://vercel.live;
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // Handle API routes separately - don't apply i18n routing to them
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Apply rate limiting only if Redis is configured
    if (request.nextUrl.pathname.startsWith("/api/analyze-pdf") && ratelimit) {
      try {
        const ip = (request.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
        const { success } = await ratelimit.limit(
          `ratelimit_middleware_${ip}`
        );

        if (!success) {
          return new NextResponse("Rate limit exceeded", { status: 429 });
        }
      } catch (error) {
        console.warn("Rate limiting error:", error);
        // Continue without rate limiting if Redis fails
      }
    }

    const response = NextResponse.next();
    response.headers.set("x-nonce", nonce);
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }

  // For non-API routes, apply i18n routing
  const handleI18nRouting = createIntlMiddleware(routing);
  const response = handleI18nRouting(request);

  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", cspHeader);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\..*).*)", "/api/:path*"],
};
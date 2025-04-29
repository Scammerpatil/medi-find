import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const verifyToken = async (token: string, BASE_URL: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/auth/middleware-verify-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) throw new Error("Token verification failed");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      throw new Error("Response was not JSON");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const BASE_URL = req.nextUrl.origin;
  const isPublicPath = ["/"].includes(pathname);

  const token = req.cookies.get("token")?.value || "";
  const isLoggedIn = !!token;

  if (!isLoggedIn && !isPublicPath) {
    console.log("Not logged in, redirecting to public login page");
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  if (isLoggedIn) {
    const user = await verifyToken(token, BASE_URL);
    if (!user) {
      console.log("Token verification failed, redirecting to login");
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
    const { role, isVerified } = user.data;
    if (isVerified) {
      const dashboardPath = `/${role}/dashboard`;
      if (isPublicPath) {
        return NextResponse.redirect(
          new URL(dashboardPath, req.nextUrl.origin)
        );
      }

      return NextResponse.next();
    }

    if (!isVerified) {
      console.log("User is not admin approved, redirecting to 'not-approved'");
      return NextResponse.redirect(
        new URL("/not-approved", req.nextUrl.origin)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/user/:path*",
    "/medical-store/:path*",
    "/delivery-boy/:path*",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/change-password"];

const publicRoutes = ["/", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname) && accessToken) {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  if (protectedRoutes.includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)", "/"],
};

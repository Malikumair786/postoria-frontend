import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/feed", "/profile"];

const publicRoutes = ["/", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname) && accessToken) {
    return NextResponse.redirect(new URL(`/feed`, request.url));
  }

  if (protectedRoutes.includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)", "/"],
};

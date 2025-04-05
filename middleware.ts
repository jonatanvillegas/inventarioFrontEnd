import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Obtener token de autenticación

  const isAuth = !!token; // Verifica si el usuario está autenticado
  const isLoginPage = request.nextUrl.pathname === "/login";

  // 🔹 Si el usuario no está autenticado y no está en login, redirigir a /login
  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔹 Si el usuario está autenticado y está en /login, redirigir a /
  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/inicio", request.url));
  }

  return NextResponse.next(); // Permite continuar con la solicitud normal
}

// 🔹 Aplica el middleware a todas las rutas excepto API y archivos estáticos
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

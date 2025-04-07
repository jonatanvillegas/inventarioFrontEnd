// components/LayoutClient.tsx
"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import ClientLayout from "@/app/clientLayout";
import { Navegacion } from "@/app/types/types";

interface LayoutProps {
  children: React.ReactNode;
  navegacionData: Navegacion[]; // Recibe los datos de navegación como props
}

export default function LayoutClient({ children, navegacionData }: LayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return isLoginPage ? children : <ClientLayout navegacionData={navegacionData}>{children}</ClientLayout>;
}

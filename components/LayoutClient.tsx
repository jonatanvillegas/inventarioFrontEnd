// components/LayoutClient.tsx
"use client";

import { usePathname } from "next/navigation";
import ClientLayout from "@/app/clientLayout";
import { Navegacion } from "@/app/types/types";
import { useEffect } from "react";
import useNavegacionStore from "@/app/store/useNavegacionStore";

interface LayoutProps {
  children: React.ReactNode;
  navegacionData: Navegacion[]; // Recibe los datos de navegación como props
}

export default function LayoutClient({ children, navegacionData }: LayoutProps) {
  const setPermisos = useNavegacionStore(state => state.setPermisos)

  useEffect(() => {
    setPermisos(navegacionData)
  }, [])
  
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return isLoginPage ? children : <ClientLayout navegacionData={navegacionData}>{children}</ClientLayout>;
}

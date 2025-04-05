// components/LayoutClient.tsx
"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import ClientLayout from "@/app/clientLayout";

interface Props {
  children: ReactNode;
}

export default function LayoutClient({ children }: Props) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return isLoginPage ? children : <ClientLayout>{children}</ClientLayout>;
}

"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  X,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import "./globals.css"
import { usePathname } from "next/navigation"
import { removeCookie } from "typescript-cookie"


export default function ClientLayout({children}: {children: React.ReactNode}) {
    const pathname = usePathname(); // Obtiene la ruta actual
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    removeCookie("token");
    window.location.href = "/login"; // Redirigir al login
  };

  return (
      <div className="flex min-h-screen bg-background">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static lg:z-auto
        `}
        >
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2 font-semibold">
              <Box className="h-6 w-6" />
              <span>Inventario App</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            <Button variant={pathname === "/inicio" ? "secondary" : "ghost"}className="justify-start gap-2" asChild>
              <a href="/inicio">
                <Home className="h-5 w-5" />
                <span>Inicio</span>
              </a>
            </Button>
            <Button variant={pathname === "/productos" ? "secondary" : "ghost"} className="justify-start gap-2" asChild>
              <a href="/productos">
                <Package className="h-5 w-5" />
                <span>Productos</span>
              </a>
            </Button>
            <Button variant={pathname === "/categoria" ? "secondary" : "ghost"} className="justify-start gap-2" asChild>
              <a href="/categoria">
                <ClipboardList className="h-5 w-5" />
                <span>Categorías</span>
              </a>
            </Button>
            <Button variant={pathname === "/usuarios" ? "secondary" : "ghost"} className="justify-start gap-2" asChild>
              <a href="/usuarios">
                <Users className="h-5 w-5" />
                <span>Usuarios</span>
              </a>
            </Button>
            <Button variant={pathname === "/configuracion" ? "secondary" : "ghost"} className="justify-start gap-2" asChild>
              <a href="/configuracion">
                <Settings className="h-5 w-5" />
                <span>Configuración</span>
              </a>
            </Button>
            <div className="mt-auto pt-4">
              <Button
                variant="ghost"
                className="justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar sesión</span>
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex gap-4 md:gap-8">
              <h1>Role: <span className="font-bold">Admin</span></h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Usuario" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mi perfil</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search, Shield, Trash, UserCog, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User } from "@/app/types/types"
import { usePermisosRuta } from "@/hook/usePermisosRuta"

export default function UsuariosTable({ users }: { users: User[] }) {

  const permisos = usePermisosRuta()

  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.nombre && user.nombre.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Obtener el color del badge según el rol
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Traducir el rol para mostrar
  const translateRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador"
      default:
        return "Usuario"
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        {permisos?.crear ? (
          <Button asChild>
            <Link href="/usuarios/crear">
              <UserPlus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Link>
          </Button>
        ) : ""}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Administra los usuarios que tienen acceso al sistema de inventario.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre o correo..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <UserCog className="mr-2 h-4 w-4" />
                    Filtrar por rol
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Roles</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Todos</DropdownMenuItem>
                  <DropdownMenuItem>Administradores</DropdownMenuItem>
                  <DropdownMenuItem>Usuarios</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Email
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Fecha de creación
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Link
                          href={`/permisos/${user.id}`}
                          className="text-primary hover:underline flex items-center gap-1"
                          passHref
                        >
                          {user.nombre || "-"}
                          <Shield className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>{translateRole(user.role)}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt.toString())}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No se encontraron usuarios con ese criterio de búsqueda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
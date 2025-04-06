'use client'

import { useState, useEffect } from "react"
import { ArrowLeft, Loader2, Save, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import usePermisosStore from "@/app/store/usePermisosStore"


// Pantallas disponibles en el sistema
const pantallasDisponibles = [
    { id: "dashboard", nombre: "Dashboard", descripcion: "Panel principal del sistema" },
    { id: "productos", nombre: "Productos", descripcion: "Gestión de productos" },
    { id: "categorias", nombre: "Categorías", descripcion: "Gestión de categorías" },
    { id: "usuarios", nombre: "Usuarios", descripcion: "Gestión de usuarios" },
    { id: "ventas", nombre: "Ventas", descripcion: "Registro y consulta de ventas" },
    { id: "proveedores", nombre: "Proveedores", descripcion: "Gestión de proveedores" },
    { id: "reportes", nombre: "Reportes", descripcion: "Generación de reportes" },
    { id: "configuracion", nombre: "Configuración", descripcion: "Configuración del sistema" },
    { id: "perfil-empresa", nombre: "Perfil Empresa", descripcion: "Datos de la empresa" },
]

// Datos de ejemplo para permisos
const permisosIniciales = {
    1: [
        // Permisos para el usuario con ID 1 (Admin)
        { id: 1, usuarioId: 1, pantalla: "dashboard", ver: true, editar: true, eliminar: true, crear: true },
        { id: 2, usuarioId: 1, pantalla: "productos", ver: true, editar: true, eliminar: true, crear: true },
        { id: 3, usuarioId: 1, pantalla: "categorias", ver: true, editar: true, eliminar: true, crear: true },
        { id: 4, usuarioId: 1, pantalla: "usuarios", ver: true, editar: true, eliminar: true, crear: true },
        { id: 5, usuarioId: 1, pantalla: "ventas", ver: true, editar: true, eliminar: true, crear: true },
        { id: 6, usuarioId: 1, pantalla: "proveedores", ver: true, editar: true, eliminar: true, crear: true },
        { id: 7, usuarioId: 1, pantalla: "reportes", ver: true, editar: true, eliminar: true, crear: true },
        { id: 8, usuarioId: 1, pantalla: "configuracion", ver: true, editar: true, eliminar: true, crear: true },
        { id: 9, usuarioId: 1, pantalla: "perfil-empresa", ver: true, editar: true, eliminar: true, crear: true },
    ],
    2: [
        // Permisos para el usuario con ID 2 (Gerente)
        { id: 10, usuarioId: 2, pantalla: "dashboard", ver: true, editar: false, eliminar: false, crear: false },
        { id: 11, usuarioId: 2, pantalla: "productos", ver: true, editar: true, eliminar: false, crear: true },
        { id: 12, usuarioId: 2, pantalla: "categorias", ver: true, editar: true, eliminar: false, crear: true },
        { id: 13, usuarioId: 2, pantalla: "usuarios", ver: false, editar: false, eliminar: false, crear: false },
        { id: 14, usuarioId: 2, pantalla: "ventas", ver: true, editar: true, eliminar: false, crear: true },
        { id: 15, usuarioId: 2, pantalla: "proveedores", ver: true, editar: true, eliminar: false, crear: true },
        { id: 16, usuarioId: 2, pantalla: "reportes", ver: true, editar: false, eliminar: false, crear: false },
        { id: 17, usuarioId: 2, pantalla: "configuracion", ver: false, editar: false, eliminar: false, crear: false },
        { id: 18, usuarioId: 2, pantalla: "perfil-empresa", ver: true, editar: false, eliminar: false, crear: false },
    ],
    3: [
        // Permisos para el usuario con ID 3 (Usuario Ventas)
        { id: 19, usuarioId: 3, pantalla: "dashboard", ver: true, editar: false, eliminar: false, crear: false },
        { id: 20, usuarioId: 3, pantalla: "productos", ver: true, editar: false, eliminar: false, crear: false },
        { id: 21, usuarioId: 3, pantalla: "categorias", ver: true, editar: false, eliminar: false, crear: false },
        { id: 22, usuarioId: 3, pantalla: "usuarios", ver: false, editar: false, eliminar: false, crear: false },
        { id: 23, usuarioId: 3, pantalla: "ventas", ver: true, editar: true, eliminar: false, crear: true },
        { id: 24, usuarioId: 3, pantalla: "proveedores", ver: false, editar: false, eliminar: false, crear: false },
        { id: 25, usuarioId: 3, pantalla: "reportes", ver: true, editar: false, eliminar: false, crear: false },
        { id: 26, usuarioId: 3, pantalla: "configuracion", ver: false, editar: false, eliminar: false, crear: false },
        { id: 27, usuarioId: 3, pantalla: "perfil-empresa", ver: false, editar: false, eliminar: false, crear: false },
    ],
}

export default function PermisosPage({ params }: { params: { userId: string } }) {
    const [selectedUserId, setSelectedUserId] = useState<string>(params.userId || "")
    const [permisos, setPermisos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const { permisosUsuario, fetchPermisos } = usePermisosStore();

    useEffect(() => {
        const fetchData = async () => {
            await fetchPermisos(Number.parseInt(selectedUserId))
        }
        fetchData();
    }, [fetchPermisos])

    console.log(permisosUsuario)
    // Filtrar pantallas basado en el término de búsqueda
    const filteredPantallas = permisosUsuario.permisos.filter(
        (pantalla) =>
            pantalla.nombre.toLowerCase().includes(searchTerm.toLowerCase()) 
    )

    console.log(filteredPantallas)
    // Cargar permisos cuando se selecciona un usuario
    useEffect(() => {
        if (selectedUserId) {
            setIsLoading(true)

            // Simular carga de datos
            setTimeout(() => {
                const userId = Number.parseInt(selectedUserId)
                // Si el usuario tiene permisos definidos, usarlos
                if (permisosIniciales["1"]) {
                    setPermisos(permisosIniciales["1"])
                } else {
                    // Si no, crear permisos por defecto (todo en false)
                    const permisosDefault = pantallasDisponibles.map((pantalla, index) => ({
                        id: 1000 + index, // IDs temporales
                        usuarioId: userId,
                        pantalla: pantalla.id,
                        ver: false,
                        editar: false,
                        eliminar: false,
                        crear: false,
                    }))
                    setPermisos(permisosDefault)
                }
                setIsLoading(false)
            }, 800)
        } else {
            setPermisos([])
        }
    }, [selectedUserId])

    // Actualizar un permiso específico
    const updatePermiso = (pantallaId: number, campo: string, value: boolean) => {
        setPermisos(
            permisos.map((permiso) => {
                if (permiso.pantalla === pantallaId) {
                    // Si estamos desactivando "ver", también desactivamos los demás permisos
                    if (campo === "ver" && !value) {
                        return { ...permiso, ver: false, crear: false, editar: false, eliminar: false }
                    }
                    return { ...permiso, [campo]: value }
                }
                return permiso
            }),
        )
    }

    // Guardar los cambios de permisos
    const savePermisos = () => {
        setIsSaving(true)

        // Simular guardado en la base de datos
        setTimeout(() => {
            // Aquí iría la lógica para guardar en la base de datos
            console.log("Permisos guardados:", permisos)

            // Actualizar los permisos iniciales (simulación)
            const userId = Number.parseInt(selectedUserId)
            permisosIniciales["1"] = [...permisos]

            setIsSaving(false)
            //   toast({
            //     title: "Permisos actualizados",
            //     description: "Los permisos del usuario han sido actualizados correctamente.",
            //   })
        }, 1000)
    }

    // Obtener el color del badge según el rol
    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "bg-blue-100 text-blue-800 hover:bg-blue-100"
            case "MANAGER":
                return "bg-purple-100 text-purple-800 hover:bg-purple-100"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }

    // Traducir el rol para mostrar
    const translateRole = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "Administrador"
            case "MANAGER":
                return "Gerente"
            default:
                return "Usuario"
        }
    }

    return (
        <div className="container py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/usuarios">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Volver</span>
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Permisos</h1>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Permisos de Usuario</CardTitle>
                    <CardDescription>Configura los permisos de acceso para cada usuario del sistema.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Información del usuario seleccionado */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            {/* <div>
                <div className="font-medium text-lg">
                  {usuarios.find((u) => u.id.toString() === selectedUserId)?.nombre || "Usuario"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {usuarios.find((u) => u.id.toString() === selectedUserId)?.email || ""}
                </div>
              </div>
              <Badge
                className={getRoleBadgeColor(usuarios.find((u) => u.id.toString() === selectedUserId)?.role || "")}
              >
                {translateRole(usuarios.find((u) => u.id.toString() === selectedUserId)?.role || "")}
              </Badge> */}
                        </div>
                    </div>

                    {selectedUserId && (
                        <>
                            {/* Buscador de pantallas */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar pantallas..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Tabla de permisos */}
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <span className="ml-2 text-lg">Cargando permisos...</span>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[250px]">Pantalla</TableHead>
                                            <TableHead className="w-[100px] text-center">Ver</TableHead>
                                            <TableHead className="w-[100px] text-center">Crear</TableHead>
                                            <TableHead className="w-[100px] text-center">Editar</TableHead>
                                            <TableHead className="w-[100px] text-center">Eliminar</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* {filteredPantallas.map((pantalla) => {
                                            return (
                                                <TableRow key={pantalla.id}>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <div className="font-medium">{pantalla.nombre}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={pantalla.ver}
                                                                onCheckedChange={(checked) => updatePermiso(pantalla.id, "ver", checked)}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={pantalla.crear}
                                                                onCheckedChange={(checked) => updatePermiso(pantalla.id, "crear", checked)}
                                                                disabled={!permiso.ver} // No puede crear si no puede ver
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={permiso.editar}
                                                                onCheckedChange={(checked) => updatePermiso(pantalla.id, "editar", checked)}
                                                                disabled={!permiso.ver} // No puede editar si no puede ver
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={permiso.eliminar}
                                                                onCheckedChange={(checked) => updatePermiso(pantalla.id, "eliminar", checked)}
                                                                disabled={!permiso.ver} // No puede eliminar si no puede ver
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })} */}

                                        {filteredPantallas.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                                    No se encontraron pantallas con ese criterio de búsqueda
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}
                        </>
                    )}
                </CardContent>

                {selectedUserId && !isLoading && (
                    <CardFooter className="flex justify-between">
                        <div className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <div className="bg-primary h-2 w-2 rounded-full"></div>
                                <span>Permiso activado</span>
                            </span>
                            <span className="flex items-center gap-1 mt-1">
                                <div className="bg-input h-2 w-2 rounded-full"></div>
                                <span>Permiso desactivado</span>
                            </span>
                        </div>
                        <Button onClick={savePermisos} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </CardFooter>
                )}
            </Card>

            {/* <Toaster /> */}
        </div>
    )
}


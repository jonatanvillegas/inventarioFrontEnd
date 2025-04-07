'use client'

import { useEffect, useState,use } from 'react';
import { ArrowLeft, Loader2, Save} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import usePermisosStore from "@/app/store/usePermisosStore"
import { Permiso } from "@/app/types/types"
import { toast } from "sonner"

export default function PermisosPage({ params }: { params: Promise<{ userId: string }> }) {

    const { userId } = use(params); 
    const [selectedUserId, setSelectedUserId] = useState<string>(userId || "")
    const [permisos, setPermisos] = useState<Permiso[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const { permisosUsuario, fetchPermisos,editPermisos } = usePermisosStore();

    useEffect(() => {
        const fetchData = async () => {
            await fetchPermisos(Number.parseInt(selectedUserId))
        }
        fetchData();
    }, [fetchPermisos])

    // Cargar permisos cuando se selecciona un usuario
    useEffect(() => {
        setIsLoading(true)
        setPermisos(permisosUsuario.permisos)
        setIsLoading(false)
    }, [selectedUserId,permisosUsuario.permisos])


    // Actualizar un permiso específico
    const updatePermiso = (pantallaId: number, campo: string, value: boolean) => {
        setPermisos(
            permisos.map((permiso) => {
                if (permiso.id === pantallaId) {
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
    const savePermisos =  () => {
        setIsSaving(true)

        const EditPermisos = {
            userId: Number.parseInt(selectedUserId),
            permisos: permisos
        }
        // Simular guardado en la base de datos
        setTimeout(async() => {
           await editPermisos(EditPermisos)
            setIsSaving(false)
              toast( "Los permisos del usuario han sido actualizados correctamente.")
        }, 1000)
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
                    {selectedUserId && (
                        <>

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
                                        {permisos.map((pantalla) => {
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
                                                                disabled={!pantalla.ver} // No puede crear si no puede ver
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={pantalla.editar}
                                                                onCheckedChange={(checked) => updatePermiso(pantalla.id, "editar", checked)}
                                                                disabled={!pantalla.ver} // No puede editar si no puede ver
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center">
                                                            <Switch
                                                                checked={pantalla.eliminar}
                                                                onCheckedChange={(checked) => updatePermiso(pantalla.id, "eliminar", checked)}
                                                                disabled={!pantalla.ver} // No puede eliminar si no puede ver
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })} 
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


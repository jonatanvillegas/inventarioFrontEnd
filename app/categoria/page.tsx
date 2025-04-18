"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, FolderPlus, MoreHorizontal, PackageSearch, Pencil, Search, Tag, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateCategoriaModal } from "@/components/CategoriaModel"
import useCategoriaStore from "../store/useCategoriaStore"
import { UpdateCategoriaModal } from "@/components/updateCategoriaModel"
import { SpinnerLoad } from "@/components/SpinnerLoad"
import { usePermisosRuta } from "@/hook/usePermisosRuta"

// Datos de ejemplo para la tabla de categorías

export default function CategoriasPage() {
    const permisos = usePermisosRuta()

    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenE, setIsModalOpenE] = useState(false)
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState({
        id: 0,
        nombre: ''
    })

    const { fetchCategorias, categorias } = useCategoriaStore();

    useEffect(() => {
        const fetchData = async () => {
            await fetchCategorias();
            setLoading(false);
        }
        fetchData();
    }, [categorias, fetchCategorias])

    if (loading) {
        return <SpinnerLoad />;
    }
    // Filtrar categorías basado en el término de búsqueda
    const filteredCategorias = categorias.filter((categoria) =>
        categoria.nombre?.toLowerCase().includes(searchTerm.toLowerCase()),
    )


    return (
        <div className="container py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
                {permisos?.crear ? (
                    <Button onClick={() => setIsModalOpen(true)}>
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Nueva Categoría
                    </Button>
                ) : ""}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Categorías</CardTitle>
                    <CardDescription>Administra las categorías para organizar tus productos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar categorías..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">ID</TableHead>
                                    <TableHead>
                                        <div className="flex items-center">
                                            Nombre
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead>
                                        <div className="flex items-center">
                                            Num Productos
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCategorias.length > 0 ? (
                                    filteredCategorias.map((categoria) => (
                                        <TableRow key={categoria.id}>
                                            <TableCell className="font-medium">{categoria.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                                    {categoria.nombre}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <PackageSearch className="h-4 w-4 text-muted-foreground" />
                                                    {categoria.productosenstock}
                                                </div>
                                            </TableCell>
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
                                                        {permisos?.editar ? (
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setCategoria({
                                                                    id: categoria.id,
                                                                    nombre: categoria?.nombre
                                                                })
                                                                    ,
                                                                    setIsModalOpenE(true)
                                                            }}
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        ):""}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                            No se encontraron categorías con ese criterio de búsqueda
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <CreateCategoriaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <UpdateCategoriaModal
                isOpen={isModalOpenE}
                onClose={() => setIsModalOpenE(false)}
                categoriaId={categoria.id}
                categoriaNombre={categoria.nombre}
            />
        </div>
    )
}


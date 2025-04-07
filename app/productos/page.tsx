'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Plus } from "lucide-react"
import { CreateProductoModal } from "@/components/create-producto-modal"
import { useEffect, useState } from "react"
import useCategoriaStore from "../store/useCategoriaStore"
import useProductoStore from "../store/useProductoStore"
import { SpinnerLoad } from "@/components/SpinnerLoad"
import { UpdateProductoModal } from "@/components/edit-producto-modal"


// flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-4 mb-4
export default function () {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalAbierto, setIsModalAbierto] = useState(false)
    const [productoSeleccionado,setproductoSeleccionado]= useState({
        id:0,
        nombre: "",
        categoriaId: "",
        stock: 0,
        precio: 0
    })
    const obtenerEstado = (stock: number) => {
        const estados = {
            disponible: { bg: "bg-green-100", text: "text-green-800", label: "Disponible" },
            bajoStock: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Bajo stock" },
            sinStock: { bg: "bg-red-100", text: "text-red-800", label: "Sin stock" },
        };

        let estado;
        if (stock > 10) estado = estados.disponible;
        else if (stock === 0) estado = estados.sinStock;
        else estado = estados.bajoStock; // Para valores entre 1 y 9

        return (
            <TableCell>
                <Badge className={`${estado.bg} ${estado.text} hover:${estado.bg}`}>{estado.label}</Badge>
            </TableCell>
        );
    };

    const { fetchCategorias, categorias } = useCategoriaStore();
    const { fetchProductos, addProducto, productos,editProducto } = useProductoStore();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            await fetchCategorias();
            await fetchProductos();
            setLoading(false);
        }
        fetchData();
    }, [fetchCategorias, fetchProductos])

    if (loading) {
        return <SpinnerLoad />;
    }
    const handleCreateProducto = (producto: any) => {
        addProducto(producto)
        setIsModalOpen(false)
    }
    return (
        <div>
            <div className="mb-4 flex-row sm:flex-row sm:items-center sm:justify-between text-end">
                <Button className="sm:w-auto w-full gap-1" onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Nuevo producto
                </Button>
            </div>
            {/* Products table */}
            <div className=" max-w-96 md:max-w-full overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Productos</CardTitle>
                        <CardDescription>Lista de todos los productos en inventario.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border max-h-[400px] overflow-y-auto">
                            <Table className="min-w-max">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productos.map((producto) => (
                                        <TableRow key={producto.id}>
                                            <TableCell className="font-medium">{producto.id}</TableCell>
                                            <TableCell>{producto.nombre}</TableCell>
                                            <TableCell>{producto.categoria_nombre}</TableCell>
                                            <TableCell>{producto.stock}</TableCell>
                                            <TableCell>C$ {producto.precio}</TableCell>
                                            {obtenerEstado(producto.stock)}
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
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setproductoSeleccionado({
                                                                    id: producto.id,
                                                                    nombre: producto.nombre,
                                                                    categoriaId: producto.categoriaId.toString(),
                                                                    precio: producto.precio,
                                                                    stock:producto.stock
                                                                })
                                                                    ,
                                                                    setIsModalAbierto(true)
                                                            }}
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <CreateProductoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateProducto={handleCreateProducto}
                categorias={categorias}
            />
            <UpdateProductoModal
                isOpen={isModalAbierto}
                onClose={() => setIsModalAbierto(false)}
                onUpdateProducto={(productoActualizado) => {
                    // Aquí llamas al endpoint PUT y actualizas estado
                    editProducto(productoActualizado)
                }}
                categorias={categorias}
                producto={productoSeleccionado}
            />

        </div>
    )
}


'use client'
import { AlertTriangle, Box, ClipboardList, Package, Plus, ShoppingCart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import useInventarioStore from "../store/useInventarioStore"
import { useEffect, useState } from "react"
import { SpinnerLoad } from "@/components/SpinnerLoad"
import { FormatoNumero } from "@/utils/FormatoNumero"
import CardProductoBajoStock from "@/components/CardProductoBajoStock"
import { Producto } from "../types/types"

export default function () {

  const {fetchResumen,data,dataBajoStock,fetchProductosBajo} = useInventarioStore();
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    const fecthData =async()=>{
      await fetchResumen();
      await fetchProductosBajo();
      setLoading(false)
    }
    fecthData();
  },[fetchResumen,fetchProductosBajo])

  const productosOrdenados = dataBajoStock.Productos.sort((a, b) => a.stock - b.stock);
  const productosBajoStock = productosOrdenados.slice(0, 4);


  if (loading) {
    return <SpinnerLoad/>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProductos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bajo Stock</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bajoStock}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cantidadCategorias}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> {FormatoNumero(data.valorInventario)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main content sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Products with low stock */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Productos con Bajo Stock</CardTitle>
              <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{dataBajoStock.Productos.length} productos</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productosBajoStock.map((producto)=>(
                <CardProductoBajoStock
                  key={producto.id}
                  nombreProducto={producto.nombre}
                  limitStock={dataBajoStock.limitStock}
                  precio={producto.precio}
                  stock={producto.stock}
                  urlImage={producto.imagen ?? "/placeholder.svg?height=64&width=64"}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver todos los productos con bajo stock
            </Button>
          </CardFooter>
        </Card>

        {/* Top Selling Products */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>Este mes</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver reporte
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex-shrink-0 relative">
                  <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    1
                  </div>
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Laptop HP Pavilion"
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Laptop HP Pavilion</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">32 vendidos</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Electrónicos</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Stock: 24 unidades</span>
                    <span className="text-sm font-medium">$899.99</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex-shrink-0 relative">
                  <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    2
                  </div>
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Monitor Samsung 27"
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Monitor Samsung 27"</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">28 vendidos</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Electrónicos</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Stock: 12 unidades</span>
                    <span className="text-sm font-medium">$249.99</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex-shrink-0 relative">
                  <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    3
                  </div>
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Disco Duro SSD 1TB"
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Disco Duro SSD 1TB</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">24 vendidos</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Almacenamiento</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Stock: 18 unidades</span>
                    <span className="text-sm font-medium">$129.99</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex-shrink-0 relative">
                  <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    4
                  </div>
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Mouse Inalámbrico"
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">Mouse Inalámbrico</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">22 vendidos</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Accesorios</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">Stock: 32 unidades</span>
                    <span className="text-sm font-medium">$24.99</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver todos los productos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


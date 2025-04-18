"use client"

import { useEffect, useState } from "react"
import { Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Esquema de validación
const productoFormSchema = z.object({
    id:z.number(),
  nombre: z.string().min(2).max(100),
  categoriaId: z.string(),
  stock: z.number().int().nonnegative(),
  precio: z.number().positive().multipleOf(0.01),
})

type ProductoFormValues = z.infer<typeof productoFormSchema>

interface UpdateProductoModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdateProducto: (producto: ProductoFormValues) => void
  categorias: { id: number; nombre: string }[]
  producto: {
    id:number
    nombre: string
    categoriaId: string
    stock: number
    precio: number
  } | null
}

export function UpdateProductoModal({
  isOpen,
  onClose,
  onUpdateProducto,
  categorias,
  producto,
}: UpdateProductoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoFormSchema),
    defaultValues: {
      id:0,
      nombre: "",
      categoriaId: "",
      stock: 0,
      precio: 0,
    },
  })

  // Actualizar valores cuando cambia el producto
  useEffect(() => {
    if (producto) {
      form.reset({
        id:producto.id,
        nombre: producto.nombre,
        categoriaId: producto.categoriaId,
        stock: producto.stock,
        precio: producto.precio,
      })
    }
  }, [producto, form])

  const onSubmit = async (data: ProductoFormValues) => {
    setIsSubmitting(true)
    try {
      onUpdateProducto(data)
      form.reset()
      onClose()
    } catch (error) {
      console.error("Error al actualizar producto:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Actualiza los datos del producto seleccionado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Nombre */}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categoría */}
            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock y Precio */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        {...field}
                        onChange={(e) => field.onChange(+e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          className="pl-7"
                          type="number"
                          step="0.01"
                          min="0.01"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.valueAsNumber)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-8">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Actualizar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

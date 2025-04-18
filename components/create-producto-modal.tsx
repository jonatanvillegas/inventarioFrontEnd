"use client"

import { useState } from "react"
import { Loader2, Package } from "lucide-react"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Esquema de validación para el formulario
const productoFormSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres" }),
  categoriaId: z.string({
    required_error: "Debes seleccionar una categoría",
  }),
  stock: z
    .number({
      required_error: "El stock es requerido",
      invalid_type_error: "El stock debe ser un número",
    })
    .int({ message: "El stock debe ser un número entero" })
    .nonnegative({ message: "El stock no puede ser negativo" }),
  precio: z
    .number({
      required_error: "El precio es requerido",
      invalid_type_error: "El precio debe ser un número",
    })
    .positive({ message: "El precio debe ser mayor que cero" })
    .multipleOf(0.01, { message: "El precio debe tener máximo 2 decimales" }),
  imagen: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      { message: "La imagen no puede pesar más de 5MB" }
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      { message: "El formato debe ser JPG, PNG o WEBP" }
    ),
})


type ProductoFormValues = z.infer<typeof productoFormSchema>

interface ProductoParaCrear {
  nombre: string
  categoriaId: string
  stock: number
  precio: number
  imagen?: string // base64 aquí
}


interface CreateProductoModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProducto: (producto: ProductoParaCrear) => void
  categorias: { id: number; nombre: string }[]
}

export function CreateProductoModal({ isOpen, onClose, onCreateProducto, categorias }: CreateProductoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [imagen, setImagen] = useState<string | undefined>(undefined)

  const handleImageChange = (e:any) => {
    setImagen(e.target.files[0]);
  };

  // Configurar el formulario con validación
  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoFormSchema),
    defaultValues: {
      nombre: "",
      stock: 0,
      precio: 0,
    },
  })


  // Manejar el envío del formulario
  const onSubmit = async (data: ProductoFormValues) => {
    setIsSubmitting(true)

    try {
      
      const productoConImagen: ProductoParaCrear = {
        nombre: data.nombre,
        categoriaId: data.categoriaId,
        stock: data.stock,
        precio: data.precio,
        imagen: imagen, // ya transformada antes en base64
      }
  
      onCreateProducto(productoConImagen)
      form.reset()
    } catch (error) {
      console.error("Error al crear el producto:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cerrar el modal y resetear el formulario
  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Producto</DialogTitle>
          <DialogDescription>Ingresa los detalles del nuevo producto para agregarlo al inventario.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Campo Nombre del producto */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Laptop HP Pavilion" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 mb-1">
                  Imagen del producto
                </FormLabel>
                <FormControl>
                  <label
                    htmlFor="imagen"
                    className="flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sky-500 transition"
                  >
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 16l4-4 4 4m0 0l4-4 4 4M4 4h16"
                      />
                    </svg>
                    <span className="ml-3 text-gray-500">Selecciona una imagen</span>
                    <input
                      id="imagen"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e)}
                    />

                  </label>
                </FormControl>
              </FormItem>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Campo Categoría */}
              <FormField
                control={form.control}
                name="categoriaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id.toString()}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Campo Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Precio */}
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
                          type="number"
                          min="0.01"
                          step="0.01"
                          className="pl-7"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          value={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-8">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Crear Producto
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


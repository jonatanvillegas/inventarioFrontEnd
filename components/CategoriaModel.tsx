"use client"

import { useState } from "react"
import { FolderPlus, Loader2 } from "lucide-react"
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
import useCategoriaStore from "@/app/store/useCategoriaStore"

// Esquema de validación para el formulario
const categoriaFormSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),
})

type CategoriaFormValues = z.infer<typeof categoriaFormSchema>

interface CreateCategoriaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateCategoriaModal({ isOpen, onClose }: CreateCategoriaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {addCategoria} = useCategoriaStore();
  // Configurar el formulario con validación
  const form = useForm<CategoriaFormValues>({
    resolver: zodResolver(categoriaFormSchema),
    defaultValues: {
      nombre: "",
    },
  })

  // Manejar el envío del formulario
  const onSubmit = async (data: CategoriaFormValues) => {
    setIsSubmitting(true)

    try {
      // Simular una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addCategoria(data.nombre)
      form.reset()
      handleClose()
    } catch (error) {
      console.error("Error al crear la categoría:", error)
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Categoría</DialogTitle>
          <DialogDescription>Ingresa el nombre para la nueva categoría de productos.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Electrónicos, Accesorios, etc." {...field} autoFocus />
                  </FormControl>
                  <FormDescription>Este nombre debe ser único y descriptivo.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
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
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Crear Categoría
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


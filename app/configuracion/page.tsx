'use client'
import { CircleGauge, Mail, MapPin, Phone, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { z } from "zod"
import useEmpresaStore from "../store/useEmpresaStore"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { SpinnerLoad } from "@/components/SpinnerLoad"

export default function () {

  const EmpresaSchema = z.object({
    id:z .number(),
    nombre: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
      .max(50, { message: "El nombre no debe exceder los 50 caracteres." }),
    descripcion: z
      .string()
      .min(5, { message: "La descripción debe tener al menos 10 caracteres." }),
    email: z.string().email({ message: "Correo electrónico inválido." }),
    telefono: z
      .string()
      .min(7, { message: "Teléfono debe tener al menos 7 dígitos." }),
    direccion: z
      .string()
      .min(5, { message: "Dirección demasiado corta." }),
    ciudad: z
      .string()
      .min(2, { message: "Ciudad no válida." }),
    CodigoPostal: z
      .number()
      .min(5, { message: "Código postal inválido. Debe tener 5 dígitos." }),
    limitStock: z
      .number()
      .min(1, { message: "El límite debe ser al menos 1." }),
    paginacion: z
      .number()
      .min(5, { message: "Mínimo 5 productos por página." })
      .max(100, { message: "Máximo 100 productos por página." }),
  })

  type EmpresaFormValues = z.infer<typeof EmpresaSchema>

  const { fetchEmpresa, empresa,editEmpresa } = useEmpresaStore();
  const [formData, setFormData] = useState<EmpresaFormValues | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmpresa();
      setLoading(false);
    }
    fetchData();
  }, [fetchEmpresa]);

  useEffect(() => {
    if (empresa) {
      setFormData(empresa)
    }
  }, [empresa])

  if (loading) {
    return <SpinnerLoad />;
  }

  if (!formData) {
    return null; // No renderiza nada si formData sigue siendo null
  }

  const handleChange = (field: keyof EmpresaFormValues, value: string | number) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    const result = EmpresaSchema.safeParse(formData)
    if (result.success) {
      editEmpresa(result.data);
    } else {
      console.error("Errores de validación:", result.error.errors);
    }

    console.log(result)
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Perfil de la Empresa</h1>
        <Button className="sm:w-auto w-full gap-1" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información de la empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
            <CardDescription>Actualiza la información básica de tu empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center gap-4 mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Logo de la empresa"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <Button variant="outline" size="sm">
                Cambiar Logo
              </Button>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input id="company-name" value={formData.nombre} onChange={(e) => handleChange("nombre", e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company-description">Descripción</Label>
                <Textarea
                  id="company-description"
                  rows={4}
                  value={formData.descripcion} onChange={(e) => handleChange("descripcion", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacto y ubicación */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto y Ubicación</CardTitle>
            <CardDescription>Información de contacto y dirección física</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="company-email">Correo Electrónico</Label>
                <div className="flex">
                  <Mail className="mr-2 h-4 w-4 opacity-70 my-auto" />
                  <Input id="company-email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company-phone">Teléfono</Label>
                <div className="flex">
                  <Phone className="mr-2 h-4 w-4 opacity-70 my-auto" />
                  <Input id="company-phone" value={formData.telefono} onChange={(e) => handleChange("telefono", e.target.value)} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="company-address">Dirección</Label>
                <div className="flex">
                  <MapPin className="mr-2 h-4 w-4 opacity-70 my-auto" />
                  <Input id="company-address" value={formData.direccion} onChange={(e) => handleChange("direccion", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="company-city">Ciudad</Label>
                  <Input id="company-city" value={formData.ciudad} onChange={(e) => handleChange("ciudad", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-zip">Código Postal</Label>
                  <Input id="company-zip" value={formData.CodigoPostal} onChange={(e) => handleChange("CodigoPostal", e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Inventario */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Configuración de Inventario</CardTitle>
            <CardDescription>Ajusta los parámetros para la gestión de tu inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificaciones de Stock</h3>

                <div className="grid gap-2">
                  <Label htmlFor="low-stock-threshold">
                    Límite de Stock Bajo
                    <span className="ml-1 text-sm text-muted-foreground">
                      (Notificar cuando el stock sea menor a este valor)
                    </span>
                  </Label>
                  <Input id="low-stock-threshold" type="number" value={formData.limitStock} onChange={(e) => handleChange("limitStock", +e.target.value)} className="w-full md:w-1/3" />
                  <p className="text-sm text-muted-foreground">
                    Los productos con stock por debajo de este límite aparecerán marcados como "Bajo stock" en el
                    sistema.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preferencias de Visualización</h3>

                <div className="grid gap-2">
                  <Label htmlFor="items-per-page">Productos por página</Label>
                  <Input
                    id="items-per-page"
                    type="number"
                    value={formData.paginacion} onChange={(e) => handleChange("paginacion", +e.target.value)}
                    className="w-full md:w-1/3"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { ArrowLeft, AtSign, Check, Eye, EyeOff, Save, User, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUsersStore } from "@/app/store/useUsersStore"

// Definir el enum Role para que coincida con el esquema de la base de datos
enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

// Esquema de validación con Zod
const userFormSchema = z.object({
  email: z.string().email({ message: "Ingresa un correo electrónico válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(255, { message: "La contraseña no puede exceder los 255 caracteres" }),
  nombre: z.string().optional(),
  role: z.nativeEnum(Role, {
    required_error: "Selecciona un rol para el usuario",
  }),
})

type UserFormValues = z.infer<typeof userFormSchema>

export default function CrearUsuarioPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {createUser} = useUsersStore();

  // Valores por defecto para el formulario
  const defaultValues: Partial<UserFormValues> = {
    email: "",
    password: "",
    nombre: "",
    role: Role.USER,
  }

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  })

  async function onSubmit(data: UserFormValues) {
    setIsSubmitting(true)

    // Simulación de envío a la API
    createUser(data);

    // Simular una respuesta exitosa después de 1.5 segundos
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push("/usuarios")
      }, 2000)
    }, 1500)
  }

  return (
    <div className=" max-w-full py-6 space-y-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/usuarios">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Crear Usuario</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
          <CardDescription>
            Crea un nuevo usuario para el sistema. Todos los usuarios creados recibirán un correo electrónico con sus
            credenciales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium">Usuario creado exitosamente</h3>
              <p className="text-muted-foreground text-center">
                El usuario ha sido creado y se ha enviado un correo electrónico con las credenciales.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="usuario@empresa.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>Este correo se usará para iniciar sesión</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} className="pr-10" {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">
                                {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>Mínimo 8 caracteres</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Nombre del usuario"
                              className="pl-10"
                              {...field}
                              value={field.value || ""}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>Nombre completo del usuario (opcional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="pl-10">
                                <UserCog className="h-4 w-4" />
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={Role.USER}>Usuario</SelectItem>
                            <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Define los permisos del usuario en el sistema</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => router.push("/usuarios")}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Creando usuario...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Crear usuario
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


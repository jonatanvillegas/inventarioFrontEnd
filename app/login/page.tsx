"use client"

import type React from "react"

import { useState } from "react"
import { Box, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import axios from "axios"
import { setCookie } from "typescript-cookie"
import { toast } from "sonner"

export default function () {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [email, SetEmail] = useState<string>();
    const [password, Setpassword] = useState<string>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
      
        setIsLoading(true)
      
        try {
          const { data } = await axios.post("http://localhost:4000/login", {
            email,
            password,
          })
      
          const { token, usuario, mensaje } = data
      
          if (token && usuario?.id) {
            // Guardar el token y el ID del usuario en cookies
            setCookie("token", token, {
              expires: 1,
              secure: process.env.NODE_ENV === "production",
            })
      
            setCookie("id", usuario.id, {
              expires: 1,
              secure: process.env.NODE_ENV === "production",
            })
      
            // Mostrar mensaje de éxito
            toast.success(mensaje, {
              description: "Redirigiendo al panel principal...",
              className: "bg-emerald-100 text-emerald-800 border border-emerald-300",
            })
      
            // Redirigir después de un breve tiempo
            setTimeout(() => {
              window.location.href = "/inicio"
            }, 1500)
          } else {
            toast.error("Credenciales inválidas o token no recibido")
          }
        } catch (error: any) {
          const mensajeError = error?.response?.data?.mensaje || "Error al iniciar sesión"
          toast.error(mensajeError, {
            className: "bg-red-100 text-red-800 border border-red-300",
          })
        } finally {
          setIsLoading(false)
        }
      }
    
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Columna izquierda - Formulario */}
            <div className="flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-8">
                        <Box className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold">Inventario App</h1>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold">Bienvenido de nuevo</h1>
                            <p className="text-muted-foreground">Inicia sesión en tu cuenta para continuar</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" type="email" placeholder="nombre@empresa.com" className="pl-10" required
                                        onChange={(e) => SetEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Contraseña</Label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10" required
                                        onChange={(e) => Setpassword(e.target.value)} />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <Label htmlFor="remember" className="text-sm font-normal">
                                    Recordar mi sesión
                                </Label>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </Button>
                        </form>

                    </div>

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        <p>© 2023 Inventario App. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>

            {/* Columna derecha - Imagen */}
            <div className="hidden lg:block bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                    <div className="w-full max-w-lg text-center space-y-8">
                        <Box className="h-16 w-16 mx-auto text-primary" />
                        <h2 className="text-3xl font-bold">Sistema de Gestión de Inventario</h2>
                        <p className="text-muted-foreground text-lg">
                            Administra tu inventario de manera eficiente, controla el stock y optimiza tus ventas con nuestra
                            plataforma integral.
                        </p>
                        <div className="grid grid-cols-3 gap-4 pt-8">
                            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
                                <h3 className="font-medium">Control de Stock</h3>
                                <p className="text-sm text-muted-foreground">Monitoreo en tiempo real</p>
                            </div>
                            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
                                <h3 className="font-medium">Reportes</h3>
                                <p className="text-sm text-muted-foreground">Análisis detallados</p>
                            </div>
                            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
                                <h3 className="font-medium">Alertas</h3>
                                <p className="text-sm text-muted-foreground">Notificaciones automáticas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


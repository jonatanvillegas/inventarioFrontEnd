import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import React from 'react'
import ImageThumbnail from './ImagenModal'

interface props {
  urlImage: string,
  nombreProducto: string,
  stock: number,
  limitStock: number,
  precio: number
}

const CardProductoBajoStock = (producto: props) => {
  return (
    <div className="flex items-start gap-4 rounded-lg border p-3">
      <div className="flex-shrink-0">

        <ImageThumbnail src={producto.urlImage} alt={producto.nombreProducto} />

      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{producto.nombreProducto}</h3>
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{producto.stock} unidades</Badge>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-muted-foreground">Límite mínimo: {producto.limitStock}</span>
          <span className="text-sm font-medium">{producto.precio}</span>
        </div>
      </div>
    </div>
  )
}

export default CardProductoBajoStock
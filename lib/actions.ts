// server component SSR
"use server"

import { cookies } from "next/headers"
import axios from "axios"
import { Navegacion } from "@/app/types/types";

export async function getUsers() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await axios.get("http://localhost:4000/getall", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}
export async function getNavegacionData(): Promise<Navegacion[]> {
  try {
    const cookieStore = await cookies(); // Usamos cookies directamente
    const token = cookieStore.get('token')?.value;
    const tokenId = cookieStore.get('id')?.value;

    if (!token || !tokenId) {
      return []; // Si no hay token o tokenId, retornamos datos vacíos
    }

    // Hacemos la llamada al servidor para obtener los datos de navegación
    const response = await axios.get(`http://localhost:4000/navegacion/datos/${tokenId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Retornamos los datos de navegación
  } catch (error) {
    console.error("Error al obtener datos de navegación:", error);
    return []; // En caso de error, retornamos un arreglo vacío
  }
}
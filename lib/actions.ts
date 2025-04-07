// server component SSR
"use server"

import { cookies } from "next/headers"
import axios from "axios"

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

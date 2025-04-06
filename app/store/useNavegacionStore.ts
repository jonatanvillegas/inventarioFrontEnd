import { create } from "zustand";
import { Navegacion } from "../types/types";
import { getCookie } from "typescript-cookie";
import axios from "axios";

interface navegacionState {
    navegacion: Navegacion[],
    loading: boolean;
    fetchNavegacion: () => Promise<void>;
}

const useNavegacionStore = create<navegacionState>((set) => ({
    navegacion:[],
    loading:false,
    fetchNavegacion:async()=> {
        try {
            const token = getCookie("token");
            const response = await axios.get("http://localhost:4000/navegacion/datos",{
                headers:{
                     Authorization: `Bearer ${token}`
                }
            }); 

            const data:Navegacion[] = await response.data;
            set({ navegacion: data, loading: false });
        } catch (error) {
            console.error("Error al obtener la navegacion", error);
            set({ loading: false });
        }
    },
}))

export default useNavegacionStore
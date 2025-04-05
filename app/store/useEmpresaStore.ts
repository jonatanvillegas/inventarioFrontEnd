import {create} from "zustand"
import { Empresa } from "../types/types";
import { getCookie } from "typescript-cookie";
import axios from "axios";

interface EmpresaState {
    empresa:Empresa;
    loading: boolean;
    fetchEmpresa: () => Promise<void>;
    editEmpresa: (empresa:Empresa) => Promise<void>;
}

const useEmpresaStore = create<EmpresaState>((set,get) => ({
    empresa: {id: 0,
        nombre: "",
        descripcion: "",
        email: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        CodigoPostal: 0,
        limitStock: 0,
        paginacion: 25,
      },
    loading: false,

    fetchEmpresa: async () => {
        set({ loading: true });
        try {
            const token = getCookie("token");
            const response = await axios.get("http://localhost:4000/empresa/getAll",{
                headers:{
                     Authorization: `Bearer ${token}`
                }
            }); 

            const data:Empresa = await response.data;
            set({ empresa: data, loading: false });
        } catch (error) {
            console.error("Error al obtener categorías", error);
            set({ loading: false });
        }
    },

    editEmpresa: async (empresa) => {
        try {
            const token = getCookie('token');
            await axios.put(`http://localhost:4000/empresa/actualizar/${empresa.id}`, {
                nombre: empresa.nombre,
                descripcion: empresa.descripcion,
                limitStock: empresa.limitStock,
                CodigoPostal: empresa.CodigoPostal,
                telefono: empresa.telefono,
                paginacion: empresa.paginacion,
                ciudad: empresa.ciudad,
                email: empresa.email,
                direccion: empresa.direccion
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            await get().fetchEmpresa();
        } catch (error) {
            console.error("Error al actualizar la categoría", error);
        }
    },
}));

export default useEmpresaStore;
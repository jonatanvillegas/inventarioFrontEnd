import { create } from "zustand";
import { Categoria, CategoriaDTO, Producto } from "../types/types";
import axios from "axios";
import { getCookie } from "typescript-cookie";


// 📌 Definir el estado del store
interface CategoriaState {
    categorias: CategoriaDTO[];
    loading: boolean;
    fetchCategorias: () => Promise<void>;
    addCategoria: (nombre:string) => Promise<void>;
    editCategoria: (id: number, nombre: string) => Promise<void>;
}

// 📌 Store de Zustand
const useCategoriaStore = create<CategoriaState>((set) => ({
    categorias: [],
    loading: false,

    fetchCategorias: async () => {
        set({ loading: true });
        try {
            const token = getCookie("token");
            const response = await axios.get("http://localhost:4000/categoria/getAll",{
                headers:{
                     Authorization: `Bearer ${token}`
                }
            }); 

            const data: CategoriaDTO[] = await response.data;
            set({ categorias: data, loading: false });
        } catch (error) {
            console.error("Error al obtener categorías", error);
            set({ loading: false });
        }
    },

    addCategoria: async (nombre) => {
        try {
            const token = getCookie('token');
            const response = await axios.post("http://localhost:4000/categoria/create", {
                nombre: nombre
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const newCategoria: CategoriaDTO = await response.data;
            set((state) => ({ categorias: [...state.categorias, newCategoria] }));
        } catch (error) {
            console.error("Error al agregar categoría", error);
        }
    },

    editCategoria: async (id, nombre) => {
        try {
            const token = getCookie('token');
            await axios.put(`http://localhost:4000/categoria/actualizar/${id}`, {
                nombre
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            // Actualiza el estado de las categorías: 
            // busca la categoría actualizada y reemplázala en el estado
            set((state) => ({
                categorias: state.categorias.map((cat) =>
                    cat.id === id ? { ...cat, nombre } : cat
                ),
            }));
        } catch (error) {
            console.error("Error al actualizar la categoría", error);
        }
    },
}));

export default useCategoriaStore;
import { create } from 'zustand'
import { ProductosBajoStock, ResumenInventario } from '../types/types';
import { getCookie } from 'typescript-cookie';
import axios from 'axios';

interface InventarioState {
    data: ResumenInventario;
    dataBajoStock:ProductosBajoStock;
    loading: boolean;
    fetchResumen: () => Promise<void>;
    fetchProductosBajo: () => Promise<void>;
}

const useInventarioStore = create<InventarioState>((set) => ({
    data: {
        totalProductos: 0,
        bajoStock: 0,
        cantidadCategorias: 0,
        valorInventario: 0,
    },
    dataBajoStock:{
        Productos:[],
        limitStock:0
    },
    loading: false,
    fetchResumen: async () => {
        try {
            const token = getCookie("token");
            const response = await axios.get("http://localhost:4000/dashboard/datos", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
             const resumenInventario:ResumenInventario = await response.data;
             set({ data: resumenInventario, loading: false });
        } catch (error) {
            console.error("Error al obtener resumen de inventario", error);
            set({ loading: false });
        }
    },
    fetchProductosBajo: async () =>{
        try {
            const token = getCookie("token");
            const response = await axios.get("http://localhost:4000/dashboard/bajoStock", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
             const resumenInventario:ProductosBajoStock = await response.data;
             set({ dataBajoStock: resumenInventario, loading: false });
        } catch (error) {
            console.error("Error al obtener resumen de inventario", error);
            set({ loading: false });
        }
    }

}))

export default useInventarioStore;
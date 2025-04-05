import { create } from 'zustand';
import axios from "axios";
import { getCookie } from "typescript-cookie";
import { Producto, ProductoDTO } from '../types/types';

interface ProductoState {
    productos: Producto[];
    loading: boolean;
    fetchProductos: () => Promise<void>;
    addProducto: (producto: ProductoDTO) => Promise<void>;
}

const useProductoStore = create<ProductoState>((set, get) => ({
    productos: [],
    loading: false,

    fetchProductos: async () => {
        set({ loading: true });
        try {
            const token = getCookie("token");
            const response = await axios.get("http://localhost:4000/producto/getall", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data: Producto[] = await response.data.Productos;
            console.log(data)
            set({ productos: data, loading: false });
        } catch (error) {
            console.error("Error al obtener categorías", error);
            set({ loading: false });
        }
    },
    addProducto: async (producto) => {
        try {
            const token = getCookie('token');
            await axios.post("http://localhost:4000/producto/create", {
                nombre: producto.nombre,
                descripcion: 'descripcion G',
                precio: producto.precio,
                stock: producto.stock,
                imagen: null,
                categoriaId: producto.categoriaId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // Llamar a fetchProductos para actualizar la lista
            await get().fetchProductos();

        } catch (error) {
            set({ loading: false });
        }
    }
}));

export default useProductoStore;
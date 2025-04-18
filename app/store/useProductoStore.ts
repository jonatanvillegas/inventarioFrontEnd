import { create } from 'zustand';
import axios from "axios";
import { getCookie } from "typescript-cookie";
import { Producto, productoActualizado, ProductoDTO } from '../types/types';

interface ProductoState {
    productos: Producto[];
    loading: boolean;
    fetchProductos: () => Promise<void>;
    addProducto: (producto: ProductoDTO) => Promise<void>;
    editProducto: (producto: productoActualizado) => Promise<void>;
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
            set({ productos: data, loading: false });
        } catch (error) {
            console.error("Error al obtener categorías", error);
            set({ loading: false });
        }
    },
    addProducto: async (producto) => {
        try {
            const token = getCookie('token');
    
            const formData = new FormData();
            if (producto.imagen) {
                formData.append("imagen", producto.imagen);
              } else {
                throw new Error("La imagen es requerida");
              }

            formData.append("nombre", producto.nombre);
            formData.append("descripcion", 'descripcion G');
            formData.append("precio", producto.precio.toString());
            formData.append("stock", producto.stock.toString());
            formData.append("categoriaId", producto.categoriaId.toString());

            await axios.post("http://localhost:4000/producto/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            // Llamar a fetchProductos para actualizar la lista
            await get().fetchProductos();
    
        } catch (error) {
            console.log("Error creando producto", error);
            set({ loading: false });
        }
    },
    
    editProducto: async (producto) => {
        try {
            const token = getCookie('token');
            await axios.put(`http://localhost:4000/producto/actualizar/${producto.id}`, {
                nombre: producto.nombre,
                descripcion: 'descripcion G',
                precio: producto.precio,
                stock: producto.stock,
                categoriaId: Number.parseInt(producto.categoriaId)
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
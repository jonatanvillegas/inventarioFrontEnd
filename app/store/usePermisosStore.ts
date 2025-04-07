import { create } from 'zustand'
import { Permiso, PermisosPorUsuario } from '../types/types'
import { getCookie } from 'typescript-cookie'
import axios from 'axios'

interface permisosState {
    permisosUsuario: PermisosPorUsuario;
    loading: boolean;
    fetchPermisos: (id: number) => Promise<void>;
    editPermisos: (permisos:PermisosPorUsuario)=> Promise<void>;
}

const usePermisosStore = create<permisosState>((set) => ({
    permisosUsuario: {
        userId: 0,
       permisos:[]
    },
    loading: false,
    fetchPermisos: async (id) => {
        try {
            const token = getCookie("token");
            const response = await axios.get(`http://localhost:4000/permisos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.data;
            set({ permisosUsuario: data, loading: false });
        } catch (error) {
            console.error("Error al obtener la navegacion", error);
            set({ loading: false });
        }
    },
    editPermisos: async (permisos)=>{
        try {
            const token = getCookie("token");
             await axios.put(`http://localhost:4000/editarpermiso`,{
                ...permisos}, // Desestructura 
                 {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        } catch (error) {
            console.error("Error al obtener la navegacion", error);
            set({ loading: false });
        }
    }
}))

export default usePermisosStore
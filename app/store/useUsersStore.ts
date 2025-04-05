import { create } from "zustand";
import axios from "axios";
import { getCookie } from "typescript-cookie"
import { User,UserDTO } from "../types/types";


interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser:(usuario:UserDTO) => Promise<void>;
}

export const useUsersStore = create<UserStore>((set,get) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });

    try {
        const token = getCookie('token');
      const response = await axios.get("http://localhost:4000/getall",{
        headers:{
            Authorization: `Bearer ${token}`
        }
      });
      set({ users: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Error al obtener usuarios", isLoading: false });
    }
  },
  createUser: async (usuario:UserDTO) => {
    set({ isLoading: true, error: null });

    try {
      await axios.post("http://localhost:4000/createUser",{
        nombre: usuario.nombre,
        email: usuario.email,
        password: usuario.password,
        role: usuario.role
      });

      await get().fetchUsers();
  } catch (error) {
    set({ error: "Error al obtener usuarios", isLoading: false });
  }

  }
}));

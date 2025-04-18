//usuario
export interface User {
    id: string;
    nombre: string;
    email: string;
    role: string;
    createdAt: Date
}
export interface UserDTO {
    nombre?: string | undefined;
    password: string;
    email: string;
    role: Role;
}
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}
//categoria 
export type Categoria = {
    id: number,
    nombre: string
}

export type CategoriaDTO = Categoria & {
    productosenstock: number;
};

//producto
export type Producto = {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    categoriaId: number;
    categoria_nombre:string;
    imagen?: string;  // Imagen almacenada como una cadena de texto (url o base64)
    createdAt: string;  // Fecha en formato ISO 8601
}
export type productoActualizado = {
  id: number;
  nombre: string;
  categoriaId: string;
  stock: number;
  precio: number;
}
export type ProductoDTO = Omit<Producto,"categoria_nombre"|"createdAt"|"id">
  //empresa DTO
export type Empresa = {
    id: number;
    nombre: string;
    descripcion: string;
    email: File;
    telefono: string;
    direccion: string;
    ciudad: string;
    CodigoPostal: number;
    limitStock: number;
    paginacion: number;
  };

  export type EmpresaDTO = Omit<Empresa,"id">

  export type ResumenInventario = {
    totalProductos: number;
    bajoStock: number;
    cantidadCategorias: number;
    valorInventario: number;
  };
  
  export type ProductosBajoStock = {
    Productos:Producto[],
    limitStock:number
  };
  
  export type Navegacion = {
  id: number;
  nombre: string;
  ruta: string;
  icono: string;
  ver: boolean;
  editar: boolean;
  eliminar: boolean;
  crear: boolean;
};

  export type IconKey = 'Home' | 'Package' | 'ClipboardList' | 'Users' | 'Settings' | 'ShoppingCart';


  export type Permiso = {
    id: number;
    nombre: string;
    ver: boolean;
    editar: boolean;
    eliminar: boolean;
    crear: boolean;
  };
  
  export type PermisosPorUsuario = {
    userId: number;
    permisos: Permiso[];
  };
  
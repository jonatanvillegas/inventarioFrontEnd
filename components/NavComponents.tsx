import React from 'react'
import { Button } from './ui/button';
import { Home, Package, ClipboardList, Users, Settings,ShoppingCart } from "lucide-react"
import { IconKey } from '@/app/types/types';

const iconMap = {
    Home: Home,
    Package: Package,
    ClipboardList: ClipboardList,
    Users: Users,
    Settings: Settings,
    ShoppingCart:ShoppingCart
};
interface Props {
    id: number;
    nombre: string;
    ruta: string;
    icono: IconKey;
    pathname: string;
}

const NavComponents = (props: Props) => {

    const Icon = iconMap[props.icono] || Home; // Default a 'Home' si no encuentra el icono
    return (
        <Button variant={props.pathname === props.ruta ? "secondary" : "ghost"} className="justify-start gap-2" asChild>
            <a href={props.ruta}>
                <Icon className="h-5 w-5" />
                <span>{props.nombre}</span>
            </a>
        </Button>
    )
}

export default NavComponents
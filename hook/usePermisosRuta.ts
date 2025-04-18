import useNavegacionStore from '@/app/store/useNavegacionStore'
import { usePathname } from 'next/navigation'


export const usePermisosRuta = () => {
  const pathname = usePathname()
  const permisos = useNavegacionStore(state =>
    state.permisosPorRuta.find(p => pathname.startsWith(p.ruta))
  )

  return permisos
}

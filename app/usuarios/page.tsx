import { getUsers } from "@/lib/actions";
import UsuariosTable from "./_components/UsuariosTable";

export default async function UsuariosPage() {
  const users = await getUsers(); 

  return <UsuariosTable users={users} />
}

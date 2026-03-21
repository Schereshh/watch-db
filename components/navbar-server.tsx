import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function NavbarServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Navbar initialUserEmail={user?.email ?? null} />;
}

import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

export default async function isUserAuthenticated() {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { session } } = await supabase.auth.getSession();

    if(session?.user.id) {
        return true;
    }
    return false;
}

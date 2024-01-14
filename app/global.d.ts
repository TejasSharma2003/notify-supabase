import type { Database } from "@/types/supabase";


declare global{
    type Article = Database['public']['Tables']['articles']['Row']
}

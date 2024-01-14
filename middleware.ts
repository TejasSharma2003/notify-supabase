// import type { Database } from '@/lib/database.types'

import { createClient} from "./utils/supabase/middleware";
import { NextResponse, NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Create a Supabase client configured to use cookies
    const { supabase, response } = createClient(req);

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();
    return response
}

// Ensure the middleware is only called for relevant paths.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}

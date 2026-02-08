import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export function createEdgeSupabaseClient(req: NextRequest) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // use SERVICE_ROLE for server auth
    {
      cookies: {
        // Read cookies from the incoming request
        getAll: () => {
          return req.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
            options: undefined,
          }));
        },

        // Write cookies to the response
        setAll: (cookiesToSet) => {
          // Do nothing here in middleware;
          // cookies are automatically handled via NextResponse
          // Or implement if using custom response logic
        },
      },
    },
  );
}

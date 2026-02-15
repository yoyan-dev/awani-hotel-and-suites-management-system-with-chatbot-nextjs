import { createClient } from "@supabase/supabase-js";

export async function decodeToken(token: string) {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    const accessToken = decoded?.access_token;

    if (accessToken) {
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );

      const { data, error } = await supabase.auth.getUser(accessToken);

      if (!error && data?.user) {
        return { user: data.user, roles: data.user.app_metadata?.roles || [] };
      }
    }
  } catch (err) {
    console.log("Invalid session cookie");
    return { user: null, roles: [] };
  }
}

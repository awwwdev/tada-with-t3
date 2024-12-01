import { pgRole } from "drizzle-orm/pg-core";

// drizzle-orm/supabase
export const supabaseRoles = {
  anonRole: pgRole('anon').existing(),
  authenticatedRole: pgRole('authenticated').existing(),
  serviceRole: pgRole('service_role').existing(),
  postgresRole: pgRole('postgres_role').existing(),
  supabaseAuthAdminRole: pgRole('supabase_auth_admin').existing()
}



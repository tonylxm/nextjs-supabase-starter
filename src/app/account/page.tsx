import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH } from "@/lib/supabase/routes";
import { signOut } from "../login/actions";

// The proxy's redirect is only an optimistic check, so pages that show user data verify again.
export default async function AccountPage(): Promise<React.JSX.Element> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) {
    redirect(LOGIN_PATH);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-4 px-4 py-16 sm:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <p className="text-muted-foreground">Signed in as {claims.email}</p>
      <form action={signOut}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </main>
  );
}

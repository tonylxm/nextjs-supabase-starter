import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH, SIGNED_IN_PATH } from "@/lib/supabase/routes";

// Email confirmation links land here with a one-time code to exchange for a session.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { origin, searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const failureUrl = `${origin}${LOGIN_PATH}?error=confirmation`;

  if (!code) {
    return NextResponse.redirect(failureUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(failureUrl);
  }

  return NextResponse.redirect(`${origin}${SIGNED_IN_PATH}`);
}

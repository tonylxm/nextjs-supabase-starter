import { AuthForm } from "./auth-form";

const CALLBACK_ERRORS: Record<string, string> = {
  confirmation:
    "That confirmation link didn't work. Sign in, or create your account again to get a new link.",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">): Promise<React.JSX.Element> {
  const { error } = await searchParams;
  const initialError =
    typeof error === "string" ? CALLBACK_ERRORS[error] : undefined;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <AuthForm initialError={initialError} />
    </main>
  );
}

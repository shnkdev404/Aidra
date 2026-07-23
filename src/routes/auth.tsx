import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AuthCard } from "@/components/auth/AuthCard";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — Aidra" },
      { name: "description", content: "Sign in to your Aidra patient account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  return (
    <div className="relative min-h-screen bg-canvas text-ink selection:bg-primary selection:text-primary-foreground bg-geist-mesh">
      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-2 md:items-center md:py-16">
        <div className="hidden md:block">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-primary text-primary-foreground">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 2L2 22h20L12 2z" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-ink">Aidra</span>
          </Link>

          <h2 className="mt-12 max-w-md text-balance text-4xl font-semibold tracking-tighter text-ink leading-[1.1]">
            A quieter way to tend to your health.
          </h2>
          <p className="mt-6 max-w-sm text-sm text-body leading-relaxed">
            Aidra brings clinical AI guidance, BMI vitals telemetry, and verified doctors into one stark developer workspace.
          </p>
          <p className="mt-16 font-mono text-xs uppercase tracking-wider text-mute">
            Are you a clinician?{" "}
            <Link to="/doctor-auth" className="text-ink font-medium underline underline-offset-4">
              Doctor sign in
            </Link>
          </p>
        </div>

        <div className="mx-auto w-full max-w-md md:ml-auto">
          <AuthCard variant="patient" initialMode={mode ?? "signin"} onSuccessRedirect="/dashboard" />
        </div>
      </div>
    </div>
  );
}

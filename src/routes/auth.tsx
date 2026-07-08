import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuroraBackdrop } from "@/components/animated/AuroraBackdrop";
import { FadeIn } from "@/components/animated/FadeIn";

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
    <div className="relative min-h-screen bg-paper text-ink">
      <AuroraBackdrop />
      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-2 md:items-center md:py-16">
        <FadeIn className="hidden md:block">
          <Link to="/" className="serif inline-block text-2xl">Aidra</Link>
          <h2 className="serif mt-12 max-w-md text-balance text-5xl leading-[1.05]">
            A quieter way to tend to your health.
          </h2>
          <p className="mt-6 max-w-sm text-muted-foreground">
            Aidra brings AI guidance, BMI tracking, and verified doctors into one calm space.
          </p>
          <p className="mt-16 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Are you a clinician?{" "}
            <Link to="/doctor-auth" className="text-foreground underline underline-offset-4">
              Doctor sign in
            </Link>
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mx-auto w-full max-w-md md:ml-auto">
          <div className="rounded-2xl border border-border/70 bg-card p-8 shadow-editorial md:p-10">
            <AuthCard variant="patient" initialMode={mode ?? "signin"} onSuccessRedirect="/dashboard" />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

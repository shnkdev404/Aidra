import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { FadeIn } from "@/components/animated/FadeIn";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/doctor-auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Doctor access — Aidra" },
      { name: "description", content: "Sign in or apply for verification as a clinician." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DoctorAuthPage,
});

function DoctorAuthPage() {
  const { mode } = Route.useSearch();
  return (
    <div className="relative min-h-screen bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(oklch(0.75 0.13 82) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-2 md:items-center md:py-16">
        <FadeIn className="hidden md:block">
          <Link to="/for-doctors" className="serif inline-block text-2xl">Aidra <span className="text-gold">for doctors</span></Link>
          <h2 className="serif mt-12 max-w-md text-balance text-5xl leading-[1.05]">
            A verified space. Real license review. Zero noise.
          </h2>
          <p className="mt-6 max-w-sm text-paper/70">
            Sign in, or apply for verification. Every clinician here has passed a paid,
            manual review.
          </p>
          <p className="mt-16 text-xs uppercase tracking-[0.2em] text-paper/50">
            Not a doctor?{" "}
            <Link to="/auth" className="text-paper underline underline-offset-4">
              Patient sign in
            </Link>
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mx-auto w-full max-w-md md:ml-auto">
          <div className="rounded-2xl border border-paper/15 bg-paper p-8 text-ink shadow-editorial md:p-10">
            <AuthCard variant="doctor" initialMode={mode ?? "signin"} onSuccessRedirect="/doctor/verify" />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

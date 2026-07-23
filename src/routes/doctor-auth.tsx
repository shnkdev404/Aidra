import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { AidraLogo } from "@/components/ui/logo";

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
    <div className="relative min-h-screen bg-canvas text-ink selection:bg-primary selection:text-primary-foreground bg-geist-mesh">
      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:grid-cols-2 md:items-center md:py-16">
        <div className="hidden md:block">
          <Link to="/for-doctors" className="inline-flex items-center gap-2.5">
            <AidraLogo size="sm" />
            <span className="text-xl font-semibold tracking-tight text-ink">Aidra</span>
            <span className="font-mono text-[11px] font-medium text-[#0070f3] uppercase tracking-wider bg-[#d3e5ff]/30 px-2 py-0.5 rounded-[4px]">FOR DOCTORS</span>
          </Link>

          <h2 className="mt-12 max-w-md text-balance text-4xl font-semibold tracking-tighter text-ink leading-[1.1]">
            A verified space. Real license review. Zero noise.
          </h2>
          <p className="mt-6 max-w-sm text-sm text-body leading-relaxed">
            Sign in, or apply for clinician verification. Every doctor here undergoes manual license verification.
          </p>
          <p className="mt-16 font-mono text-xs uppercase tracking-wider text-mute">
            Not a doctor?{" "}
            <Link to="/auth" className="text-ink font-medium underline underline-offset-4">
              Patient sign in
            </Link>
          </p>
        </div>

        <div className="mx-auto w-full max-w-md md:ml-auto">
          <AuthCard variant="doctor" initialMode={mode ?? "signin"} onSuccessRedirect="/doctor/verify" />
        </div>
      </div>
    </div>
  );
}

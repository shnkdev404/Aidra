import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, FileCheck2, Stethoscope, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/animated/FadeIn";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/animated/Magnetic";

export const Route = createFileRoute("/for-doctors")({
  head: () => ({
    meta: [
      { title: "For doctors — Aidra" },
      {
        name: "description",
        content:
          "Join Aidra as a verified clinician. Real license review, calm space, patient-first tools.",
      },
      { property: "og:title", content: "For doctors — Aidra" },
      {
        property: "og:description",
        content: "A verified space that respects your license and your time.",
      },
    ],
  }),
  component: DoctorLanding,
});

function DoctorLanding() {
  return (
    <div className="bg-ink text-paper">
      <div className="bg-ink text-paper [--background:oklch(0.18_0.02_40)] [--foreground:oklch(0.97_0.018_85)]">
        <SiteHeaderDark />

        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(oklch(0.75 0.13 82) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-24">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-paper/70">
                For verified clinicians
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h1 className="serif mt-6 max-w-4xl text-balance text-5xl leading-[1.05] md:text-7xl">
                Practice with the <em className="italic text-gold">signal-to-noise</em> you actually want.
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-6 max-w-2xl text-lg text-paper/70">
                Aidra is where patients arrive already informed — and where clinicians arrive
                already verified. One paid license review, a quiet workspace, and no
                pretend-doctors on the platform.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Magnetic>
                  <Button asChild size="lg" className="h-12 gap-2 bg-gold text-ink hover:bg-gold/90">
                    <Link to="/doctor-auth" search={{ mode: "signup" }}>
                      Apply for verification <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Magnetic>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-12 text-paper hover:bg-paper/10"
                >
                  <Link to="/doctor-auth">I already have an account</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="verification" className="mx-auto max-w-6xl px-6 py-24">
          <FadeIn>
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.2em] text-paper/50">Verification</div>
              <h2 className="serif mt-3 text-4xl md:text-5xl">
                Three checks. One fixed fee. Trust that shows up on every profile.
              </h2>
            </div>
          </FadeIn>

          <StaggerChildren className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <StaggerItem key={s.title}>
                <div className="h-full rounded-xl border border-paper/10 bg-paper/[0.04] p-7">
                  <s.icon className="h-6 w-6 text-gold" />
                  <div className="serif mt-5 text-2xl">{s.title}</div>
                  <p className="mt-2 text-sm text-paper/70">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        <section id="benefits" className="border-t border-paper/10 bg-paper/[0.03]">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-2">
            <FadeIn>
              <h2 className="serif text-4xl leading-tight md:text-5xl">
                Everything you'd want from a modern practice — nothing you didn't ask for.
              </h2>
            </FadeIn>
            <div className="space-y-6">
              {BENEFITS.map((b, i) => (
                <FadeIn key={b} delay={i * 0.06}>
                  <div className="flex gap-4 border-b border-paper/10 pb-6">
                    <div className="mt-1 h-2 w-2 flex-none rounded-full bg-gold" />
                    <p className="text-lg text-paper/85">{b}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <SiteFooterDark />
      </div>
    </div>
  );
}

// A dark-variant header for this route only (keeps SiteHeader semantics unchanged elsewhere).
function SiteHeaderDark() {
  return (
    <header className="relative z-20 border-b border-paper/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink">
            <span className="serif text-lg leading-none">a</span>
          </div>
          <span className="serif text-xl">Aidra</span>
          <span className="ml-1 hidden text-xs uppercase tracking-[0.18em] text-paper/50 sm:inline">
            for doctors
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-paper/70 md:flex">
          <Link to="/for-doctors" hash="verification" className="hover:text-paper">Verification</Link>
          <Link to="/for-doctors" hash="benefits" className="hover:text-paper">Benefits</Link>
          <Link to="/" className="hover:text-paper">For patients</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="text-paper hover:bg-paper/10">
            <Link to="/doctor-auth">Doctor sign in</Link>
          </Button>
          <Button asChild size="sm" className="bg-gold text-ink hover:bg-gold/90">
            <Link to="/doctor-auth" search={{ mode: "signup" }}>Apply</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function SiteFooterDark() {
  return (
    <footer className="border-t border-paper/10 py-8 text-center text-xs text-paper/50">
      © {new Date().getFullYear()} Aidra. For verified clinicians.
    </footer>
  );
}

const STEPS = [
  {
    icon: FileCheck2,
    title: "Submit your credentials",
    body: "Full name, license number, specialty, and country. Upload your license document.",
  },
  {
    icon: BadgeCheck,
    title: "Pay a one-time review fee",
    body: "Handled securely. Refunded if we can't complete your verification for any reason.",
  },
  {
    icon: Stethoscope,
    title: "Get your verified badge",
    body: "Our team manually reviews and approves. You get a badge patients can trust.",
  },
];

const BENEFITS = [
  "Patients arrive already informed by an AI companion that never oversteps.",
  "A workspace tuned for reading and thinking, not for capturing your attention.",
  "Full control over what you share, and how. No shadow marketing.",
  "Verified badge on every profile — because trust should be visible.",
];

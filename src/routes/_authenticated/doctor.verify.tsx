import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { BadgeCheck, Clock, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { FadeIn } from "@/components/animated/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getMyDoctorApplication,
  submitDoctorApplication,
  upsertDoctorApplication,
} from "@/lib/doctor.functions";

export const Route = createFileRoute("/_authenticated/doctor/verify")({
  head: () => ({ meta: [{ title: "Doctor verification — Aidra" }, { name: "robots", content: "noindex" }] }),
  component: DoctorVerifyPage,
});

function DoctorVerifyPage() {
  const queryClient = useQueryClient();
  const saveFn = useServerFn(upsertDoctorApplication);
  const submitFn = useServerFn(submitDoctorApplication);
  const app = useQuery({
    queryKey: ["doctor-application"],
    queryFn: () => getMyDoctorApplication(),
  });

  const [form, setForm] = useState({
    full_name: "",
    license_number: "",
    specialty: "",
    country: "",
    bio: "",
  });

  useEffect(() => {
    if (app.data) {
      setForm({
        full_name: app.data.full_name ?? "",
        license_number: app.data.license_number ?? "",
        specialty: app.data.specialty ?? "",
        country: app.data.country ?? "",
        bio: app.data.bio ?? "",
      });
    }
  }, [app.data]);

  const save = useMutation({
    mutationFn: () => saveFn({ data: form }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-application"] });
      toast.success("Saved");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to save"),
  });

  const submit = useMutation({
    mutationFn: () => submitFn({ data: undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-application"] });
      toast.success("Submitted for review.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to submit"),
  });

  function handleSave(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  const status = app.data?.status ?? "draft";
  const canEdit = status === "draft" || status === "rejected";

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <FadeIn>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Clinician verification</div>
          <h1 className="serif mt-3 text-5xl">Prove you're the real one.</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Submit your credentials. Pay the one-time review fee. Our team confirms with your
            licensing body before granting your verified badge.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <StatusStrip status={status} />
        </FadeIn>

        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSave}
            className="mt-8 rounded-2xl border border-border/60 bg-card p-6 md:p-8"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" required>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  disabled={!canEdit}
                  maxLength={120}
                  required
                />
              </Field>
              <Field label="License number" required>
                <Input
                  value={form.license_number}
                  onChange={(e) => setForm({ ...form, license_number: e.target.value })}
                  disabled={!canEdit}
                  maxLength={80}
                  required
                />
              </Field>
              <Field label="Specialty" required>
                <Input
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  disabled={!canEdit}
                  placeholder="e.g. Internal medicine"
                  maxLength={80}
                  required
                />
              </Field>
              <Field label="Country" required>
                <Input
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  disabled={!canEdit}
                  maxLength={80}
                  required
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Short bio">
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  disabled={!canEdit}
                  rows={4}
                  maxLength={1000}
                  placeholder="A few sentences patients will read."
                />
              </Field>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Free — manual license review by our team.
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="outline" disabled={!canEdit || save.isPending}>
                  {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save draft"}
                </Button>
                <Button
                  type="button"
                  disabled={!canEdit || submit.isPending}
                  onClick={() => {
                    save.mutateAsync().then(() => submit.mutate());
                  }}
                >
                  {submit.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for review"}
                </Button>
              </div>
            </div>
          </form>
        </FadeIn>

        {app.data?.admin_notes && (
          <FadeIn delay={0.15}>
            <div className="mt-6 rounded-xl border border-border/60 bg-paper-soft/50 p-5 text-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes from review</div>
              <p className="mt-2">{app.data.admin_notes}</p>
            </div>
          </FadeIn>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      {children}
    </div>
  );
}

function StatusStrip({ status }: { status: string }) {
  const map = {
    draft: { icon: ShieldCheck, label: "Draft", body: "Fill in your credentials and submit for review.", tone: "text-muted-foreground" },
    pending_payment: { icon: Clock, label: "Awaiting payment", body: "Complete the $49 verification fee to move forward.", tone: "text-gold" },
    submitted: { icon: Clock, label: "Under review", body: "Our team is verifying with your licensing body. Typically 1–3 business days.", tone: "text-primary" },
    approved: { icon: BadgeCheck, label: "Approved", body: "Welcome, doctor. Your verified badge is live.", tone: "text-primary" },
    rejected: { icon: ShieldCheck, label: "Rejected", body: "See the notes below and update your submission.", tone: "text-destructive" },
  } as const;
  const s = map[status as keyof typeof map] ?? map.draft;
  return (
    <div className="mt-8 flex items-center gap-4 rounded-xl border border-border/60 bg-paper-soft/60 p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-background ${s.tone}`}>
        <s.icon className="h-5 w-5" />
      </div>
      <div>
        <div className={`serif text-xl ${s.tone}`}>{s.label}</div>
        <div className="text-sm text-muted-foreground">{s.body}</div>
      </div>
    </div>
  );
}

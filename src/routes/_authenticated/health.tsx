import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { FadeIn } from "@/components/animated/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addHealthRecord, listHealthRecords } from "@/lib/health.functions";

export const Route = createFileRoute("/_authenticated/health")({
  head: () => ({ meta: [{ title: "BMI — Aidra" }, { name: "robots", content: "noindex" }] }),
  component: HealthPage,
});

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", tone: "text-chart-3" };
  if (bmi < 25) return { label: "Healthy range", tone: "text-primary" };
  if (bmi < 30) return { label: "Overweight", tone: "text-gold" };
  return { label: "Obese", tone: "text-destructive" };
}

function HealthPage() {
  const queryClient = useQueryClient();
  const addFn = useServerFn(addHealthRecord);
  const records = useQuery({
    queryKey: ["health-records"],
    queryFn: () => listHealthRecords(),
  });

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const add = useMutation({
    mutationFn: (input: { height_cm: number; weight_kg: number; notes?: string }) =>
      addFn({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-records"] });
      setWeight("");
      setNotes("");
      toast.success("Logged");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to log"),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    if (!Number.isFinite(h) || !Number.isFinite(w)) {
      toast.error("Enter valid numbers");
      return;
    }
    add.mutate({ height_cm: h, weight_kg: w, notes: notes.trim() || undefined });
  }

  const latest = records.data?.[records.data.length - 1];
  const cat = latest ? bmiCategory(latest.bmi) : null;

  const chartData =
    records.data?.map((r) => ({
      date: new Date(r.recorded_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      bmi: Number(r.bmi),
    })) ?? [];

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <FadeIn>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Health record</div>
          <h1 className="serif mt-3 text-5xl">BMI, over time.</h1>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Height and weight only. Aidra takes care of the math.
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Latest</div>
                  <div className="serif mt-2 text-6xl leading-none">{latest ? latest.bmi.toFixed(1) : "—"}</div>
                  {cat && <div className={`mt-2 text-sm ${cat.tone}`}>{cat.label}</div>}
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {records.data?.length ?? 0} entries
                </div>
              </div>

              <div className="mt-6 h-56">
                {chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="bmiFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.55 0.10 145)" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="oklch(0.55 0.10 145)" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="oklch(0.20 0.02 40 / 0.06)" vertical={false} />
                      <XAxis dataKey="date" stroke="oklch(0.45 0.02 60)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="oklch(0.45 0.02 60)" fontSize={11} tickLine={false} axisLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.98 0.008 85)",
                          border: "1px solid oklch(0.86 0.02 80)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="bmi"
                        stroke="oklch(0.38 0.07 148)"
                        strokeWidth={2}
                        fill="url(#bmiFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Add two entries to see your trend.
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/60 bg-card p-6 md:p-8"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">New entry</div>
              <h2 className="serif mt-2 text-2xl">Log where you are today.</h2>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="50"
                      max="272"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="20"
                      max="500"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    placeholder="After lunch, before workout…"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={add.isPending}>
                  {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save entry"}
                </Button>
              </div>
            </form>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-8 rounded-xl border border-border/60 bg-card p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">History</div>
            <div className="mt-4 divide-y divide-border/60">
              {(records.data ?? []).slice().reverse().slice(0, 8).map((r) => (
                <div key={r.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="text-muted-foreground">
                    {new Date(r.recorded_at).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-muted-foreground">{r.height_cm}cm · {r.weight_kg}kg</span>
                    <span className="serif text-lg">{Number(r.bmi).toFixed(1)}</span>
                  </div>
                </div>
              ))}
              {records.data && records.data.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No entries yet. Add your first one on the right.
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </AppShell>
  );
}

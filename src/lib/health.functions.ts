import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InsertSchema = z.object({
  height_cm: z.number().min(50).max(272),
  weight_kg: z.number().min(20).max(500),
  notes: z.string().max(500).optional().nullable(),
});

export const listHealthRecords = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("health_records")
      .select("id, recorded_at, height_cm, weight_kg, bmi, notes")
      .order("recorded_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const addHealthRecord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InsertSchema.parse(input))
  .handler(async ({ data, context }) => {
    const heightM = data.height_cm / 100;
    const bmi = Number((data.weight_kg / (heightM * heightM)).toFixed(2));
    const { data: row, error } = await context.supabase
      .from("health_records")
      .insert({
        user_id: context.userId,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        bmi,
        notes: data.notes ?? null,
      })
      .select("id, recorded_at, height_cm, weight_kg, bmi, notes")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

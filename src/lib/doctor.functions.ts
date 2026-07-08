import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const NAME_RE = /^\p{L}[\p{L}\p{M}\s'.\-]{1,}$/u;
const LICENSE_RE = /^[A-Za-z0-9][A-Za-z0-9\-\/ ]{2,79}$/;
const PLACE_RE = /^\p{L}[\p{L}\p{M}\s'.\-]{1,}$/u;

const ApplicationSchema = z.object({
  full_name: z.string().trim().min(2).max(120).regex(NAME_RE, "Enter a valid full name"),
  license_number: z.string().trim().min(3).max(80).regex(LICENSE_RE, "Enter a valid license number"),
  specialty: z.string().trim().min(2).max(80).regex(PLACE_RE, "Enter a valid specialty"),
  country: z.string().trim().min(2).max(80).regex(PLACE_RE, "Enter a valid country"),
  bio: z.string().trim().max(1000).optional().nullable(),
});

export const getMyDoctorApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("doctor_applications")
      .select("id, full_name, license_number, specialty, country, bio, status, payment_status, admin_notes, submitted_at, reviewed_at")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const upsertDoctorApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ApplicationSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("doctor_applications")
      .select("id, status")
      .eq("user_id", context.userId)
      .maybeSingle();

    const payload = {
      user_id: context.userId,
      full_name: data.full_name,
      license_number: data.license_number,
      specialty: data.specialty,
      country: data.country,
      bio: data.bio ?? null,
      status: (existing?.status ?? "draft") as
        | "draft" | "pending_payment" | "submitted" | "approved" | "rejected",
    };

    if (existing) {
      const { error } = await context.supabase
        .from("doctor_applications")
        .update(payload)
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("doctor_applications")
        .insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

/**
 * Submit for admin review (no payment step).
 */
export const submitDoctorApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("doctor_applications")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

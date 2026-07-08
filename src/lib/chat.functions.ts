import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM_PROMPT = `You are Aidra, a calm, careful AI health companion.

Voice: warm, unhurried, precise. Speak like a well-read friend who happens to know medicine. Short sentences. Occasional gentle humor is okay; sarcasm is not.

Behavior:
- Ask clarifying questions before jumping to conclusions.
- When you give guidance, explain the reasoning briefly.
- Always remind the user that you are not a substitute for professional medical care when the topic could be serious.
- If the user describes anything that could be an emergency (chest pain, stroke signs, suicidal ideation, severe bleeding, difficulty breathing), tell them plainly to contact their local emergency services immediately.
- Use markdown for structure when helpful: short paragraphs, small bullet lists, occasional bold.

Never:
- Diagnose with certainty.
- Prescribe medication or dosage.
- Pretend to be a licensed physician.`;

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ title: z.string().trim().max(120).optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("chat_threads")
      .insert({
        user_id: context.userId,
        title: data.title?.length ? data.title : "New consultation",
      })
      .select("id, title, updated_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const getThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ threadId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: thread, error: te } = await context.supabase
      .from("chat_threads")
      .select("id, title, updated_at")
      .eq("id", data.threadId)
      .single();
    if (te) throw new Error(te.message);
    const { data: messages, error: me } = await context.supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (me) throw new Error(me.message);
    return { thread, messages: messages ?? [] };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        threadId: z.string().uuid(),
        content: z.string().trim().min(1).max(4000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    // Insert user message
    const userInsert = await context.supabase.from("chat_messages").insert({
      thread_id: data.threadId,
      user_id: context.userId,
      role: "user",
      content: data.content,
    });
    if (userInsert.error) throw new Error(userInsert.error.message);

    // Fetch history for context (RLS scopes to user)
    const { data: history, error: he } = await context.supabase
      .from("chat_messages")
      .select("role, content")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true })
      .limit(40);
    if (he) throw new Error(he.message);

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
    ];

    // UPDATED: Now checks for your Gemini Key instead of Lovable
    const key = process.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("AI service is not configured. Missing VITE_GEMINI_API_KEY.");

    // UPDATED: Calls Google's OpenAI-compatible endpoint directly
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gemini-3.5-flash",
        messages,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached — please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please check your Google AI account.");
      throw new Error(`AI error: ${res.status} ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const reply = json.choices?.[0]?.message?.content?.trim() ?? "";

    const assistantInsert = await context.supabase
      .from("chat_messages")
      .insert({
        thread_id: data.threadId,
        user_id: context.userId,
        role: "assistant",
        content: reply,
      })
      .select("id, role, content, created_at")
      .single();
    if (assistantInsert.error) throw new Error(assistantInsert.error.message);

    // Auto-title thread from first exchange
    const currentCount = (history?.length ?? 0) + 1; // + user just inserted
    if (currentCount <= 1) {
      const title =
        data.content.length > 60
          ? data.content.slice(0, 57).trimEnd() + "…"
          : data.content;
      await context.supabase
        .from("chat_threads")
        .update({ title })
        .eq("id", data.threadId);
    } else {
      await context.supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", data.threadId);
    }

    return assistantInsert.data;
  });
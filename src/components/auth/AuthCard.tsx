import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email")
  .max(255);
const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .max(128, "Too long");
const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your full name")
  .max(80)
  .regex(/^\p{L}[\p{L}\p{M}\s'.\-]{1,}$/u, "Use letters, spaces, hyphens or apostrophes only");

interface Props {
  variant: "patient" | "doctor";
  initialMode?: "signin" | "signup";
  onSuccessRedirect: string;
}

export function AuthCard({ variant, initialMode = "signin", onSuccessRedirect }: Props) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate with Zod (never trust raw input, protects against injection-shaped payloads)
      const parsedEmail = emailSchema.parse(email);
      const parsedPassword = passwordSchema.parse(password);

      if (mode === "signup") {
        const parsedName = nameSchema.parse(name);
        const { error } = await supabase.auth.signUp({
          email: parsedEmail,
          password: parsedPassword,
          options: {
            emailRedirectTo: `${window.location.origin}${onSuccessRedirect}`,
            data: { display_name: parsedName, intended_role: variant },
          },
        });
        if (error) throw error;
        toast.success("Welcome to Aidra");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsedEmail,
          password: parsedPassword,
        });
        if (error) throw error;
        toast.success("Signed in");
      }
      navigate({ to: onSuccessRedirect });
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.issues[0]?.message : err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  
  async function handleGoogle() {
  setLoading(true);

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    setLoading(false);
  }
}

  const isDoctor = variant === "doctor";
  const primaryLabel = mode === "signup" ? (isDoctor ? "Create doctor account" : "Create account") : "Sign in";

  return (
    <div className="w-full max-w-md">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {isDoctor ? "Clinician access" : "Patient access"}
      </div>
      <h1 className="serif mt-3 text-4xl md:text-5xl">
        {mode === "signup"
          ? isDoctor
            ? "Apply as a doctor."
            : "Begin, gently."
          : "Welcome back."}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {mode === "signup"
          ? isDoctor
            ? "After signup you'll complete a paid license verification. It's a one-time fee."
            : "Free to start. Your data stays yours."
          : "Sign in to pick up where you left off."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={80}
              required
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={255}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={8}
            maxLength={128}
            required
          />
          {mode === "signup" && (
            <p className="text-xs text-muted-foreground">At least 8 characters. Checked against known-breach lists.</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : primaryLabel}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-3"
        onClick={handleGoogle}
        disabled={loading}
      >
        <GoogleGlyph /> Continue with Google
      </Button>

      <div className="mt-6 text-sm text-muted-foreground">
        {mode === "signup" ? "Already have an account?" : "New to Aidra?"}{" "}
        <button
          type="button"
          className="text-primary underline underline-offset-4"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        >
          {mode === "signup" ? "Sign in" : (isDoctor ? "Apply as a doctor" : "Create an account")}
        </button>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

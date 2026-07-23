import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, HeartPulse } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(255);
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long");
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
        toast.success("Welcome to Aidra Health");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsedEmail,
          password: parsedPassword,
        });
        if (error) throw error;
        toast.success("Signed in successfully");
      }
      navigate({ to: onSuccessRedirect });
    } catch (err) {
      const msg =
        err instanceof z.ZodError
          ? err.issues[0]?.message
          : err instanceof Error
          ? err.message
          : "Something went wrong";
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
  const primaryLabel =
    mode === "signup" ? (isDoctor ? "Apply as Doctor" : "Create Account") : "Sign In";

  return (
    <div className="w-full max-w-md rounded-2xl bg-[#181818] p-8 border border-[#282828] shadow-2xl">
      <div className="flex justify-center mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg">
          <HeartPulse className="h-6 w-6 fill-black" />
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-[#1DB954]">
          {isDoctor ? "Clinician Portal" : "Patient Access"}
        </div>
        <h1 className="mt-2 text-3xl font-extrabold text-white">
          {mode === "signup"
            ? isDoctor
              ? "Apply as Doctor"
              : "Create your account"
            : "Log in to Aidra"}
        </h1>
        <p className="mt-2 text-xs text-[#a7a7a7]">
          {mode === "signup"
            ? isDoctor
              ? "Complete verification to unlock doctor credentials."
              : "Free 24/7 AI health consultations."
            : "Enter your details to pick up where you left off."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-[#b3b3b3]">
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={80}
              required
              className="bg-[#242424] border-none text-white focus:ring-2 focus:ring-[#1DB954]"
              placeholder="Sarah Connor"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold text-[#b3b3b3]">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={255}
            required
            className="bg-[#242424] border-none text-white focus:ring-2 focus:ring-[#1DB954]"
            placeholder="name@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-bold text-[#b3b3b3]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={8}
            maxLength={128}
            required
            className="bg-[#242424] border-none text-white focus:ring-2 focus:ring-[#1DB954]"
          />
        </div>

        <button
          type="submit"
          className="mt-2 h-12 w-full rounded-full bg-[#1DB954] font-extrabold text-black shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : primaryLabel}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-bold text-[#a7a7a7]">
        <div className="h-px flex-1 bg-[#282828]" />
        OR
        <div className="h-px flex-1 bg-[#282828]" />
      </div>

      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#242424] border border-[#282828] text-xs font-bold text-white hover:bg-[#2a2a2a] transition-all disabled:opacity-50"
        onClick={handleGoogle}
        disabled={loading}
      >
        <GoogleGlyph /> Continue with Google
      </button>

      <div className="mt-6 text-center text-xs text-[#a7a7a7]">
        {mode === "signup" ? "Already have an account?" : "New to Aidra?"}{" "}
        <button
          type="button"
          className="font-bold text-[#1DB954] hover:underline"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        >
          {mode === "signup"
            ? "Log in"
            : isDoctor
            ? "Apply as doctor"
            : "Sign up free"}
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

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getThread, sendMessage } from "@/lib/chat.functions";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const getFn = useServerFn(getThread);
  const sendFn = useServerFn(sendMessage);

  const q = useQuery({
    queryKey: ["chat-thread", threadId],
    queryFn: () => getFn({ data: { threadId } }),
  });

  const [input, setInput] = useState("");
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const send = useMutation({
    mutationFn: (content: string) => sendFn({ data: { threadId, content } }),
    onSuccess: () => {
      setPendingUser(null);
      queryClient.invalidateQueries({ queryKey: ["chat-thread", threadId] });
      queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    onError: (err) => {
      setPendingUser(null);
      toast.error(err instanceof Error ? err.message : "Failed to send");
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [q.data?.messages.length, pendingUser, send.isPending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || send.isPending) return;
    setPendingUser(trimmed);
    setInput("");
    send.mutate(trimmed);
  }

  if (q.error) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl p-10 text-center">
          <div className="text-destructive">{(q.error as Error).message}</div>
          <Button className="mt-4" onClick={() => router.invalidate()}>Retry</Button>
        </div>
      </AppShell>
    );
  }

  const messages = q.data?.messages ?? [];

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-56px)] flex-col md:h-screen">
        <div className="flex items-center gap-3 border-b border-border/60 px-6 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/chat"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="min-w-0 flex-1 truncate">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Aidra</div>
            <div className="truncate serif text-lg">{q.data?.thread.title ?? "…"}</div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8">
            {messages.length === 0 && !pendingUser && (
              <div className="rounded-2xl border border-dashed border-border/70 bg-paper-soft/60 p-8 text-center">
                <Sparkles className="mx-auto h-5 w-5 text-primary" />
                <div className="serif mt-3 text-2xl">Start with what's on your mind.</div>
                <p className="mt-1 text-sm text-muted-foreground">Symptoms, sleep, a habit, a worry. Aidra listens first, then explains.</p>
              </div>
            )}
            {messages.map((m) => <Bubble key={m.id} role={m.role} content={m.content} />)}
            <AnimatePresence>
              {pendingUser && <Bubble key="pending-u" role="user" content={pendingUser} />}
              {send.isPending && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-[85%] self-start rounded-2xl rounded-tl-sm border border-primary/15 bg-primary/5 px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-border/60 bg-paper/80 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent);
                }
              }}
              rows={1}
              placeholder="Message Aidra…"
              className="min-h-11 resize-none"
              maxLength={4000}
              disabled={send.isPending}
            />
            <Button type="submit" size="icon" disabled={send.isPending || !input.trim()} className="h-11 w-11 flex-none">
              {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted-foreground">
            Aidra is not a substitute for professional medical care. In emergencies, call your local emergency line.
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "max-w-[85%]",
        isUser ? "self-end" : "self-start",
      )}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-secondary text-foreground"
            : "rounded-tl-sm border border-primary/15 bg-primary/5 text-foreground",
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:serif prose-headings:my-3 prose-strong:text-foreground prose-ul:my-2">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

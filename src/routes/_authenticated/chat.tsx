import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Chat — Aidra" }, { name: "robots", content: "noindex" }] }),
  component: () => <Outlet />,
});

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CorpShell } from "@/components/corp/corp-shell";

export const Route = createFileRoute("/corporate")({
  component: () => (
    <CorpShell>
      <Outlet />
    </CorpShell>
  ),
});

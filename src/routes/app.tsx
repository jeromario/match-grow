import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/matchcv/AppSidebar";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "MatchCV — Sua central de vagas e currículos" },
      {
        name: "description",
        content: "Gerencie perfil, currículos, vagas, match e candidaturas no MatchCV.",
      },
      { property: "og:title", content: "MatchCV — Sua central de vagas e currículos" },
      {
        property: "og:description",
        content: "Gerencie perfil, currículos, vagas, match e candidaturas no MatchCV.",
      },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <header className="no-print sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur">
            <SidebarTrigger aria-label="Abrir menu" />
            <Link to="/app" className="flex items-center gap-2 text-sm font-semibold md:hidden">
              <Sparkles className="size-4 text-primary" /> MatchCV
            </Link>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

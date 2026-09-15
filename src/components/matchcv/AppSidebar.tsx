import { Link, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  FileText,
  History,
  LayoutDashboard,
  Send,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems: { title: string; url: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Vagas", url: "/app/vagas", icon: Briefcase },
  { title: "Meu Perfil", url: "/app/perfil", icon: User },
  { title: "Meus Currículos", url: "/app/curriculos", icon: FileText },
  { title: "Minhas Candidaturas", url: "/app/candidaturas", icon: Send },
  { title: "Histórico", url: "/app/historico", icon: History },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/app" className="flex items-center gap-2 px-2 py-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-base font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            MatchCV
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)} tooltip={item.title}>
                    <Link to={item.url as never}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/app/configuracoes")} tooltip="Configurações">
              <Link to="/app/configuracoes">
                <Settings />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

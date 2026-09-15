import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApplicationStatusBadge, EmptyState, PageHeader } from "@/components/matchcv/common";
import { useMatchCV } from "@/lib/matchcv/store";
import type { ApplicationStatus } from "@/lib/matchcv/types";

export const Route = createFileRoute("/app/candidaturas")({
  component: ApplicationsPage,
});

const statuses: ApplicationStatus[] = [
  "Interessado",
  "Aplicar",
  "Aplicado",
  "Entrevista",
  "Oferta",
  "Rejeitado",
  "Encerrado",
];

function ApplicationsPage() {
  const { state, upsertApplication, addActivity } = useMatchCV();
  const navigate = useNavigate();

  if (state.applications.length === 0) {
    return (
      <div>
        <PageHeader title="Minhas candidaturas" description="Acompanhe cada processo do interesse à oferta." />
        <EmptyState
          icon={<Send className="size-6" />}
          title="Nenhuma candidatura registrada"
          description="Abra uma vaga e registre seu interesse para acompanhar o processo por aqui."
          actionLabel="Ver vagas"
          onAction={() => navigate({ to: "/app/vagas" })}
        />
      </div>
    );
  }

  const change = (id: string, status: ApplicationStatus) => {
    const app = state.applications.find((a) => a.id === id);
    if (!app) return;
    upsertApplication({ ...app, status, updatedAt: new Date().toISOString() });
    addActivity("application", `Status atualizado para ${status}`);
    toast.success("Status atualizado.");
  };

  return (
    <div>
      <PageHeader title="Minhas candidaturas" description="Acompanhe cada processo do interesse à oferta." />

      <div className="mb-8 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {statuses.slice(0, 5).map((status) => {
          const items = state.applications.filter((a) => a.status === status);
          return (
            <Card key={status}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <ApplicationStatusBadge status={status} />
                  <span className="text-muted-foreground">{items.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((a) => {
                  const job = state.jobs.find((j) => j.id === a.jobId);
                  return (
                    <Link
                      key={a.id}
                      to="/app/vagas/$jobId"
                      params={{ jobId: a.jobId }}
                      className="block rounded-lg border p-2 text-xs hover:bg-muted"
                    >
                      <p className="font-medium">{job?.title ?? "Vaga"}</p>
                      <p className="text-muted-foreground">{job?.company}</p>
                    </Link>
                  );
                })}
                {items.length === 0 && <p className="text-xs text-muted-foreground">Vazio</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vaga</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Currículo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.applications.map((a) => {
                const job = state.jobs.find((j) => j.id === a.jobId);
                const resume = state.resumes.find((r) => r.id === a.resumeId || r.jobId === a.jobId);
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{job?.title ?? "—"}</TableCell>
                    <TableCell>{job?.company ?? "—"}</TableCell>
                    <TableCell>{a.matchScore ? `${a.matchScore}%` : "—"}</TableCell>
                    <TableCell className="max-w-48 truncate">{resume?.name ?? "—"}</TableCell>
                    <TableCell>{new Date(a.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Select value={a.status} onValueChange={(v) => change(a.id, v as ApplicationStatus)}>
                        <SelectTrigger className="w-40" aria-label="Alterar status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, PageHeader } from "@/components/matchcv/common";
import { useMatchCV } from "@/lib/matchcv/store";

export const Route = createFileRoute("/app/historico")({
  component: HistoryPage,
});

function HistoryPage() {
  const { state } = useMatchCV();
  const navigate = useNavigate();
  const hasData = state.matches.length > 0 || state.resumes.length > 0 || state.applications.length > 0;

  if (!hasData) {
    return (
      <div>
        <PageHeader title="Histórico" description="Tudo o que você analisou e gerou fica registrado aqui." />
        <EmptyState
          icon={<History className="size-6" />}
          title="Nada por aqui ainda"
          description="Analise uma vaga ou gere um currículo para começar seu histórico."
          actionLabel="Ver vagas"
          onAction={() => navigate({ to: "/app/vagas" })}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Histórico" description="Tudo o que você analisou e gerou fica registrado aqui." />

      <Tabs defaultValue="vagas">
        <TabsList>
          <TabsTrigger value="vagas">Vagas analisadas</TabsTrigger>
          <TabsTrigger value="curriculos">Currículos gerados</TabsTrigger>
          <TabsTrigger value="candidaturas">Candidaturas</TabsTrigger>
        </TabsList>

        <TabsContent value="vagas" className="mt-5">
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.matches.map((m) => {
                    const job = state.jobs.find((j) => j.id === m.jobId);
                    return (
                      <TableRow key={m.jobId}>
                        <TableCell className="font-medium">{job?.title ?? "Vaga removida"}</TableCell>
                        <TableCell>{job?.company ?? "—"}</TableCell>
                        <TableCell>{m.score}%</TableCell>
                        <TableCell>{new Date(m.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-right">
                          {job && (
                            <Button asChild variant="ghost" size="sm">
                              <Link to="/app/vagas/$jobId" params={{ jobId: job.id }}>
                                Abrir
                              </Link>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculos" className="mt-5">
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currículo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>ATS</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.resumes.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.type === "base" ? "Base" : "Personalizado"}</TableCell>
                      <TableCell>{typeof r.atsScore === "number" ? `${r.atsScore}/100` : "—"}</TableCell>
                      <TableCell>{new Date(r.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/app/curriculos/$resumeId" params={{ resumeId: r.id }}>
                            Abrir
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidaturas" className="mt-5">
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vaga</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.applications.map((a) => {
                    const job = state.jobs.find((j) => j.id === a.jobId);
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{job?.title ?? "—"}</TableCell>
                        <TableCell>{job?.company ?? "—"}</TableCell>
                        <TableCell>{a.status}</TableCell>
                        <TableCell>{new Date(a.updatedAt).toLocaleDateString("pt-BR")}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

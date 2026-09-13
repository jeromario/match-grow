import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Briefcase, FileText, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard, EmptyState, PageHeader, ProfileCompletion } from "@/components/matchcv/common";
import { JobCard } from "@/components/matchcv/JobCard";
import { profileCompletion, useMatchCV } from "@/lib/matchcv/store";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { state, hydrated } = useMatchCV();
  const { profile, matches, jobs, resumes, applications, activity } = state;

  const completion = profileCompletion(profile);
  const avgMatch = matches.length
    ? Math.round(matches.reduce((acc, m) => acc + m.score, 0) / matches.length)
    : 0;

  const topJobs = useMemo(() => {
    return [...matches]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((m) => ({ match: m, job: jobs.find((j) => j.id === m.jobId) }))
      .filter((x): x is { match: (typeof matches)[number]; job: (typeof jobs)[number] } => !!x.job);
  }, [matches, jobs]);

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div>
      <PageHeader
        title={firstName ? `Olá, ${firstName}! 👋` : "Vamos encontrar sua próxima oportunidade."}
        description="Acompanhe suas vagas, matches e currículos em um só lugar."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/app/curriculos">
                <FileText className="size-4" /> Meus currículos
              </Link>
            </Button>
            <Button asChild>
              <Link to="/app/vagas/nova">
                <Plus className="size-4" /> Adicionar vaga
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardCard label="Vagas analisadas" value={matches.length} />
        <DashboardCard label="Matches encontrados" value={matches.filter((m) => m.score >= 60).length} hint="Acima de 60%" />
        <DashboardCard label="Currículos gerados" value={resumes.length} />
        <DashboardCard label="Candidaturas" value={applications.length} />
        <DashboardCard label="Match médio" value={`${avgMatch}%`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Melhores oportunidades</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/vagas">Ver todas</Link>
            </Button>
          </div>
          {topJobs.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {topJobs.map(({ job, match }) => (
                <JobCard key={job.id} job={job} match={match} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Briefcase className="size-6" />}
              title="Nenhuma vaga analisada ainda"
              description="Analise uma vaga para descobrir sua compatibilidade e receber recomendações."
            />
          )}
        </section>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Seu perfil</CardTitle>
              <CardDescription>Quanto mais completo, mais preciso é o match.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileCompletion value={completion} />
              <Button asChild variant="outline" className="w-full">
                <Link to="/app/perfil">Completar perfil</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Últimas atividades</CardTitle>
            </CardHeader>
            <CardContent>
              {activity.length ? (
                <ul className="space-y-3">
                  {activity.slice(0, 6).map((a) => (
                    <li key={a.id} className="flex gap-2 text-sm">
                      <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <div>
                        <p>{a.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(a.createdAt).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Suas ações aparecerão aqui.</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

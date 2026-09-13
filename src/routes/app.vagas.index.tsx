import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Briefcase, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, PageHeader } from "@/components/matchcv/common";
import { JobCard } from "@/components/matchcv/JobCard";
import { useMatchCV } from "@/lib/matchcv/store";

export const Route = createFileRoute("/app/vagas/")({
  component: JobsPage,
});

const ALL = "todos";

function JobsPage() {
  const { state } = useMatchCV();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState(ALL);
  const [seniority, setSeniority] = useState(ALL);
  const [location, setLocation] = useState("");

  const jobs = useMemo(() => {
    const q = query.toLowerCase();
    return state.jobs.filter((j) => {
      const matchesQuery =
        !q ||
        `${j.title} ${j.company} ${j.requirements} ${j.description} ${j.area}`.toLowerCase().includes(q);
      const matchesMode = mode === ALL || j.workMode === mode;
      const matchesSeniority = seniority === ALL || j.seniority === seniority;
      const matchesLocation = !location || j.location.toLowerCase().includes(location.toLowerCase());
      return matchesQuery && matchesMode && matchesSeniority && matchesLocation;
    });
  }, [state.jobs, query, mode, seniority, location]);

  return (
    <div>
      <PageHeader
        title="Vagas"
        description="Adicione vagas de interesse e descubra sua compatibilidade com cada uma."
        action={
          <Button asChild>
            <Link to="/app/vagas/nova">
              <Plus className="size-4" /> Adicionar vaga
            </Link>
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="q">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="q"
                className="pl-9"
                placeholder="Cargo, empresa ou tecnologia"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="loc">Localização</Label>
            <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Cidade ou estado" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mode-filter">Modalidade</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger id="mode-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                {["Presencial", "Híbrido", "Remoto", "Indiferente"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sen-filter">Senioridade</Label>
            <Select value={seniority} onValueChange={setSeniority}>
              <SelectTrigger id="sen-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas</SelectItem>
                {["Estágio", "Júnior", "Pleno", "Sênior", "Especialista", "Liderança"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {jobs.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} match={state.matches.find((m) => m.jobId === job.id)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="size-6" />}
          title="Nenhuma vaga encontrada"
          description="Ajuste os filtros ou adicione uma nova vaga para analisar."
        />
      )}
    </div>
  );
}

import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, ExternalLink, FileText, MapPin, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, KeywordList, LoadingState, PageHeader } from "@/components/matchcv/common";
import { MatchBreakdown, MatchScore } from "@/components/matchcv/MatchScore";
import { SkillBadge } from "@/components/matchcv/common";
import { calculateMatch, generateTailoredResume, analyzeATS } from "@/lib/matchcv/services/ai";
import { uid, useMatchCV } from "@/lib/matchcv/store";
import type { Application, ApplicationStatus, Resume } from "@/lib/matchcv/types";

export const Route = createFileRoute("/app/vagas/$jobId")({
  component: JobDetail,
});

const generationSteps = [
  "Analisando a vaga...",
  "Identificando keywords...",
  "Adaptando seu currículo...",
  "Currículo pronto!",
];

function JobDetail() {
  const { jobId } = useParams({ from: "/app/vagas/$jobId" });
  const navigate = useNavigate();
  const { state, saveMatch, upsertResume, upsertApplication, removeJob, addActivity } = useMatchCV();

  const job = state.jobs.find((j) => j.id === jobId);
  const match = state.matches.find((m) => m.jobId === jobId);
  const baseResume = state.resumes.find((r) => r.type === "base") ?? state.resumes[0];
  const application = state.applications.find((a) => a.jobId === jobId);

  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (job && !match) {
      setAnalyzing(true);
      const t = setTimeout(() => {
        const result = calculateMatch(state.profile, job);
        saveMatch(result);
        addActivity("match", `Vaga analisada: ${job.title} — ${result.score}% de compatibilidade`);
        setAnalyzing(false);
      }, 600);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, job, match]);

  if (!job) {
    return (
      <EmptyState
        title="Vaga não encontrada"
        description="Essa vaga pode ter sido removida. Volte para a lista e escolha outra."
        actionLabel="Ver vagas"
        onAction={() => navigate({ to: "/app/vagas" })}
      />
    );
  }

  const generateResume = () => {
    if (!baseResume) {
      toast.error("Crie seu currículo principal antes de gerar uma versão para esta vaga.");
      navigate({ to: "/app/curriculos" });
      return;
    }
    if (!match) return;

    setGenerating(true);
    setStep(0);
    const timers = [1, 2, 3].map((i) => setTimeout(() => setStep(i), i * 700));

    setTimeout(() => {
      const { content, notes } = generateTailoredResume(baseResume, job, match);
      const now = new Date().toISOString();
      const resume: Resume = {
        id: uid(),
        name: `Currículo — ${job.title} — ${job.company}`,
        type: "tailored",
        jobId: job.id,
        content,
        notes,
        createdAt: now,
        updatedAt: now,
      };
      resume.atsScore = analyzeATS(resume, job).score;
      upsertResume(resume);
      addActivity("resume", `Currículo gerado para ${job.title} — ${job.company}`);
      timers.forEach(clearTimeout);
      setGenerating(false);
      toast.success("Currículo personalizado criado.");
      navigate({ to: "/app/curriculos/$resumeId", params: { resumeId: resume.id } });
    }, 2400);
  };

  const setStatus = (status: ApplicationStatus) => {
    const now = new Date().toISOString();
    const app: Application = application
      ? { ...application, status, updatedAt: now, appliedAt: status === "Aplicado" ? now : application.appliedAt }
      : {
          id: uid(),
          jobId: job.id,
          resumeId: state.resumes.find((r) => r.jobId === job.id)?.id,
          status,
          matchScore: match?.score,
          appliedAt: status === "Aplicado" ? now : undefined,
          notes: "",
          createdAt: now,
          updatedAt: now,
        };
    upsertApplication(app);
    addActivity("application", `Candidatura ${status.toLowerCase()}: ${job.title} — ${job.company}`);
    toast.success("Candidatura atualizada.");
  };

  const tailored = state.resumes.filter((r) => r.jobId === job.id);

  return (
    <div>
      <PageHeader
        title={job.title}
        description={`${job.company} • ${job.location || "Local não informado"}`}
        action={
          <div className="flex flex-wrap gap-2">
            {job.url && (
              <Button variant="outline" asChild>
                <a href={job.url} target="_blank" rel="noreferrer noopener">
                  <ExternalLink className="size-4" /> Abrir anúncio
                </a>
              </Button>
            )}
            {!job.isDemo && (
              <Button
                variant="ghost"
                className="text-destructive"
                onClick={() => {
                  removeJob(job.id);
                  toast.success("Vaga removida.");
                  navigate({ to: "/app/vagas" });
                }}
              >
                <Trash2 className="size-4" /> Excluir
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{job.workMode}</Badge>
                <Badge variant="secondary">{job.seniority}</Badge>
                {job.area && <Badge variant="secondary">{job.area}</Badge>}
                {job.isDemo && (
                  <Badge className="border-0 bg-accent-soft text-accent-foreground">Vaga de demonstração</Badge>
                )}
              </div>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="size-4" /> {job.company}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" /> {job.location || "Não informado"}
              </p>
              {job.salary && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="size-4" /> {job.salary}
                </p>
              )}
              {job.description && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <h3 className="mb-1 font-medium text-foreground">Descrição</h3>
                    <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
                  </div>
                </>
              )}
              {job.requirements && (
                <div>
                  <h3 className="mb-1 font-medium text-foreground">Requisitos</h3>
                  <p className="whitespace-pre-line text-muted-foreground">{job.requirements}</p>
                </div>
              )}
              {job.niceToHave && (
                <div>
                  <h3 className="mb-1 font-medium text-foreground">Diferenciais</h3>
                  <p className="whitespace-pre-line text-muted-foreground">{job.niceToHave}</p>
                </div>
              )}
              {job.benefits && (
                <div>
                  <h3 className="mb-1 font-medium text-foreground">Benefícios</h3>
                  <p className="whitespace-pre-line text-muted-foreground">{job.benefits}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compatibilidade</CardTitle>
              <CardDescription>Comparação entre o seu perfil e os requisitos desta vaga.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analyzing || !match ? (
                <LoadingState steps={["Analisando a vaga...", "Comparando com o seu perfil..."]} current={0} />
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-4">
                    <MatchScore score={match.score} size="lg" withHint />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {match.score >= 75
                          ? "Seu perfil tem alta compatibilidade com esta vaga."
                          : match.score >= 50
                            ? "Seu perfil tem compatibilidade parcial com esta vaga."
                            : "Ainda há distância entre seu perfil e esta vaga."}
                      </p>
                    </div>
                  </div>

                  <MatchBreakdown breakdown={match.breakdown} />

                  <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                    <div>
                      <h4 className="text-sm font-semibold">Por que você combina com esta vaga?</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{match.why}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">O que está faltando?</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{match.gaps}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Como melhorar</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{match.howToImprove}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 text-sm font-semibold">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {match.matchedSkills.map((s) => (
                        <SkillBadge key={s} name={s} present />
                      ))}
                      {match.missingSkills.map((s) => (
                        <SkillBadge key={s} name={s} present={false} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {match && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Keywords importantes</CardTitle>
                <CardDescription>Termos que os sistemas de triagem costumam procurar nesta vaga.</CardDescription>
              </CardHeader>
              <CardContent>
                <KeywordList found={match.keywordsFound} missing={match.keywordsMissing} />
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Currículo</CardTitle>
              <CardDescription>
                Personalizamos seu currículo com base nos requisitos desta vaga, sem inventar informações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {generating ? (
                <LoadingState steps={generationSteps} current={step} />
              ) : (
                <>
                  {baseResume ? (
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/app/curriculos/$resumeId" params={{ resumeId: baseResume.id }}>
                        <FileText className="size-4" /> Seu currículo atual
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/app/curriculos">Criar currículo principal</Link>
                    </Button>
                  )}
                  <Button className="w-full" onClick={generateResume} disabled={!match}>
                    Criar currículo para esta vaga
                  </Button>
                </>
              )}

              {tailored.length > 0 && (
                <ul className="space-y-2 pt-2">
                  {tailored.map((r) => (
                    <li key={r.id}>
                      <Link
                        to="/app/curriculos/$resumeId"
                        params={{ resumeId: r.id }}
                        className="block truncate rounded-md border p-2 text-sm hover:bg-muted"
                      >
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Candidatura</CardTitle>
              <CardDescription>Acompanhe o andamento deste processo.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={application?.status ?? ""} onValueChange={(v) => setStatus(v as ApplicationStatus)}>
                <SelectTrigger aria-label="Status da candidatura">
                  <SelectValue placeholder="Registrar candidatura" />
                </SelectTrigger>
                <SelectContent>
                  {["Interessado", "Aplicar", "Aplicado", "Entrevista", "Oferta", "Rejeitado", "Encerrado"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

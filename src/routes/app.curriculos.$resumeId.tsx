import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EmptyState, KeywordList, PageHeader } from "@/components/matchcv/common";
import { ATSIssue, ATSScore } from "@/components/matchcv/ATSScore";
import { ResumePreview } from "@/components/matchcv/ResumePreview";
import { Field } from "@/components/matchcv/editors";
import { analyzeATS } from "@/lib/matchcv/services/ai";
import { uid, useMatchCV } from "@/lib/matchcv/store";
import type { Resume, ResumeContent } from "@/lib/matchcv/types";

export const Route = createFileRoute("/app/curriculos/$resumeId")({
  component: ResumeEditorPage,
});

function ResumeEditorPage() {
  const { resumeId } = useParams({ from: "/app/curriculos/$resumeId" });
  const navigate = useNavigate();
  const { state, upsertResume, addActivity } = useMatchCV();
  const resume = state.resumes.find((r) => r.id === resumeId);
  const job = state.jobs.find((j) => j.id === resume?.jobId);
  const [atsView, setAtsView] = useState(false);

  const analysis = useMemo(() => (resume ? analyzeATS(resume, job) : null), [resume, job]);

  if (!resume || !analysis) {
    return (
      <EmptyState
        title="Currículo não encontrado"
        description="Ele pode ter sido excluído. Volte para a lista e escolha outro."
        actionLabel="Ver currículos"
        onAction={() => navigate({ to: "/app/curriculos" })}
      />
    );
  }

  const update = (patch: Partial<Resume>) =>
    upsertResume({ ...resume, ...patch, updatedAt: new Date().toISOString() });

  const updateContent = (patch: Partial<ResumeContent>) =>
    update({ content: { ...resume.content, ...patch } });

  return (
    <div>
      <PageHeader
        title={resume.name}
        description={job ? `Versão personalizada para ${job.title} — ${job.company}` : "Currículo base"}
        action={
          <div className="no-print flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                update({ atsScore: analysis.score });
                addActivity("resume", `Currículo analisado: ${resume.name} — ATS ${analysis.score}/100`);
                toast.success(`Pontuação ATS: ${analysis.score}/100`);
              }}
            >
              Analisar currículo
            </Button>
            <Button
              onClick={() => {
                setAtsView(true);
                setTimeout(() => window.print(), 200);
              }}
            >
              <Download className="size-4" /> Baixar PDF
            </Button>
          </div>
        }
      />

      {resume.notes && resume.notes.length > 0 && (
        <Alert className="no-print mb-6">
          <AlertTitle>O que foi ajustado nesta versão</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              {resume.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="no-print space-y-6">
          <Tabs defaultValue="conteudo">
            <TabsList>
              <TabsTrigger value="conteudo">Editor</TabsTrigger>
              <TabsTrigger value="ats">Análise ATS</TabsTrigger>
            </TabsList>

            <TabsContent value="conteudo" className="mt-5 space-y-5">
              <Card>
                <CardContent className="space-y-4 p-5">
                  <Field label="Nome do currículo" id="r-name">
                    <Input id="r-name" value={resume.name} onChange={(e) => update({ name: e.target.value })} />
                  </Field>
                  <Field label="Cargo/objetivo" id="r-headline">
                    <Input
                      id="r-headline"
                      value={resume.content.headline}
                      onChange={(e) => updateContent({ headline: e.target.value })}
                    />
                  </Field>
                  <Field label="Resumo profissional" id="r-summary">
                    <Textarea
                      id="r-summary"
                      rows={5}
                      value={resume.content.summary}
                      onChange={(e) => updateContent({ summary: e.target.value })}
                    />
                  </Field>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Experiências</CardTitle>
                  <CardDescription>Edite livremente. Mantenha sempre informações verdadeiras.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {resume.content.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-3 rounded-lg border p-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          aria-label="Cargo"
                          value={exp.position}
                          onChange={(e) =>
                            updateContent({
                              experiences: resume.content.experiences.map((x) =>
                                x.id === exp.id ? { ...x, position: e.target.value } : x,
                              ),
                            })
                          }
                        />
                        <Input
                          aria-label="Empresa"
                          value={exp.company}
                          onChange={(e) =>
                            updateContent({
                              experiences: resume.content.experiences.map((x) =>
                                x.id === exp.id ? { ...x, company: e.target.value } : x,
                              ),
                            })
                          }
                        />
                      </div>
                      <Textarea
                        aria-label="Descrição"
                        rows={4}
                        value={exp.description}
                        onChange={(e) =>
                          updateContent({
                            experiences: resume.content.experiences.map((x) =>
                              x.id === exp.id ? { ...x, description: e.target.value } : x,
                            ),
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() =>
                          updateContent({
                            experiences: resume.content.experiences.filter((x) => x.id !== exp.id),
                          })
                        }
                      >
                        <Trash2 className="size-4" /> Remover
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateContent({
                        experiences: [
                          ...resume.content.experiences,
                          {
                            id: uid(),
                            company: "",
                            position: "",
                            startDate: "",
                            endDate: "",
                            isCurrent: false,
                            description: "",
                            achievements: "",
                            technologies: "",
                          },
                        ],
                      })
                    }
                  >
                    <Plus className="size-4" /> Adicionar experiência
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Competências</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {resume.content.skills.map((s) => (
                      <Badge key={s.id} variant="secondary" className="gap-1 py-1 pl-3 pr-1 font-normal">
                        {s.name}
                        <button
                          type="button"
                          aria-label={`Remover ${s.name}`}
                          className="rounded-full p-1 hover:bg-background"
                          onClick={() =>
                            updateContent({ skills: resume.content.skills.filter((x) => x.id !== s.id) })
                          }
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    aria-label="Adicionar competência"
                    placeholder="Digite uma competência e pressione Enter"
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (!value) return;
                      updateContent({
                        skills: [...resume.content.skills, { id: uid(), name: value, type: "hard", level: "" }],
                      });
                      e.currentTarget.value = "";
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ats" className="mt-5 space-y-5">
              <Card>
                <CardContent className="p-5">
                  <ATSScore analysis={analysis} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recomendações</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.issues.map((issue) => (
                      <ATSIssue key={issue.title} issue={issue} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
              {job && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Keywords desta vaga</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <KeywordList found={analysis.keywordsFound} missing={analysis.keywordsMissing} />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-3">
          <div className="no-print flex items-center justify-between">
            <h2 className="text-sm font-semibold">Pré-visualização</h2>
            <Button variant="outline" size="sm" onClick={() => setAtsView((v) => !v)}>
              {atsView ? "Ver versão visual" : "Visualizar versão ATS"}
            </Button>
          </div>
          <ResumePreview profile={state.profile} content={resume.content} ats={atsView} />
        </div>
      </div>
    </div>
  );
}

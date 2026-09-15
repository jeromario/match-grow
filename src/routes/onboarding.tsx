import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CertificationsEditor,
  EducationEditor,
  ExperienceEditor,
  Field,
  LanguagesEditor,
  SkillsEditor,
} from "@/components/matchcv/editors";
import { resumeFromProfile, useMatchCV } from "@/lib/matchcv/store";
import type { Seniority, WorkMode } from "@/lib/matchcv/types";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Criar meu perfil — MatchCV" },
      {
        name: "description",
        content: "Monte seu perfil profissional em poucos minutos e comece a comparar vagas no MatchCV.",
      },
      { property: "og:title", content: "Criar meu perfil — MatchCV" },
      {
        property: "og:description",
        content: "Monte seu perfil profissional e descubra sua compatibilidade com as vagas.",
      },
    ],
  }),
  component: Onboarding,
});

const seniorities: Seniority[] = ["Estágio", "Júnior", "Pleno", "Sênior", "Especialista", "Liderança"];
const workModes: WorkMode[] = ["Presencial", "Híbrido", "Remoto", "Indiferente"];

const stepTitles: { title: string; description: string }[] = [
  { title: "Informações básicas", description: "Como as empresas podem te encontrar." },
  { title: "Objetivo profissional", description: "O que você procura na próxima oportunidade." },
  { title: "Experiência", description: "Sua trajetória profissional." },
  { title: "Formação", description: "Sua formação acadêmica e técnica." },
  { title: "Skills", description: "Competências, idiomas e certificações." },
];

function Onboarding() {
  const { state, setProfile, completeOnboarding, upsertResume, addActivity } = useMatchCV();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const p = state.profile;

  const set = (patch: Partial<typeof p>) => setProfile((prev) => ({ ...prev, ...patch }));

  const finish = () => {
    if (!p.fullName.trim()) {
      toast.error("Informe seu nome para continuar.");
      setStep(0);
      return;
    }
    completeOnboarding();
    if (state.resumes.length === 0) {
      upsertResume(resumeFromProfile(p));
      addActivity("resume", "Currículo Principal criado a partir do seu perfil");
    }
    addActivity("profile", "Perfil profissional criado");
    toast.success("Tudo pronto! Vamos encontrar sua próxima oportunidade.");
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            MatchCV
          </Link>
          <Button variant="ghost" size="sm" onClick={finish}>
            Pular por enquanto
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 space-y-2">
          <p className="text-sm text-muted-foreground">
            Etapa {step + 1} de {stepTitles.length}
          </p>
          <Progress value={((step + 1) / stepTitles.length) * 100} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{stepTitles[step]?.title}</CardTitle>
            <CardDescription>{stepTitles[step]?.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome completo" id="fullName">
                  <Input id="fullName" value={p.fullName} onChange={(e) => set({ fullName: e.target.value })} />
                </Field>
                <Field label="E-mail" id="email">
                  <Input id="email" type="email" value={p.email} onChange={(e) => set({ email: e.target.value })} />
                </Field>
                <Field label="Telefone" id="phone">
                  <Input id="phone" value={p.phone} onChange={(e) => set({ phone: e.target.value })} />
                </Field>
                <Field label="Cidade" id="city">
                  <Input id="city" value={p.city} onChange={(e) => set({ city: e.target.value })} />
                </Field>
                <Field label="Estado" id="stateField">
                  <Input id="stateField" value={p.state} onChange={(e) => set({ state: e.target.value })} />
                </Field>
                <Field label="País" id="country">
                  <Input id="country" value={p.country} onChange={(e) => set({ country: e.target.value })} />
                </Field>
                <Field label="LinkedIn" id="linkedin">
                  <Input id="linkedin" value={p.linkedinUrl} onChange={(e) => set({ linkedinUrl: e.target.value })} />
                </Field>
                <Field label="GitHub" id="github">
                  <Input id="github" value={p.githubUrl} onChange={(e) => set({ githubUrl: e.target.value })} />
                </Field>
                <Field label="Portfólio" id="portfolio">
                  <Input id="portfolio" value={p.portfolioUrl} onChange={(e) => set({ portfolioUrl: e.target.value })} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Cargo desejado" id="desiredRole">
                  <Input id="desiredRole" value={p.desiredRole} onChange={(e) => set({ desiredRole: e.target.value })} />
                </Field>
                <Field label="Área profissional" id="desiredArea">
                  <Input id="desiredArea" value={p.desiredArea} onChange={(e) => set({ desiredArea: e.target.value })} />
                </Field>
                <Field label="Nível de experiência" id="level">
                  <Select
                    value={p.experienceLevel}
                    onValueChange={(v) => set({ experienceLevel: v as Seniority })}
                  >
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {seniorities.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Localização desejada" id="desiredLocation">
                  <Input
                    id="desiredLocation"
                    value={p.desiredLocation}
                    onChange={(e) => set({ desiredLocation: e.target.value })}
                  />
                </Field>
                <Field label="Pretensão salarial" id="salary">
                  <Input
                    id="salary"
                    value={p.salaryExpectation}
                    onChange={(e) => set({ salaryExpectation: e.target.value })}
                  />
                </Field>
                <Field label="Tipo de contratação" id="contract">
                  <Select value={p.contractType} onValueChange={(v) => set({ contractType: v })}>
                    <SelectTrigger id="contract">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {["CLT", "PJ", "Estágio", "Temporário", "Freelancer", "Indiferente"].map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Modalidade" id="mode">
                  <Select
                    value={p.preferredWorkMode}
                    onValueChange={(v) => set({ preferredWorkMode: v as WorkMode })}
                  >
                    <SelectTrigger id="mode">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {workModes.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field
                    label="Resumo profissional"
                    id="summary"
                    hint="Descreva sua atuação em 2 ou 3 linhas. Usaremos no seu currículo."
                  >
                    <Textarea id="summary" rows={4} value={p.summary} onChange={(e) => set({ summary: e.target.value })} />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && <ExperienceEditor />}
            {step === 3 && <EducationEditor />}
            {step === 4 && (
              <div className="space-y-8">
                <section>
                  <h3 className="mb-3 text-sm font-semibold">Competências, ferramentas e tecnologias</h3>
                  <SkillsEditor />
                </section>
                <section>
                  <h3 className="mb-3 text-sm font-semibold">Idiomas</h3>
                  <LanguagesEditor />
                </section>
                <section>
                  <h3 className="mb-3 text-sm font-semibold">Certificações</h3>
                  <CertificationsEditor />
                </section>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="size-4" /> Voltar
          </Button>
          {step < stepTitles.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Continuar <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={finish}>
              <Check className="size-4" /> Concluir
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

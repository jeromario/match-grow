import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ProjectsEditor,
  SkillsEditor,
} from "@/components/matchcv/editors";
import { PageHeader, ProfileCompletion } from "@/components/matchcv/common";
import { profileCompletion, useMatchCV } from "@/lib/matchcv/store";
import type { Seniority, WorkMode } from "@/lib/matchcv/types";

export const Route = createFileRoute("/app/perfil")({
  component: ProfilePage,
});

const seniorities: Seniority[] = ["Estágio", "Júnior", "Pleno", "Sênior", "Especialista", "Liderança"];
const workModes: WorkMode[] = ["Presencial", "Híbrido", "Remoto", "Indiferente"];

function ProfilePage() {
  const { state, setProfile, addActivity } = useMatchCV();
  const p = state.profile;
  const set = (patch: Partial<typeof p>) => setProfile((prev) => ({ ...prev, ...patch }));

  return (
    <div>
      <PageHeader
        title="Meu Perfil"
        description="As informações salvas aqui alimentam seus currículos e o cálculo de compatibilidade."
        action={
          <Button
            onClick={() => {
              addActivity("profile", "Perfil atualizado");
              toast.success("Perfil salvo.");
            }}
          >
            Salvar alterações
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="p-5">
          <ProfileCompletion value={profileCompletion(p)} />
        </CardContent>
      </Card>

      <Tabs defaultValue="pessoais">
        <div className="overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="pessoais">Informações pessoais</TabsTrigger>
            <TabsTrigger value="objetivo">Objetivo</TabsTrigger>
            <TabsTrigger value="experiencia">Experiência</TabsTrigger>
            <TabsTrigger value="formacao">Formação</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="idiomas">Idiomas</TabsTrigger>
            <TabsTrigger value="certificacoes">Certificações</TabsTrigger>
            <TabsTrigger value="projetos">Projetos</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pessoais" className="mt-5">
          <Card>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Nome completo" id="p-name">
                <Input id="p-name" value={p.fullName} onChange={(e) => set({ fullName: e.target.value })} />
              </Field>
              <Field label="E-mail" id="p-email">
                <Input id="p-email" type="email" value={p.email} onChange={(e) => set({ email: e.target.value })} />
              </Field>
              <Field label="Telefone" id="p-phone">
                <Input id="p-phone" value={p.phone} onChange={(e) => set({ phone: e.target.value })} />
              </Field>
              <Field label="Cidade" id="p-city">
                <Input id="p-city" value={p.city} onChange={(e) => set({ city: e.target.value })} />
              </Field>
              <Field label="Estado" id="p-state">
                <Input id="p-state" value={p.state} onChange={(e) => set({ state: e.target.value })} />
              </Field>
              <Field label="País" id="p-country">
                <Input id="p-country" value={p.country} onChange={(e) => set({ country: e.target.value })} />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objetivo" className="mt-5">
          <Card>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Cargo desejado" id="p-role">
                <Input id="p-role" value={p.desiredRole} onChange={(e) => set({ desiredRole: e.target.value })} />
              </Field>
              <Field label="Área profissional" id="p-area">
                <Input id="p-area" value={p.desiredArea} onChange={(e) => set({ desiredArea: e.target.value })} />
              </Field>
              <Field label="Nível de experiência" id="p-level">
                <Select
                  value={p.experienceLevel || undefined}
                  onValueChange={(v) => set({ experienceLevel: v as Seniority })}
                >
                  <SelectTrigger id="p-level">
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
              <Field label="Modalidade preferida" id="p-mode">
                <Select
                  value={p.preferredWorkMode || undefined}
                  onValueChange={(v) => set({ preferredWorkMode: v as WorkMode })}
                >
                  <SelectTrigger id="p-mode">
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
              <Field label="Localização desejada" id="p-loc">
                <Input
                  id="p-loc"
                  value={p.desiredLocation}
                  onChange={(e) => set({ desiredLocation: e.target.value })}
                />
              </Field>
              <Field label="Pretensão salarial" id="p-salary">
                <Input
                  id="p-salary"
                  value={p.salaryExpectation}
                  onChange={(e) => set({ salaryExpectation: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Resumo profissional" id="p-summary">
                  <Textarea id="p-summary" rows={4} value={p.summary} onChange={(e) => set({ summary: e.target.value })} />
                </Field>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiencia" className="mt-5">
          <ExperienceEditor />
        </TabsContent>
        <TabsContent value="formacao" className="mt-5">
          <EducationEditor />
        </TabsContent>
        <TabsContent value="skills" className="mt-5">
          <Card>
            <CardContent className="p-5">
              <SkillsEditor />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="idiomas" className="mt-5">
          <Card>
            <CardContent className="p-5">
              <LanguagesEditor />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="certificacoes" className="mt-5">
          <Card>
            <CardContent className="p-5">
              <CertificationsEditor />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projetos" className="mt-5">
          <Card>
            <CardContent className="p-5">
              <ProjectsEditor />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="links" className="mt-5">
          <Card>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="LinkedIn" id="p-linkedin">
                <Input id="p-linkedin" value={p.linkedinUrl} onChange={(e) => set({ linkedinUrl: e.target.value })} />
              </Field>
              <Field label="GitHub" id="p-github">
                <Input id="p-github" value={p.githubUrl} onChange={(e) => set({ githubUrl: e.target.value })} />
              </Field>
              <Field label="Portfólio" id="p-portfolio">
                <Input id="p-portfolio" value={p.portfolioUrl} onChange={(e) => set({ portfolioUrl: e.target.value })} />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

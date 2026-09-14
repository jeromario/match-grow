import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/matchcv/editors";
import { PageHeader } from "@/components/matchcv/common";
import { uid, useMatchCV } from "@/lib/matchcv/store";
import { analyzeJob } from "@/lib/matchcv/services/ai";
import type { Job, Seniority, WorkMode } from "@/lib/matchcv/types";

export const Route = createFileRoute("/app/vagas/nova")({
  component: NewJobPage,
});

const emptyForm = {
  title: "",
  company: "",
  location: "",
  workMode: "Indiferente" as WorkMode,
  seniority: "Pleno" as Seniority,
  salary: "",
  url: "",
  area: "",
  description: "",
  requirements: "",
  niceToHave: "",
  benefits: "",
};

function NewJobPage() {
  const { upsertJob, addActivity } = useMatchCV();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [raw, setRaw] = useState("");
  const [reviewed, setReviewed] = useState(false);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const handleExtract = () => {
    if (raw.trim().length < 40) {
      toast.error("Cole um texto um pouco maior para conseguirmos identificar os dados.");
      return;
    }
    const analysis = analyzeJob(raw);
    setForm((f) => ({
      ...f,
      title: analysis.title || f.title,
      company: analysis.company || f.company,
      location: analysis.location || f.location,
      workMode: analysis.workMode,
      seniority: analysis.seniority,
      salary: analysis.salary || f.salary,
      description: analysis.description,
      requirements: analysis.requirements || analysis.skills.join(", "),
      niceToHave: analysis.niceToHave || f.niceToHave,
    }));
    setReviewed(true);
    toast.success("Identificamos os dados da vaga. Revise antes de salvar.");
  };

  const save = () => {
    if (!form.title.trim() || !form.company.trim()) {
      toast.error("Informe ao menos o cargo e a empresa.");
      return;
    }
    const now = new Date().toISOString();
    const job: Job = { id: uid(), ...form, createdAt: now, publishedAt: now };
    upsertJob(job);
    addActivity("job", `Vaga adicionada: ${job.title} — ${job.company}`);
    toast.success("Vaga salva.");
    navigate({ to: "/app/vagas/$jobId", params: { jobId: job.id } });
  };

  const fields = (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Título" id="j-title">
        <Input id="j-title" value={form.title} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Empresa" id="j-company">
        <Input id="j-company" value={form.company} onChange={(e) => set({ company: e.target.value })} />
      </Field>
      <Field label="Localização" id="j-loc">
        <Input id="j-loc" value={form.location} onChange={(e) => set({ location: e.target.value })} />
      </Field>
      <Field label="Área" id="j-area">
        <Input id="j-area" value={form.area} onChange={(e) => set({ area: e.target.value })} />
      </Field>
      <Field label="Modalidade" id="j-mode">
        <Select value={form.workMode} onValueChange={(v) => set({ workMode: v as WorkMode })}>
          <SelectTrigger id="j-mode">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Presencial", "Híbrido", "Remoto", "Indiferente"].map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Senioridade" id="j-sen">
        <Select value={form.seniority} onValueChange={(v) => set({ seniority: v as Seniority })}>
          <SelectTrigger id="j-sen">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Estágio", "Júnior", "Pleno", "Sênior", "Especialista", "Liderança"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Salário" id="j-salary">
        <Input id="j-salary" value={form.salary} onChange={(e) => set({ salary: e.target.value })} />
      </Field>
      <Field label="URL da vaga" id="j-url">
        <Input id="j-url" value={form.url} onChange={(e) => set({ url: e.target.value })} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Descrição completa" id="j-desc">
          <Textarea id="j-desc" rows={6} value={form.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Requisitos" id="j-req" hint="Separe por vírgula ou por linha.">
          <Textarea id="j-req" rows={4} value={form.requirements} onChange={(e) => set({ requirements: e.target.value })} />
        </Field>
      </div>
      <Field label="Diferenciais" id="j-nice">
        <Textarea id="j-nice" rows={3} value={form.niceToHave} onChange={(e) => set({ niceToHave: e.target.value })} />
      </Field>
      <Field label="Benefícios" id="j-benefits">
        <Textarea id="j-benefits" rows={3} value={form.benefits} onChange={(e) => set({ benefits: e.target.value })} />
      </Field>
    </div>
  );

  return (
    <div>
      <PageHeader title="Adicionar vaga" description="Preencha os campos ou cole a descrição completa da vaga." />

      <Tabs defaultValue="colar">
        <TabsList>
          <TabsTrigger value="colar">Colar descrição</TabsTrigger>
          <TabsTrigger value="manual">Preencher manualmente</TabsTrigger>
        </TabsList>

        <TabsContent value="colar" className="mt-5 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cole o texto da vaga</CardTitle>
              <CardDescription>
                Identificamos cargo, empresa, senioridade, modalidade, localização e requisitos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                aria-label="Descrição da vaga"
                rows={10}
                placeholder="Cole aqui a descrição da vaga..."
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
              />
              <Button onClick={handleExtract}>
                <Wand2 className="size-4" /> Identificar informações
              </Button>
            </CardContent>
          </Card>

          {reviewed && (
            <>
              <Alert>
                <Sparkles className="size-4" />
                <AlertDescription>
                  Revise as informações encontradas. Nada é salvo até você confirmar.
                </AlertDescription>
              </Alert>
              <Card>
                <CardContent className="p-5">{fields}</CardContent>
              </Card>
              <Button onClick={save}>Salvar vaga</Button>
            </>
          )}
        </TabsContent>

        <TabsContent value="manual" className="mt-5 space-y-5">
          <Card>
            <CardContent className="p-5">{fields}</CardContent>
          </Card>
          <Button onClick={save}>Salvar vaga</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

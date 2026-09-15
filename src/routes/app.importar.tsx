import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FileUp, Info } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/matchcv/editors";
import { PageHeader } from "@/components/matchcv/common";
import { resumeFromProfile, useMatchCV } from "@/lib/matchcv/store";

export const Route = createFileRoute("/app/importar")({
  component: ImportResumePage,
});

/** Extração simples a partir de texto colado. PDF/DOCX são aceitos e o texto é
 *  solicitado ao usuário para revisão — a extração automática do arquivo será
 *  ligada quando o serviço de leitura de documentos estiver disponível. */
function extractFromText(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0] ?? "";
  const phone = text.match(/(\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/)?.[0] ?? "";
  const linkedin = text.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s]+/)?.[0] ?? "";
  const github = text.match(/https?:\/\/(www\.)?github\.com\/[^\s]+/)?.[0] ?? "";
  const firstLine = lines[0] ?? "";
  const fullName = firstLine.length < 60 ? firstLine : "";
  const summaryIndex = lines.findIndex((l) => /resumo|objetivo|sobre mim/i.test(l));
  const summary = summaryIndex >= 0 ? lines.slice(summaryIndex + 1, summaryIndex + 5).join(" ") : "";
  return { fullName, email, phone, linkedin, github, summary };
}

function ImportResumePage() {
  const { state, setProfile, upsertResume, addActivity } = useMatchCV();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [review, setReview] = useState<ReturnType<typeof extractFromText> | null>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    if (file.type === "text/plain") {
      const content = await file.text();
      setText(content);
      toast.success("Arquivo lido. Revise o conteúdo abaixo.");
      return;
    }
    toast.info("Cole abaixo o texto do seu currículo para revisarmos as informações.");
  };

  const confirm = () => {
    if (!review) return;
    setProfile((p) => ({
      ...p,
      fullName: review.fullName || p.fullName,
      email: review.email || p.email,
      phone: review.phone || p.phone,
      linkedinUrl: review.linkedin || p.linkedinUrl,
      githubUrl: review.github || p.githubUrl,
      summary: review.summary || p.summary,
    }));
    addActivity("profile", "Informações importadas do currículo enviado");
    if (state.resumes.length === 0) {
      upsertResume(resumeFromProfile({ ...state.profile, ...review, linkedinUrl: review.linkedin }));
    }
    toast.success("Informações confirmadas e salvas.");
    navigate({ to: "/app/perfil" });
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Importar currículo"
        description="Envie seu currículo em PDF, DOCX ou TXT e revise as informações antes de salvar."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Enviar arquivo</CardTitle>
          <CardDescription>Nada é salvo automaticamente: você confirma tudo antes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label
            htmlFor="resume-file"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center hover:bg-muted/50"
          >
            <FileUp className="size-6 text-primary" />
            <span className="text-sm font-medium">{fileName || "Selecionar arquivo (PDF, DOCX ou TXT)"}</span>
            <span className="text-xs text-muted-foreground">Tamanho máximo recomendado: 5 MB</span>
          </label>
          <Input
            id="resume-file"
            type="file"
            accept=".pdf,.docx,.txt"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />

          <Alert>
            <Info className="size-4" />
            <AlertDescription>
              Para PDF e DOCX, cole o texto do currículo no campo abaixo enquanto a leitura automática de
              arquivos não está ativa.
            </AlertDescription>
          </Alert>

          <Textarea
            aria-label="Texto do currículo"
            rows={10}
            placeholder="Cole aqui o conteúdo do seu currículo..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            onClick={() => {
              if (text.trim().length < 30) {
                toast.error("Cole um texto um pouco maior para identificarmos suas informações.");
                return;
              }
              setReview(extractFromText(text));
            }}
          >
            Revisar informações encontradas
          </Button>
        </CardContent>
      </Card>

      {review && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revise as informações encontradas</CardTitle>
            <CardDescription>Corrija o que for necessário. Só salvamos após sua confirmação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" id="i-name">
                <Input id="i-name" value={review.fullName} onChange={(e) => setReview({ ...review, fullName: e.target.value })} />
              </Field>
              <Field label="E-mail" id="i-email">
                <Input id="i-email" value={review.email} onChange={(e) => setReview({ ...review, email: e.target.value })} />
              </Field>
              <Field label="Telefone" id="i-phone">
                <Input id="i-phone" value={review.phone} onChange={(e) => setReview({ ...review, phone: e.target.value })} />
              </Field>
              <Field label="LinkedIn" id="i-linkedin">
                <Input id="i-linkedin" value={review.linkedin} onChange={(e) => setReview({ ...review, linkedin: e.target.value })} />
              </Field>
              <Field label="GitHub" id="i-github">
                <Input id="i-github" value={review.github} onChange={(e) => setReview({ ...review, github: e.target.value })} />
              </Field>
            </div>
            <Field label="Resumo profissional" id="i-summary">
              <Textarea id="i-summary" rows={4} value={review.summary} onChange={(e) => setReview({ ...review, summary: e.target.value })} />
            </Field>
            <Button onClick={confirm}>Confirmar e salvar</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

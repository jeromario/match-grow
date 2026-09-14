import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, FileText, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmptyState, PageHeader } from "@/components/matchcv/common";
import { resumeFromProfile, uid, useMatchCV } from "@/lib/matchcv/store";

export const Route = createFileRoute("/app/curriculos/")({
  component: ResumesPage,
});

function ResumesPage() {
  const { state, upsertResume, removeResume, addActivity } = useMatchCV();
  const navigate = useNavigate();

  const createBase = () => {
    const resume = resumeFromProfile(
      state.profile,
      state.resumes.length === 0 ? "Currículo Principal" : `Currículo ${state.resumes.length + 1}`,
    );
    upsertResume(resume);
    addActivity("resume", `Currículo criado: ${resume.name}`);
    navigate({ to: "/app/curriculos/$resumeId", params: { resumeId: resume.id } });
  };

  return (
    <div>
      <PageHeader
        title="Meus Currículos"
        description="Mantenha um currículo principal e gere versões específicas para cada vaga."
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/app/importar">
                <Upload className="size-4" /> Já tenho um currículo
              </Link>
            </Button>
            <Button onClick={createBase}>
              <Plus className="size-4" /> Criar currículo
            </Button>
          </div>
        }
      />

      {state.resumes.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-6" />}
          title="Você ainda não possui currículos"
          description="Crie seu currículo principal a partir do seu perfil — ele será a base das versões personalizadas."
          actionLabel="Criar currículo"
          onAction={createBase}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.resumes.map((resume) => {
            const job = state.jobs.find((j) => j.id === resume.jobId);
            return (
              <Card key={resume.id} className="flex h-full flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-snug">{resume.name}</h3>
                    <Badge variant="secondary">{resume.type === "base" ? "Base" : "Personalizado"}</Badge>
                  </div>
                  {job && <p className="text-xs text-muted-foreground">Para: {job.company}</p>}
                  <p className="text-xs text-muted-foreground">
                    Atualizado em {new Date(resume.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                  {typeof resume.atsScore === "number" && (
                    <p className="text-sm">
                      Pontuação ATS: <span className="font-semibold">{resume.atsScore}/100</span>
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link to="/app/curriculos/$resumeId" params={{ resumeId: resume.id }}>
                        Abrir
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label="Duplicar currículo"
                      onClick={() => {
                        const now = new Date().toISOString();
                        upsertResume({
                          ...resume,
                          id: uid(),
                          name: `${resume.name} (cópia)`,
                          createdAt: now,
                          updatedAt: now,
                        });
                        toast.success("Currículo duplicado.");
                      }}
                    >
                      <Copy className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" aria-label="Excluir currículo">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir este currículo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. As outras versões continuam disponíveis.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              removeResume(resume.id);
                              toast.success("Currículo excluído.");
                            }}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/matchcv/editors";
import { PageHeader } from "@/components/matchcv/common";
import { useMatchCV } from "@/lib/matchcv/store";
import type { WorkMode } from "@/lib/matchcv/types";

export const Route = createFileRoute("/app/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  const { state, setProfile, resetAll } = useMatchCV();
  const navigate = useNavigate();
  const p = state.profile;
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="max-w-3xl">
      <PageHeader title="Configurações" description="Ajuste suas preferências de busca e de aparência." />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferências profissionais</CardTitle>
            <CardDescription>Usamos essas informações no cálculo de compatibilidade.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Cargo desejado" id="s-role">
              <Input
                id="s-role"
                value={p.desiredRole}
                onChange={(e) => setProfile((prev) => ({ ...prev, desiredRole: e.target.value }))}
              />
            </Field>
            <Field label="Localização desejada" id="s-loc">
              <Input
                id="s-loc"
                value={p.desiredLocation}
                onChange={(e) => setProfile((prev) => ({ ...prev, desiredLocation: e.target.value }))}
              />
            </Field>
            <Field label="Modalidade" id="s-mode">
              <Select
                value={p.preferredWorkMode}
                onValueChange={(v) => setProfile((prev) => ({ ...prev, preferredWorkMode: v as WorkMode }))}
              >
                <SelectTrigger id="s-mode">
                  <SelectValue placeholder="Selecione" />
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
            <Field label="Pretensão salarial" id="s-salary">
              <Input
                id="s-salary"
                value={p.salaryExpectation}
                onChange={(e) => setProfile((prev) => ({ ...prev, salaryExpectation: e.target.value }))}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aparência</CardTitle>
            <CardDescription>O tema claro é o padrão do MatchCV.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Label htmlFor="theme">Tema escuro</Label>
            <Switch id="theme" checked={dark} onCheckedChange={setDark} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Privacidade dos dados</CardTitle>
            <CardDescription>
              Suas informações ficam salvas apenas neste navegador e não são compartilhadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive">
                  Apagar todos os meus dados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apagar tudo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Perfil, currículos, vagas adicionadas, análises e candidaturas serão removidos deste
                    navegador. Essa ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      resetAll();
                      toast.success("Dados apagados.");
                      navigate({ to: "/" });
                    }}
                  >
                    Apagar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Info, X } from "lucide-react";
import type { ApplicationStatus } from "@/lib/matchcv/types";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-14 text-center">
        {icon && <div className="text-primary">{icon}</div>}
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="mt-2">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function LoadingState({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="space-y-4" aria-live="polite">
      <Progress value={((current + 1) / steps.length) * 100} />
      <p className="text-sm font-medium text-muted-foreground">{steps[Math.min(current, steps.length - 1)]}</p>
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

export function DashboardCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function SkillBadge({
  name,
  present,
}: {
  name: string;
  present?: boolean;
}) {
  if (present === undefined) return <Badge variant="secondary">{name}</Badge>;
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-normal",
        present
          ? "border-success/40 bg-success/10 text-foreground"
          : "border-accent/60 bg-accent-soft text-accent-foreground",
      )}
    >
      {present ? <Check className="size-3" /> : <X className="size-3" />}
      {name}
    </Badge>
  );
}

export function KeywordList({
  found,
  missing,
}: {
  found: string[];
  missing: string[];
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="mb-2 text-sm font-medium">Encontradas no seu perfil</h4>
        <div className="flex flex-wrap gap-2">
          {found.length ? (
            found.map((k) => <SkillBadge key={k} name={k} present />)
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma palavra-chave identificada ainda.</p>
          )}
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium">Ausentes</h4>
        <div className="flex flex-wrap gap-2">
          {missing.length ? (
            missing.map((k) => <SkillBadge key={k} name={k} present={false} />)
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma lacuna relevante.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ATSLabel() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex cursor-help items-center gap-1 underline decoration-dotted underline-offset-4">
          ATS <Info className="size-3.5" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        ATS significa Applicant Tracking System, sistema utilizado por empresas para filtrar e
        organizar currículos automaticamente.
      </TooltipContent>
    </Tooltip>
  );
}

const statusStyles: Record<ApplicationStatus, string> = {
  Interessado: "bg-secondary text-secondary-foreground",
  Aplicar: "bg-accent-soft text-accent-foreground",
  Aplicado: "bg-primary-soft text-foreground",
  Entrevista: "bg-accent text-accent-foreground",
  Oferta: "bg-success/15 text-foreground",
  Rejeitado: "bg-destructive/10 text-foreground",
  Encerrado: "bg-muted text-muted-foreground",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge className={cn("border-0 font-medium", statusStyles[status])}>{status}</Badge>;
}

export function ProfileCompletion({ value }: { value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Perfil {value}% completo</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import type { MatchBreakdownData } from "@/lib/matchcv/types";
import { cn } from "@/lib/utils";

export function matchTone(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-accent-foreground";
  return "text-muted-foreground";
}

export function MatchScore({
  score,
  size = "md",
  withHint = false,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  withHint?: boolean;
}) {
  const sizes = {
    sm: "size-14 text-sm",
    md: "size-20 text-lg",
    lg: "size-28 text-2xl",
  } as const;

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full font-semibold",
          sizes[size],
        )}
        style={{
          background: `conic-gradient(var(--primary) ${score * 3.6}deg, var(--muted) 0deg)`,
        }}
        role="img"
        aria-label={`Compatibilidade de ${score} por cento`}
      >
        <span className="flex size-[78%] items-center justify-center rounded-full bg-card">
          {score}%
        </span>
      </div>
      {withHint && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" aria-label="O que significa o Match Score" className="text-muted-foreground">
              <Info className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            Este percentual representa o quanto seu perfil está alinhado aos requisitos identificados
            nesta vaga.
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

const labels: Record<keyof MatchBreakdownData, string> = {
  skills: "Skills",
  experience: "Experiência",
  education: "Formação",
  seniority: "Senioridade",
  location: "Localização",
  keywords: "Palavras-chave",
};

export function MatchBreakdown({ breakdown }: { breakdown: MatchBreakdownData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(Object.keys(labels) as (keyof MatchBreakdownData)[]).map((key) => (
        <div key={key} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{labels[key]}</span>
            <span className="font-medium">{breakdown[key]}%</span>
          </div>
          <Progress value={breakdown[key]} />
        </div>
      ))}
    </div>
  );
}

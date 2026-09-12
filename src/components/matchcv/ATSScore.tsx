import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { ATSAnalysis, ATSIssueItem } from "@/lib/matchcv/services/ai";
import { ATSLabel } from "./common";

export function ATSScore({ analysis }: { analysis: ATSAnalysis }) {
  const message =
    analysis.score >= 85
      ? "Seu currículo está bem estruturado para sistemas de triagem."
      : analysis.score >= 65
        ? "Seu currículo está no caminho certo, mas há pontos a melhorar."
        : "Alguns ajustes importantes podem aumentar suas chances na triagem automática.";

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <p className="text-sm text-muted-foreground">
          Pontuação <ATSLabel />
        </p>
        <p className="text-2xl font-semibold">{analysis.score}/100</p>
      </div>
      <Progress value={analysis.score} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function ATSIssue({ issue }: { issue: ATSIssueItem }) {
  const Icon =
    issue.severity === "ok" ? CheckCircle2 : issue.severity === "atencao" ? AlertTriangle : XCircle;
  const color =
    issue.severity === "ok"
      ? "text-success"
      : issue.severity === "atencao"
        ? "text-accent-foreground"
        : "text-destructive";

  return (
    <li className="flex gap-3 rounded-lg border p-3">
      <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
      <div>
        <p className="text-sm font-medium">{issue.title}</p>
        <p className="text-sm text-muted-foreground">{issue.detail}</p>
      </div>
    </li>
  );
}

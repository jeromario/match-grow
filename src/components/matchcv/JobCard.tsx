import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Building2, MapPin, Wallet } from "lucide-react";
import type { Job, MatchResult } from "@/lib/matchcv/types";
import { SkillBadge } from "./common";

export function JobCard({ job, match }: { job: Job; match?: MatchResult }) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{job.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="size-3.5 shrink-0" />
              <span className="truncate">{job.company}</span>
            </p>
          </div>
          {match && (
            <div className="shrink-0 rounded-lg bg-primary-soft px-2.5 py-1 text-sm font-semibold">
              {match.score}%
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pb-3">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <Badge variant="secondary">{job.workMode}</Badge>
          <Badge variant="secondary">{job.seniority}</Badge>
          {job.isDemo && <Badge className="border-0 bg-accent-soft text-accent-foreground">Demonstração</Badge>}
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> {job.location || "Não informado"}
          </p>
          {job.salary && (
            <p className="flex items-center gap-1.5">
              <Wallet className="size-3.5" /> {job.salary}
            </p>
          )}
        </div>
        {match && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {match.matchedSkills.slice(0, 4).map((s) => (
                <SkillBadge key={s} name={s} present />
              ))}
              {match.missingSkills.slice(0, 2).map((s) => (
                <SkillBadge key={s} name={s} present={false} />
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Button asChild className="w-full">
          <Link to="/app/vagas/$jobId" params={{ jobId: job.id }}>
            {match ? "Ver vaga" : "Analisar vaga"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

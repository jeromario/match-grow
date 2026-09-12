import type { Profile, ResumeContent } from "@/lib/matchcv/types";
import { cn } from "@/lib/utils";

function period(start: string, end: string, current: boolean) {
  const fmt = (v: string) => {
    if (!v) return "";
    const [y, m] = v.split("-");
    return m ? `${m}/${y}` : y;
  };
  const s = fmt(start);
  const e = current ? "Atual" : fmt(end);
  return [s, e].filter(Boolean).join(" — ");
}

export function ResumePreview({
  profile,
  content,
  ats = false,
  className,
}: {
  profile: Profile;
  content: ResumeContent;
  ats?: boolean;
  className?: string;
}) {
  const contact = [
    profile.email,
    profile.phone,
    [profile.city, profile.state].filter(Boolean).join(", "),
    profile.linkedinUrl,
    profile.githubUrl,
    profile.portfolioUrl,
  ].filter(Boolean);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mt-5">
      <h2
        className={cn(
          "mb-2 text-[11px] font-semibold uppercase tracking-widest",
          ats ? "text-foreground" : "border-b border-border pb-1 text-primary",
        )}
      >
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <div
      className={cn(
        "print-area mx-auto w-full max-w-[820px] bg-card p-8 text-[13px] leading-relaxed text-foreground",
        !ats && "rounded-xl border shadow-sm",
        className,
      )}
    >
      <header className={cn(!ats && "border-b border-border pb-4")}>
        <h1 className="text-xl font-bold">{profile.fullName || "Seu nome"}</h1>
        {content.headline && <p className="text-sm text-muted-foreground">{content.headline}</p>}
        {contact.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">{contact.join(ats ? " | " : " • ")}</p>
        )}
      </header>

      {content.summary && (
        <Section title="Resumo profissional">
          <p className="whitespace-pre-line">{content.summary}</p>
        </Section>
      )}

      {content.experiences.length > 0 && (
        <Section title="Experiência profissional">
          <div className="space-y-4">
            {content.experiences.map((e) => (
              <div key={e.id}>
                <p className="font-semibold">{e.position}</p>
                <p className="text-xs text-muted-foreground">
                  {[e.company, period(e.startDate, e.endDate, e.isCurrent)].filter(Boolean).join(" • ")}
                </p>
                {e.description && <p className="mt-1 whitespace-pre-line">{e.description}</p>}
                {e.achievements && <p className="mt-1 whitespace-pre-line">{e.achievements}</p>}
                {e.technologies && (
                  <p className="mt-1 text-xs text-muted-foreground">Tecnologias: {e.technologies}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {content.education.length > 0 && (
        <Section title="Formação">
          <div className="space-y-2">
            {content.education.map((ed) => (
              <div key={ed.id}>
                <p className="font-semibold">
                  {ed.course}
                  {ed.degree ? ` — ${ed.degree}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {[ed.institution, period(ed.startDate, ed.endDate, ed.isCurrent)].filter(Boolean).join(" • ")}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {content.skills.length > 0 && (
        <Section title="Competências">
          <p>{content.skills.map((s) => s.name).join(ats ? ", " : " • ")}</p>
        </Section>
      )}

      {content.projects.length > 0 && (
        <Section title="Projetos">
          <div className="space-y-2">
            {content.projects.map((p) => (
              <div key={p.id}>
                <p className="font-semibold">{p.name}</p>
                {p.description && <p>{p.description}</p>}
                {p.technologies && (
                  <p className="text-xs text-muted-foreground">Tecnologias: {p.technologies}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {content.languages.length > 0 && (
        <Section title="Idiomas">
          <p>{content.languages.map((l) => `${l.language} — ${l.level}`).join(ats ? ", " : " • ")}</p>
        </Section>
      )}

      {content.certifications.length > 0 && (
        <Section title="Certificações">
          <ul className="list-none space-y-1">
            {content.certifications.map((c) => (
              <li key={c.id}>
                {[c.name, c.institution, c.issueDate].filter(Boolean).join(" — ")}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

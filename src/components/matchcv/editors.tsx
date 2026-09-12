import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uid, useMatchCV } from "@/lib/matchcv/store";
import type { Skill, SkillType } from "@/lib/matchcv/types";

export function Field({
  label,
  id,
  children,
  hint,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ExperienceEditor() {
  const { state, setProfile } = useMatchCV();
  const items = state.profile.experiences;

  const update = (id: string, patch: Partial<(typeof items)[number]>) =>
    setProfile((p) => ({
      ...p,
      experiences: p.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));

  return (
    <div className="space-y-4">
      {items.map((exp) => (
        <Card key={exp.id}>
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Empresa" id={`company-${exp.id}`}>
                <Input
                  id={`company-${exp.id}`}
                  value={exp.company}
                  onChange={(e) => update(exp.id, { company: e.target.value })}
                />
              </Field>
              <Field label="Cargo" id={`position-${exp.id}`}>
                <Input
                  id={`position-${exp.id}`}
                  value={exp.position}
                  onChange={(e) => update(exp.id, { position: e.target.value })}
                />
              </Field>
              <Field label="Data inicial" id={`start-${exp.id}`}>
                <Input
                  id={`start-${exp.id}`}
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => update(exp.id, { startDate: e.target.value })}
                />
              </Field>
              <Field label="Data final" id={`end-${exp.id}`}>
                <Input
                  id={`end-${exp.id}`}
                  type="month"
                  value={exp.endDate}
                  disabled={exp.isCurrent}
                  onChange={(e) => update(exp.id, { endDate: e.target.value })}
                />
              </Field>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`current-${exp.id}`}
                checked={exp.isCurrent}
                onCheckedChange={(v) => update(exp.id, { isCurrent: v === true })}
              />
              <Label htmlFor={`current-${exp.id}`} className="font-normal">
                Emprego atual
              </Label>
            </div>
            <Field label="Descrição das atividades" id={`desc-${exp.id}`}>
              <Textarea
                id={`desc-${exp.id}`}
                rows={3}
                value={exp.description}
                onChange={(e) => update(exp.id, { description: e.target.value })}
              />
            </Field>
            <Field label="Realizações" id={`ach-${exp.id}`} hint="Descreva apenas resultados reais.">
              <Textarea
                id={`ach-${exp.id}`}
                rows={2}
                value={exp.achievements}
                onChange={(e) => update(exp.id, { achievements: e.target.value })}
              />
            </Field>
            <Field label="Tecnologias" id={`tech-${exp.id}`} hint="Separe por vírgula.">
              <Input
                id={`tech-${exp.id}`}
                value={exp.technologies}
                onChange={(e) => update(exp.id, { technologies: e.target.value })}
              />
            </Field>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() =>
                setProfile((p) => ({ ...p, experiences: p.experiences.filter((e) => e.id !== exp.id) }))
              }
            >
              <Trash2 className="size-4" /> Remover experiência
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outline"
        onClick={() =>
          setProfile((p) => ({
            ...p,
            experiences: [
              ...p.experiences,
              {
                id: uid(),
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
                description: "",
                achievements: "",
                technologies: "",
              },
            ],
          }))
        }
      >
        <Plus className="size-4" /> Adicionar experiência
      </Button>
    </div>
  );
}

export function EducationEditor() {
  const { state, setProfile } = useMatchCV();
  const items = state.profile.education;

  const update = (id: string, patch: Partial<(typeof items)[number]>) =>
    setProfile((p) => ({
      ...p,
      education: p.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));

  return (
    <div className="space-y-4">
      {items.map((ed) => (
        <Card key={ed.id}>
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Instituição" id={`inst-${ed.id}`}>
                <Input
                  id={`inst-${ed.id}`}
                  value={ed.institution}
                  onChange={(e) => update(ed.id, { institution: e.target.value })}
                />
              </Field>
              <Field label="Curso" id={`course-${ed.id}`}>
                <Input
                  id={`course-${ed.id}`}
                  value={ed.course}
                  onChange={(e) => update(ed.id, { course: e.target.value })}
                />
              </Field>
              <Field label="Grau" id={`degree-${ed.id}`} hint="Ex.: Tecnólogo, Bacharelado, Técnico.">
                <Input
                  id={`degree-${ed.id}`}
                  value={ed.degree}
                  onChange={(e) => update(ed.id, { degree: e.target.value })}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Início" id={`edstart-${ed.id}`}>
                  <Input
                    id={`edstart-${ed.id}`}
                    type="month"
                    value={ed.startDate}
                    onChange={(e) => update(ed.id, { startDate: e.target.value })}
                  />
                </Field>
                <Field label="Fim" id={`edend-${ed.id}`}>
                  <Input
                    id={`edend-${ed.id}`}
                    type="month"
                    value={ed.endDate}
                    disabled={ed.isCurrent}
                    onChange={(e) => update(ed.id, { endDate: e.target.value })}
                  />
                </Field>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id={`edcurrent-${ed.id}`}
                checked={ed.isCurrent}
                onCheckedChange={(v) => update(ed.id, { isCurrent: v === true })}
              />
              <Label htmlFor={`edcurrent-${ed.id}`} className="font-normal">
                Em andamento
              </Label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() =>
                setProfile((p) => ({ ...p, education: p.education.filter((e) => e.id !== ed.id) }))
              }
            >
              <Trash2 className="size-4" /> Remover formação
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="outline"
        onClick={() =>
          setProfile((p) => ({
            ...p,
            education: [
              ...p.education,
              {
                id: uid(),
                institution: "",
                course: "",
                degree: "",
                startDate: "",
                endDate: "",
                isCurrent: false,
              },
            ],
          }))
        }
      >
        <Plus className="size-4" /> Adicionar formação
      </Button>
    </div>
  );
}

const skillTypeLabels: Record<SkillType, string> = {
  hard: "Hard skill",
  soft: "Soft skill",
  tool: "Ferramenta",
  tech: "Tecnologia",
};

export function SkillsEditor() {
  const { state, setProfile } = useMatchCV();
  const [name, setName] = useState("");
  const [type, setType] = useState<SkillType>("hard");

  const add = () => {
    const value = name.trim();
    if (!value) return;
    const skill: Skill = { id: uid(), name: value, type, level: "" };
    setProfile((p) => ({ ...p, skills: [...p.skills, skill] }));
    setName("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="skill-name" className="sr-only">
            Competência
          </Label>
          <Input
            id="skill-name"
            placeholder="Ex.: Python, comunicação, Figma..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as SkillType)}>
          <SelectTrigger className="sm:w-48" aria-label="Tipo de competência">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(skillTypeLabels) as SkillType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {skillTypeLabels[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={add}>
          <Plus className="size-4" /> Adicionar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {state.profile.skills.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhuma competência adicionada ainda.</p>
        )}
        {state.profile.skills.map((s) => (
          <Badge key={s.id} variant="secondary" className="gap-1 py-1 pl-3 pr-1 font-normal">
            {s.name}
            <button
              type="button"
              aria-label={`Remover ${s.name}`}
              className="rounded-full p-1 hover:bg-background"
              onClick={() => setProfile((p) => ({ ...p, skills: p.skills.filter((x) => x.id !== s.id) }))}
            >
              <Trash2 className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function LanguagesEditor() {
  const { state, setProfile } = useMatchCV();
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("Intermediário");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          aria-label="Idioma"
          placeholder="Idioma"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="sm:w-52" aria-label="Nível do idioma">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Básico", "Intermediário", "Avançado", "Fluente", "Nativo"].map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            if (!language.trim()) return;
            setProfile((p) => ({
              ...p,
              languages: [...p.languages, { id: uid(), language: language.trim(), level }],
            }));
            setLanguage("");
          }}
        >
          <Plus className="size-4" /> Adicionar
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {state.profile.languages.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum idioma adicionado.</p>
        )}
        {state.profile.languages.map((l) => (
          <Badge key={l.id} variant="secondary" className="gap-1 py-1 pl-3 pr-1 font-normal">
            {l.language} — {l.level}
            <button
              type="button"
              aria-label={`Remover ${l.language}`}
              className="rounded-full p-1 hover:bg-background"
              onClick={() =>
                setProfile((p) => ({ ...p, languages: p.languages.filter((x) => x.id !== l.id) }))
              }
            >
              <Trash2 className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function CertificationsEditor() {
  const { state, setProfile } = useMatchCV();
  const [form, setForm] = useState({ name: "", institution: "", issueDate: "" });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          aria-label="Certificação"
          placeholder="Certificação"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          aria-label="Instituição"
          placeholder="Instituição"
          value={form.institution}
          onChange={(e) => setForm({ ...form, institution: e.target.value })}
        />
        <Input
          aria-label="Data de emissão"
          type="month"
          value={form.issueDate}
          onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
        />
      </div>
      <Button
        variant="outline"
        onClick={() => {
          if (!form.name.trim()) return;
          setProfile((p) => ({ ...p, certifications: [...p.certifications, { id: uid(), ...form }] }));
          setForm({ name: "", institution: "", issueDate: "" });
        }}
      >
        <Plus className="size-4" /> Adicionar certificação
      </Button>
      <ul className="space-y-2">
        {state.profile.certifications.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <span>{[c.name, c.institution, c.issueDate].filter(Boolean).join(" — ")}</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remover ${c.name}`}
              onClick={() =>
                setProfile((p) => ({
                  ...p,
                  certifications: p.certifications.filter((x) => x.id !== c.id),
                }))
              }
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectsEditor() {
  const { state, setProfile } = useMatchCV();
  const [form, setForm] = useState({ name: "", description: "", technologies: "", url: "" });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          aria-label="Nome do projeto"
          placeholder="Nome do projeto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          aria-label="Tecnologias"
          placeholder="Tecnologias"
          value={form.technologies}
          onChange={(e) => setForm({ ...form, technologies: e.target.value })}
        />
      </div>
      <Textarea
        aria-label="Descrição do projeto"
        placeholder="Descrição"
        rows={2}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Button
        variant="outline"
        onClick={() => {
          if (!form.name.trim()) return;
          setProfile((p) => ({ ...p, projects: [...p.projects, { id: uid(), ...form }] }));
          setForm({ name: "", description: "", technologies: "", url: "" });
        }}
      >
        <Plus className="size-4" /> Adicionar projeto
      </Button>
      <ul className="space-y-2">
        {state.profile.projects.map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
            <span>{p.name}</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remover ${p.name}`}
              onClick={() =>
                setProfile((prev) => ({ ...prev, projects: prev.projects.filter((x) => x.id !== p.id) }))
              }
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

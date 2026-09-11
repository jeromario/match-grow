/**
 * Camada de serviço de "inteligência" do MatchCV.
 *
 * Todas as operações de análise passam por aqui. Hoje utilizam heurísticas
 * determinísticas locais (mock claramente identificado). Quando um provedor de
 * IA estiver configurado, basta trocar a implementação interna destas funções
 * mantendo as mesmas assinaturas — nenhum componente visual precisa mudar.
 */
import type {
  Job,
  MatchResult,
  Profile,
  Resume,
  ResumeContent,
  Seniority,
  WorkMode,
} from "../types";

const STOP_WORDS = new Set([
  "de","da","do","das","dos","e","em","para","com","por","um","uma","os","as","a","o","no","na",
  "nos","nas","que","ao","à","aos","às","se","ou","como","sobre","the","and","of","to","in","are",
  "will","você","nossa","nosso","seu","sua","ser","será","mais","menos","também","entre","pela",
  "pelo","experiência","conhecimento","desejável","requisitos","atividades","vaga","empresa",
]);

const KNOWN_SKILLS = [
  "python","django","fastapi","flask","java","spring boot","spring","kotlin","javascript",
  "typescript","react","angular","vue","node","nestjs","php","laravel","c#",".net","go","rust",
  "ruby","rails","sql","postgresql","mysql","sql server","oracle","mongodb","redis","docker",
  "kubernetes","terraform","aws","azure","gcp","ci/cd","git","github","gitlab","linux","kafka",
  "rabbitmq","apis rest","rest","graphql","microsserviços","testes automatizados","tdd","scrum",
  "kanban","jira","power bi","tableau","looker","excel","dbt","bigquery","airflow","pandas",
  "numpy","machine learning","estatística","etl","html","css","tailwind","figma","ux","seo",
  "comunicação","liderança","trabalho em equipe","proatividade","organização","inglês","espanhol",
];

const SENIORITY_ORDER: Seniority[] = [
  "Estágio","Júnior","Pleno","Sênior","Especialista","Liderança",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tokens(text: string) {
  return normalize(text)
    .split(/[^a-z0-9+#./]+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

function containsTerm(haystack: string, term: string) {
  return normalize(haystack).includes(normalize(term));
}

function uniq(list: string[]) {
  const seen = new Set<string>();
  return list.filter((item) => {
    const key = normalize(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Extrai as palavras-chave mais relevantes de uma vaga. */
export function extractJobKeywords(job: Pick<Job, "title" | "description" | "requirements" | "niceToHave">) {
  const requiredText = `${job.title} ${job.requirements}`;
  const fullText = `${job.title} ${job.description} ${job.requirements} ${job.niceToHave}`;

  const known = KNOWN_SKILLS.filter((skill) => containsTerm(fullText, skill));

  const freq = new Map<string, number>();
  for (const token of tokens(fullText)) freq.set(token, (freq.get(token) ?? 0) + 1);
  const frequent = [...freq.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word);

  const keywords = uniq([...known, ...frequent]).slice(0, 30);

  return keywords.map((keyword) => ({
    keyword,
    importance: containsTerm(requiredText, keyword) ? ("alta" as const) : ("média" as const),
  }));
}

export interface JobAnalysis {
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  seniority: Seniority;
  salary: string;
  skills: string[];
  requirements: string;
  niceToHave: string;
  description: string;
}

/** Analisa um texto livre de vaga e tenta identificar os campos estruturados. */
export function analyzeJob(rawText: string): JobAnalysis {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);
  const text = rawText;
  const lower = normalize(text);

  const titleLine =
    lines.find((l) =>
      /(desenvolvedor|analista|engenheiro|programador|designer|gerente|especialista|estagi|coordenador|arquiteto|cientista|tech lead)/i.test(l),
    ) ?? lines[0] ?? "";

  const companyMatch =
    text.match(/(?:empresa|company|contratante)\s*[:\-]\s*(.+)/i) ??
    text.match(/(?:na|@)\s+([A-ZÁ-Ú][\w&.\- ]{2,40})\s*(?:\n|$)/);

  const locationMatch = text.match(/(?:local(?:iza[cç][aã]o)?|cidade)\s*[:\-]\s*(.+)/i);
  const salaryMatch = text.match(/(?:sal[aá]rio|remunera[cç][aã]o|faixa salarial)\s*[:\-]?\s*(R\$[\d\s.,\-a]+)/i);

  let workMode: WorkMode = "Indiferente";
  if (lower.includes("remoto") || lower.includes("home office")) workMode = "Remoto";
  else if (lower.includes("hibrid")) workMode = "Híbrido";
  else if (lower.includes("presencial")) workMode = "Presencial";

  let seniority: Seniority = "Pleno";
  if (/est[aá]gi/i.test(text)) seniority = "Estágio";
  else if (/j[uú]nior|jr\b/i.test(text)) seniority = "Júnior";
  else if (/s[eê]nior|sr\b/i.test(text)) seniority = "Sênior";
  else if (/especialista|specialist/i.test(text)) seniority = "Especialista";
  else if (/(tech lead|l[ií]der|gerente|head)/i.test(text)) seniority = "Liderança";

  const skills = KNOWN_SKILLS.filter((s) => containsTerm(text, s));

  const section = (labels: string[]) => {
    const pattern = new RegExp(`(?:${labels.join("|")})\\s*[:\\-]?\\s*\\n?([\\s\\S]{0,800}?)(?:\\n\\s*\\n|$)`, "i");
    return text.match(pattern)?.[1]?.trim() ?? "";
  };

  return {
    title: titleLine.replace(/^(vaga|cargo)\s*[:\-]\s*/i, "").slice(0, 120),
    company: (companyMatch?.[1] ?? "").trim().slice(0, 80),
    location: (locationMatch?.[1] ?? "").trim().slice(0, 80),
    workMode,
    seniority,
    salary: (salaryMatch?.[1] ?? "").trim(),
    skills,
    requirements: section(["requisitos", "qualifica[cç][oõ]es", "o que esperamos"]) || skills.join(", "),
    niceToHave: section(["diferenciais", "desej[aá]vel", "nice to have"]),
    description: text.slice(0, 4000),
  };
}

function profileSkillNames(profile: Profile) {
  const fromSkills = profile.skills.map((s) => s.name);
  const fromExperience = profile.experiences.flatMap((e) =>
    `${e.technologies} ${e.description} ${e.achievements}`.split(/[,;\n]/),
  );
  const fromProjects = profile.projects.flatMap((p) => p.technologies.split(/[,;\n]/));
  const fromLanguages = profile.languages.map((l) => l.language);
  return uniq(
    [...fromSkills, ...fromExperience, ...fromProjects, ...fromLanguages]
      .map((s) => s.trim())
      .filter((s) => s.length > 1),
  );
}

function yearsOfExperience(profile: Profile) {
  let months = 0;
  for (const exp of profile.experiences) {
    const start = exp.startDate ? new Date(`${exp.startDate}-01`) : null;
    const end = exp.isCurrent || !exp.endDate ? new Date() : new Date(`${exp.endDate}-01`);
    if (!start || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) continue;
    months += Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth());
  }
  return Math.round((months / 12) * 10) / 10;
}

function expectedYears(seniority: Seniority) {
  switch (seniority) {
    case "Estágio": return 0;
    case "Júnior": return 1;
    case "Pleno": return 3;
    case "Sênior": return 5;
    case "Especialista": return 7;
    case "Liderança": return 8;
  }
}

const pct = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

/** Compara perfil x vaga e devolve o score composto com explicações. */
export function calculateMatch(profile: Profile, job: Job): MatchResult {
  const keywords = extractJobKeywords(job);
  const mySkills = profileSkillNames(profile);
  const haystack = [...mySkills, profile.summary, profile.desiredRole].join(" | ");

  const jobSkills = uniq(
    [...keywords.filter((k) => k.importance === "alta").map((k) => k.keyword)],
  ).slice(0, 20);

  const matchedSkills = jobSkills.filter((s) => containsTerm(haystack, s));
  const missingSkills = jobSkills.filter((s) => !containsTerm(haystack, s));

  const keywordsFound = keywords.map((k) => k.keyword).filter((k) => containsTerm(haystack, k));
  const keywordsMissing = keywords.map((k) => k.keyword).filter((k) => !containsTerm(haystack, k));

  const skillsScore = jobSkills.length ? pct((matchedSkills.length / jobSkills.length) * 100) : 60;
  const keywordsScore = keywords.length ? pct((keywordsFound.length / keywords.length) * 100) : 60;

  const years = yearsOfExperience(profile);
  const needed = expectedYears(job.seniority);
  const experienceScore = needed === 0 ? 100 : pct((Math.min(years, needed) / needed) * 100);

  const educationScore = profile.education.length > 0 ? 100 : 55;

  const myLevelIndex = profile.experienceLevel ? SENIORITY_ORDER.indexOf(profile.experienceLevel) : -1;
  const jobLevelIndex = SENIORITY_ORDER.indexOf(job.seniority);
  const seniorityScore =
    myLevelIndex < 0 ? 60 : pct(100 - Math.abs(myLevelIndex - jobLevelIndex) * 22);

  let locationScore = 70;
  if (job.workMode === "Remoto" || profile.preferredWorkMode === "Indiferente") locationScore = 100;
  else if (profile.preferredWorkMode && profile.preferredWorkMode === job.workMode) locationScore = 100;
  else if (profile.city && containsTerm(job.location, profile.city)) locationScore = 95;
  else if (profile.state && containsTerm(job.location, profile.state)) locationScore = 80;

  const breakdown = {
    skills: skillsScore,
    experience: experienceScore,
    education: educationScore,
    seniority: seniorityScore,
    location: locationScore,
    keywords: keywordsScore,
  };

  const score = pct(
    breakdown.skills * 0.35 +
      breakdown.experience * 0.2 +
      breakdown.keywords * 0.15 +
      breakdown.seniority * 0.15 +
      breakdown.education * 0.05 +
      breakdown.location * 0.1,
  );

  const why = matchedSkills.length
    ? `Você possui experiência com ${matchedSkills.slice(0, 6).join(", ")}, que aparece entre os principais requisitos desta vaga.`
    : "Ainda não identificamos competências desta vaga no seu perfil. Complete seu perfil para uma análise mais precisa.";

  const gaps = missingSkills.length
    ? `A vaga menciona ${missingSkills.slice(0, 6).join(", ")}, mas essas competências não foram identificadas no seu perfil.`
    : "Não identificamos lacunas relevantes entre o seu perfil e os requisitos desta vaga.";

  const howToImprove = missingSkills.length
    ? `Considere destacar projetos ou estudos relacionados a ${missingSkills.slice(0, 3).join(", ")} — apenas se você realmente tiver essa vivência. Nunca adicione competências que você não possui.`
    : "Mantenha as descrições das suas experiências objetivas e alinhadas ao vocabulário da vaga.";

  return {
    jobId: job.id,
    score,
    breakdown,
    matchedSkills,
    missingSkills,
    keywordsFound,
    keywordsMissing,
    why,
    gaps,
    howToImprove,
    createdAt: new Date().toISOString(),
  };
}

export interface ATSIssueItem {
  severity: "ok" | "atencao" | "critico";
  title: string;
  detail: string;
}

export interface ATSAnalysis {
  score: number;
  issues: ATSIssueItem[];
  keywordsFound: string[];
  keywordsMissing: string[];
}

/** Avalia estrutura, clareza e legibilidade do currículo para sistemas ATS. */
export function analyzeATS(resume: Resume, job?: Job): ATSAnalysis {
  const c = resume.content;
  const issues: ATSIssueItem[] = [];
  let score = 100;

  const check = (ok: boolean, penalty: number, title: string, okDetail: string, badDetail: string) => {
    if (ok) issues.push({ severity: "ok", title, detail: okDetail });
    else {
      score -= penalty;
      issues.push({ severity: penalty >= 12 ? "critico" : "atencao", title, detail: badDetail });
    }
  };

  check(c.summary.trim().length >= 120, 12, "Resumo profissional",
    "Seu resumo tem tamanho adequado para leitura automática.",
    "Escreva um resumo com pelo menos 2 a 3 linhas descrevendo sua atuação.");

  check(c.experiences.length > 0, 18, "Experiência profissional",
    "As experiências estão presentes e serão lidas pelo sistema de triagem.",
    "Adicione ao menos uma experiência profissional com período e descrição.");

  check(
    c.experiences.every((e) => e.description.trim().length >= 60),
    10,
    "Descrição das atividades",
    "As descrições estão objetivas e suficientemente detalhadas.",
    "Algumas experiências têm descrição muito curta. Descreva atividades e responsabilidades.",
  );

  check(c.education.length > 0, 8, "Formação",
    "Sua formação está informada.",
    "Inclua sua formação acadêmica ou cursos técnicos relevantes.");

  check(c.skills.length >= 5, 12, "Competências",
    "Boa quantidade de competências listadas em texto simples.",
    "Liste ao menos 5 competências técnicas e comportamentais.");

  check(!!c.headline.trim(), 8, "Cargo/objetivo no cabeçalho",
    "O cargo no cabeçalho ajuda o ATS a classificar seu currículo.",
    "Informe o cargo ou objetivo profissional no topo do currículo.");

  issues.push({
    severity: "ok",
    title: "Formatação",
    detail:
      "A versão ATS deste currículo usa uma única coluna, sem tabelas, imagens, colunas ou elementos decorativos — o formato mais seguro para sistemas de triagem.",
  });

  let keywordsFound: string[] = [];
  let keywordsMissing: string[] = [];

  if (job) {
    const keywords = extractJobKeywords(job).map((k) => k.keyword);
    const resumeText = [
      c.headline, c.summary,
      ...c.skills.map((s) => s.name),
      ...c.experiences.map((e) => `${e.position} ${e.description} ${e.achievements} ${e.technologies}`),
      ...c.projects.map((p) => `${p.name} ${p.description} ${p.technologies}`),
    ].join(" ");
    keywordsFound = keywords.filter((k) => containsTerm(resumeText, k));
    keywordsMissing = keywords.filter((k) => !containsTerm(resumeText, k));
    const coverage = keywords.length ? keywordsFound.length / keywords.length : 1;
    if (coverage < 0.5) {
      score -= 10;
      issues.push({
        severity: "atencao",
        title: "Palavras-chave da vaga",
        detail: "Menos da metade das palavras-chave da vaga aparece no currículo. Destaque as que forem verdadeiras no seu perfil.",
      });
    } else {
      issues.push({
        severity: "ok",
        title: "Palavras-chave da vaga",
        detail: "Boa cobertura das palavras-chave identificadas nesta vaga.",
      });
    }
  }

  return { score: pct(score), issues, keywordsFound, keywordsMissing };
}

/** Melhora a redação de uma descrição sem inventar dados ou métricas. */
export function rewriteDescription(text: string) {
  const clean = text.trim();
  if (!clean) return clean;
  return clean
    .split(/\n+/)
    .map((line) => {
      let l = line.trim().replace(/^[-•*]\s*/, "");
      if (!l) return "";
      l = l
        .replace(/^fazia\s+/i, "Realização de ")
        .replace(/^fiz\s+/i, "Realização de ")
        .replace(/^ajudava\s+(a|com|no|na)?\s*/i, "Apoio ")
        .replace(/^cuidava\s+d[eoa]s?\s*/i, "Responsável por ")
        .replace(/^trabalhava\s+(com|em)\s*/i, "Atuação com ")
        .replace(/^participava\s+d[eoa]s?\s*/i, "Participação em ")
        .replace(/^dava\s+suporte\s*/i, "Suporte técnico ");
      l = l.charAt(0).toUpperCase() + l.slice(1);
      if (!/[.!?]$/.test(l)) l += ".";
      return `• ${l}`;
    })
    .filter(Boolean)
    .join("\n");
}

export interface TailorResult {
  content: ResumeContent;
  notes: string[];
}

/** Gera uma versão do currículo priorizada para a vaga — sem inventar informações. */
export function generateTailoredResume(base: Resume, job: Job, match: MatchResult): TailorResult {
  const keywords = extractJobKeywords(job);
  const relevant = keywords.map((k) => k.keyword);
  const notes: string[] = [];

  const relevanceOf = (text: string) =>
    relevant.reduce((acc, k) => acc + (containsTerm(text, k) ? 1 : 0), 0);

  const experiences = [...base.content.experiences]
    .map((e) => ({
      ...e,
      description: rewriteDescription(e.description),
      achievements: rewriteDescription(e.achievements),
    }))
    .sort(
      (a, b) =>
        relevanceOf(`${b.position} ${b.description} ${b.technologies}`) -
        relevanceOf(`${a.position} ${a.description} ${a.technologies}`),
    );

  const skills = [...base.content.skills].sort(
    (a, b) => (containsTerm(relevant.join(" "), b.name) ? 1 : 0) - (containsTerm(relevant.join(" "), a.name) ? 1 : 0),
  );

  const projects = [...base.content.projects].sort(
    (a, b) => relevanceOf(`${b.name} ${b.description} ${b.technologies}`) - relevanceOf(`${a.name} ${a.description} ${a.technologies}`),
  );

  const highlighted = match.matchedSkills.slice(0, 5);
  const summaryBase = base.content.summary.trim();
  const summary = highlighted.length
    ? `${summaryBase}${summaryBase && !/[.!?]$/.test(summaryBase) ? "." : ""} Atuação com ${highlighted.join(", ")}, competências alinhadas aos requisitos da vaga de ${job.title}.`.trim()
    : summaryBase;

  notes.push("Experiências reordenadas por relevância para esta vaga.");
  notes.push("Descrições reescritas em linguagem profissional, sem alterar os fatos informados.");
  if (highlighted.length) notes.push(`Competências destacadas no resumo: ${highlighted.join(", ")}.`);
  if (match.missingSkills.length)
    notes.push(
      `Não adicionamos ${match.missingSkills.slice(0, 5).join(", ")}: essas competências aparecem na vaga, mas não foram encontradas no seu perfil.`,
    );

  return {
    content: {
      ...base.content,
      headline: job.title,
      summary,
      experiences,
      skills,
      projects,
    },
    notes,
  };
}

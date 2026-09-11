import type { Job } from "./types";

const now = new Date().toISOString();

export const demoJobs: Job[] = [
  {
    id: "demo-1",
    title: "Desenvolvedor Backend Júnior",
    company: "Empresa Demonstrativa Alfa",
    location: "São Paulo, SP",
    workMode: "Híbrido",
    seniority: "Júnior",
    salary: "R$ 4.500 - R$ 6.000",
    url: "",
    area: "Tecnologia",
    description:
      "Atuação no desenvolvimento e manutenção de APIs REST, integrações e serviços internos. Participação em code review e melhoria contínua das aplicações.",
    requirements:
      "Python, Django, APIs REST, PostgreSQL, Git, Docker, lógica de programação, trabalho em equipe",
    niceToHave: "AWS, Kubernetes, testes automatizados, CI/CD",
    benefits: "Vale refeição, plano de saúde, horário flexível",
    isDemo: true,
    createdAt: now,
    publishedAt: now,
  },
  {
    id: "demo-2",
    title: "Analista de Sistemas",
    company: "Empresa Demonstrativa Beta",
    location: "Fortaleza, CE",
    workMode: "Presencial",
    seniority: "Pleno",
    salary: "R$ 6.000 - R$ 8.000",
    url: "",
    area: "Tecnologia",
    description:
      "Levantamento de requisitos, documentação de processos, suporte a sistemas internos e apoio às áreas de negócio.",
    requirements:
      "SQL, levantamento de requisitos, documentação, ERP, comunicação, análise de dados, Excel",
    niceToHave: "Power BI, metodologias ágeis, Scrum",
    benefits: "Vale transporte, plano odontológico",
    isDemo: true,
    createdAt: now,
    publishedAt: now,
  },
  {
    id: "demo-3",
    title: "Desenvolvedor Python",
    company: "Empresa Demonstrativa Gama",
    location: "Remoto",
    workMode: "Remoto",
    seniority: "Pleno",
    salary: "R$ 8.000 - R$ 11.000",
    url: "",
    area: "Tecnologia",
    description:
      "Desenvolvimento de serviços em Python, integrações com APIs de terceiros e automações de processos de dados.",
    requirements:
      "Python, FastAPI, PostgreSQL, Docker, APIs REST, Git, testes automatizados, AWS",
    niceToHave: "Kubernetes, Terraform, mensageria, Kafka",
    benefits: "Trabalho remoto, auxílio home office",
    isDemo: true,
    createdAt: now,
    publishedAt: now,
  },
  {
    id: "demo-4",
    title: "Desenvolvedor Java",
    company: "Empresa Demonstrativa Delta",
    location: "Belo Horizonte, MG",
    workMode: "Híbrido",
    seniority: "Sênior",
    salary: "R$ 12.000 - R$ 15.000",
    url: "",
    area: "Tecnologia",
    description:
      "Construção e evolução de microsserviços em Java com Spring Boot, atuando em arquitetura e mentoria técnica.",
    requirements:
      "Java, Spring Boot, microsserviços, SQL, Docker, Kubernetes, APIs REST, arquitetura de software",
    niceToHave: "Kafka, AWS, observabilidade, liderança técnica",
    benefits: "PLR, plano de saúde, auxílio educação",
    isDemo: true,
    createdAt: now,
    publishedAt: now,
  },
  {
    id: "demo-5",
    title: "Analista de Dados",
    company: "Empresa Demonstrativa Épsilon",
    location: "Remoto",
    workMode: "Remoto",
    seniority: "Júnior",
    salary: "R$ 5.000 - R$ 7.000",
    url: "",
    area: "Dados",
    description:
      "Criação de dashboards, análise exploratória e apoio à tomada de decisão das áreas de produto e operações.",
    requirements:
      "SQL, Python, Power BI, Excel, estatística, storytelling de dados, comunicação",
    niceToHave: "dbt, BigQuery, Looker, inglês intermediário",
    benefits: "Trabalho remoto, plano de saúde",
    isDemo: true,
    createdAt: now,
    publishedAt: now,
  },
];

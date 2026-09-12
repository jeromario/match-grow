import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  FileCheck2,
  FileText,
  Search,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchCV — Encontre vagas certas e adapte seu currículo" },
      {
        name: "description",
        content:
          "Compare seu perfil com as vagas, descubra seu nível de compatibilidade e gere currículos otimizados para sistemas ATS. Sem cadastro.",
      },
      { property: "og:title", content: "MatchCV — Match de vagas e currículo ATS" },
      {
        property: "og:description",
        content:
          "Descubra seu Match Score com cada vaga e gere um currículo ATS-friendly em minutos.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: Target, title: "Crie seu perfil", text: "Informe experiências, formação e competências." },
  { icon: Search, title: "Encontre ou adicione uma vaga", text: "Cole a descrição e organizamos os dados." },
  { icon: BarChart3, title: "Veja seu Match Score", text: "Compatibilidade detalhada por categoria." },
  { icon: FileCheck2, title: "Gere seu currículo ATS", text: "Uma versão sob medida para cada vaga." },
  { icon: Send, title: "Candidate-se", text: "Acompanhe cada candidatura em um só lugar." },
];

const benefits = [
  { title: "Match inteligente", text: "Entenda o quanto seu perfil conversa com cada vaga." },
  { title: "Currículo personalizado", text: "Uma versão por vaga, sempre com informações verdadeiras." },
  { title: "Análise ATS", text: "Saiba se seu currículo passa pelos filtros automáticos." },
  { title: "Identificação de gaps", text: "Veja o que falta e como se preparar." },
  { title: "Histórico de candidaturas", text: "Do interesse à oferta, tudo organizado." },
  { title: "Sem cadastro", text: "Comece a usar imediatamente, direto no navegador." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            MatchCV
          </span>
          <Button asChild size="sm">
            <Link to="/onboarding">Começar</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <Badge className="mb-6 border-0 bg-accent-soft text-accent-foreground">
            Sem cadastro, sem login — comece agora
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Encontre vagas certas para você. Adapte seu currículo para cada oportunidade.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Compare seu perfil com as vagas, descubra seu nível de compatibilidade e gere currículos
            otimizados para sistemas ATS.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/onboarding">
                Começar gratuitamente <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#como-funciona">Como funciona</a>
            </Button>
          </div>
        </section>

        <section id="como-funciona" className="border-y bg-card/60 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">Como funciona</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {steps.map((s, i) => (
                <Card key={s.title} className="h-full">
                  <CardContent className="space-y-2 p-5">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <s.icon className="size-4" />
                    </span>
                    <p className="text-xs font-medium text-muted-foreground">Passo {i + 1}</p>
                    <h3 className="text-sm font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-semibold sm:text-3xl">Benefícios</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <Card key={b.title}>
                  <CardContent className="p-6">
                    <h3 className="text-base font-semibold">{b.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-primary-soft/60 py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <FileText className="mx-auto size-8 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">Prepare seu próximo currículo.</h2>
            <p className="mt-3 text-muted-foreground">
              Leva poucos minutos para criar seu perfil e ver sua compatibilidade com a primeira vaga.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/onboarding">
                Começar gratuitamente <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        MatchCV — seus dados ficam salvos neste navegador.
      </footer>
    </div>
  );
}

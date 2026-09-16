# Match & Grow

Crie uma plataforma completa de Matchmaking de Vagas + Currículo ATS

Quero criar do zero, inteiramente dentro do Lovable, uma aplicação web SaaS moderna para ajudar pessoas a encontrarem vagas compatíveis com seus perfis profissionais e, para cada vaga, gerar uma versão personalizada e ATS-friendly do currículo do usuário.

O produto deve ter aparência profissional, moderna, simples e confiável, com foco em empregabilidade e tecnologia.

Não quero apenas uma landing page ou protótipo visual. Quero uma aplicação funcional, com perfil profissional, gerenciamento de currículos, gerenciamento de vagas, algoritmo de matching, análise de compatibilidade e geração de versões personalizadas do currículo.

IMPORTANTE: nesta primeira versão NÃO implementar login, cadastro, autenticação, criação de conta ou qualquer fluxo de usuário autenticado.

O usuário deve conseguir entrar diretamente na aplicação e começar a utilizar o sistema imediatamente.

A persistência de dados pode ser preparada para funcionar posteriormente com autenticação, mas nesta versão o objetivo é validar a experiência principal do produto sem exigir login.

1. Nome e conceito do produto

Use provisoriamente o nome:

MatchCV

O nome deve aparecer na interface de forma elegante.

Conceito:

"Encontre vagas que combinam com você e adapte seu currículo para aumentar suas chances de passar pelos filtros ATS."

O produto deve funcionar como uma plataforma de:

Construção/importação do currículo.

Estruturação do perfil profissional.

Cadastro/importação de vagas.

Análise da vaga.

Match entre candidato e vaga.

Identificação de gaps.

Geração de currículo específico para aquela vaga.

Análise ATS.

Histórico das vagas e currículos gerados.

2. Stack e arquitetura

Construa a aplicação utilizando o stack padrão mais adequado e estável disponível no Lovable.

Prioridades:

React + TypeScript.

Vite.

Tailwind CSS.

Supabase para backend e banco de dados quando necessário.

shadcn/ui como Design System obrigatório.

Componentização.

Código limpo e organizado.

Responsividade completa.

Mobile-first.

Arquitetura preparada para integração futura com APIs externas de vagas e IA.

Não criar backend externo desnecessário.

Sempre que uma funcionalidade puder ser implementada utilizando Supabase + frontend dentro do Lovable, prefira essa abordagem.

Não implementar Supabase Auth nesta primeira versão.

A aplicação deve abrir diretamente na experiência principal.

3. Design System obrigatório

Utilize shadcn/ui como base de todos os componentes da aplicação.

Não criar componentes visuais completamente independentes quando existir equivalente no shadcn/ui.

Utilizar componentes como:

Button

Card

Input

Textarea

Select

Checkbox

Radio Group

Switch

Dialog

Drawer

Dropdown Menu

Tabs

Badge

Avatar

Progress

Alert

Toast

Tooltip

Table

Accordion

Separator

Skeleton

Sheet

Command

Calendar

Criar componentes reutilizáveis.

4. Identidade visual

A interface deve utilizar principalmente:

Azul claro

Cor primária.

Transmitir:

confiança

tecnologia

profissionalismo

tranquilidade

Branco

Utilizar como principal cor de fundo das áreas de conteúdo.

Amarelo claro

Utilizar como cor de destaque para:

oportunidades

recomendações

alertas positivos

pontos de atenção

CTAs secundários

indicadores importantes

Evitar amarelo muito forte ou neon.

A paleta deve ser suave e profissional.

Sugestão de direção visual:

Primary: light blue

Background: white / very light blue

Accent: light yellow

Text: dark navy/slate

Success: soft green

Warning: soft yellow

Error: soft red

Não exagerar nas cores.

A interface deve parecer um SaaS profissional, e não uma aplicação infantil.

5. Estilo visual

Criar uma interface:

minimalista

moderna

limpa

profissional

tecnológica

intuitiva

com bastante espaço em branco

cards com bordas suaves

sombras discretas

cantos arredondados

tipografia moderna

excelente hierarquia visual

Evitar:

gradientes exagerados

excesso de animações

excesso de cards

elementos gigantes

visual excessivamente colorido

aparência genérica de template

Usar animações apenas quando melhorarem a experiência.

6. Entrada direta na aplicação

NÃO criar:

Login

Cadastro

Tela de autenticação

Recuperação de senha

Logout

Tela de criação de conta

"Minha conta"

Proteção de rotas baseada em autenticação

Ao acessar a aplicação, o usuário deve entrar diretamente na experiência principal.

Criar uma experiência inicial simples:

"Vamos encontrar sua próxima oportunidade."

Apresentar duas ações principais:

Criar meu perfil

e

Importar meu currículo

O usuário poderá escolher qualquer uma das duas opções.

Também disponibilizar:

Já tenho um currículo

para importar um currículo existente.

7. Onboarding

Criar um onboarding simples e agradável.

Como não haverá login nesta primeira versão, o onboarding deve funcionar como uma sessão de utilização da aplicação.

Etapas:

Etapa 1 — Informações básicas

Nome completo

Cidade

Estado

País

LinkedIn

GitHub

Portfólio

Telefone

Etapa 2 — Objetivo profissional

Perguntar:

Cargo desejado

Área profissional

Nível de experiência

Localização desejada

Pretensão salarial

Tipo de contratação

Modalidade

Modalidades:

Presencial

Híbrido

Remoto

Indiferente

Etapa 3 — Experiência

Permitir cadastrar:

Empresa

Cargo

Data inicial

Data final

Emprego atual

Descrição das atividades

Etapa 4 — Formação

Permitir cadastrar:

Instituição

Curso

Grau

Data inicial

Data final

Em andamento

Etapa 5 — Skills

Permitir adicionar:

Hard skills

Soft skills

Ferramentas

Tecnologias

Idiomas

Certificações

Ao terminar o onboarding, direcionar para o Dashboard.

8. Dashboard

Criar um dashboard profissional.

O dashboard deve apresentar:

Saudação

Exemplo:

Olá, Jefferson! 👋

Utilizar o nome informado pelo usuário.

Resumo

Cards:

Vagas analisadas

Matches encontrados

Currículos gerados

Candidaturas

Match médio

"Melhores oportunidades"

Mostrar as vagas com maior compatibilidade.

Cada vaga deve mostrar:

Empresa

Cargo

Localização

Modalidade

Match %

principais skills compatíveis

principais gaps

botão "Ver vaga"

"Seu perfil"

Mostrar percentual de completude.

Exemplo:

Perfil 82% completo

CTA:

Completar perfil

"Últimas atividades"

Mostrar:

currículo criado

vaga analisada

candidatura registrada

perfil atualizado

9. Perfil profissional

Criar uma página completa chamada:

Meu Perfil

Organizar em abas:

Informações pessoais

Objetivo profissional

Experiência

Formação

Skills

Idiomas

Certificações

Links

Permitir CRUD completo.

O usuário deve conseguir editar tudo sem precisar refazer o onboarding.

10. Currículos

Criar seção:

Meus Currículos

O usuário poderá:

criar currículo

editar currículo

duplicar currículo

excluir currículo

visualizar currículo

baixar currículo

gerar versão para uma vaga

Criar um currículo base chamado:

Currículo Principal

Esse currículo será a fonte principal para gerar versões específicas.

11. Importação de currículo

Permitir que o usuário envie seu currículo existente.

Aceitar inicialmente:

PDF

DOCX

O sistema deve preparar a arquitetura para extrair informações do documento.

Após o upload, apresentar uma tela:

"Revise as informações encontradas"

O usuário deverá confirmar os dados antes de salvar.

Nunca sobrescrever automaticamente informações sem permitir revisão.

12. Estrutura do currículo

O currículo deve suportar:

Cabeçalho

Nome

Cargo/objetivo

Email

Telefone

Cidade

LinkedIn

GitHub

Portfólio

Resumo profissional

Texto profissional curto.

Experiência profissional

Para cada experiência:

Empresa

Cargo

Período

Descrição

Realizações

Tecnologias

Formação

Curso

Instituição

Período

Skills

Tecnologias

Ferramentas

Competências

Idiomas

Certificações

Projetos

13. Página de vagas

Criar seção:

Vagas

Criar uma interface de busca.

Filtros:

Cargo

Área

Localização

Modalidade

Senioridade

Salário

Tecnologia

Data de publicação

Mostrar vagas em cards.

Cada card deve conter:

Cargo

Empresa

Local

Modalidade

Senioridade

Salário quando disponível

Data

Match %

Adicionar botão:

Analisar vaga

14. Cadastro/importação de vagas

Como não quero depender inicialmente de uma API externa obrigatória, criar uma forma para o usuário adicionar uma vaga manualmente.

Tela:

Adicionar vaga

Campos:

Título

Empresa

Localização

Modalidade

Senioridade

Salário

URL da vaga

Descrição completa da vaga

Requisitos

Diferenciais

Benefícios

Também permitir colar simplesmente o texto completo de uma vaga.

Exemplo:

Cole aqui a descrição da vaga...

O sistema deverá tentar identificar automaticamente:

cargo

empresa

skills

requisitos

senioridade

modalidade

localização

Sempre permitir que o usuário revise os dados identificados.

15. Match entre candidato e vaga

Criar o principal recurso da plataforma:

Match Score

O sistema deve comparar o perfil/currículo do usuário com a vaga.

Exibir um percentual de compatibilidade:

87% Match

Criar categorias:

Skills

Exemplo:

Python ✓

Django ✓

REST API ✓

Docker ✓

Kubernetes ✕

Experiência

Comparar experiência exigida x experiência do usuário.

Formação

Comparar formação exigida x formação do usuário.

Senioridade

Comparar nível exigido x nível do usuário.

Localização

Comparar localização/modalidade.

Palavras-chave

Identificar palavras-chave importantes da vaga.

16. Explicação do Match

Não mostrar apenas um número.

Mostrar:

Por que você combina com esta vaga?

Exemplo:

Você possui experiência com Python, Django, APIs REST e Docker, que aparecem entre os principais requisitos da vaga.

Depois:

O que está faltando?

Exemplo:

A vaga menciona Kubernetes e AWS, mas essas competências não foram identificadas no seu perfil.

Depois:

Como melhorar

Exemplo:

Considere destacar projetos relacionados a cloud ou adquirir experiência prática com AWS.

Nunca incentivar o usuário a mentir ou inventar experiências.

17. Score detalhado

Criar um score composto visualmente.

Exemplo:

87% Match

Distribuição:

Skills: 92%

Experiência: 85%

Formação: 100%

Senioridade: 90%

Localização: 100%

Keywords: 80%

Usar Progress do shadcn/ui.

18. Análise ATS

Criar uma funcionalidade:

Analisar currículo

O sistema deverá avaliar:

Estrutura

Clareza

Organização

Seções

Legibilidade

Keywords

Identificar:

keywords encontradas

keywords ausentes

keywords relevantes

Experiência

Avaliar se as experiências estão descritas de maneira objetiva.

Formatação

Alertar sobre elementos que podem prejudicar sistemas ATS:

tabelas excessivas

colunas

imagens

gráficos

elementos decorativos

textos importantes dentro de elementos visuais

Score ATS

Exemplo:

ATS Score: 91/100

Mostrar recomendações.

19. Geração de currículo personalizado

Esta é uma das funcionalidades mais importantes.

Na página de uma vaga, criar botão:

Criar currículo para esta vaga

O sistema deverá utilizar:

Perfil do usuário

Currículo base

Informações da vaga

Skills do usuário

Keywords da vaga

E gerar uma nova versão do currículo.

Nome:

Currículo — [Nome da vaga] — [Empresa]

Exemplo:

Currículo — Desenvolvedor Backend — Empresa XYZ

20. Regras da geração do currículo

O currículo personalizado deve:

ser ATS-friendly

utilizar palavras-chave relevantes da vaga

destacar experiências relacionadas

reorganizar prioridades

melhorar descrições

utilizar linguagem profissional

evitar informações irrelevantes

manter informações verdadeiras

nunca inventar experiência

nunca inventar certificação

nunca inventar tecnologia

nunca inventar empresa

nunca inventar resultados

Se determinada skill aparecer na vaga, mas o usuário não possuir essa skill, o sistema não deve adicioná-la como se ele tivesse.

Pode sugerir:

"Esta competência aparece na vaga, mas não foi encontrada no seu perfil."

21. Reescrita das experiências

Quando possível, transformar descrições genéricas em descrições mais profissionais.

Exemplo ruim:

"Fazia manutenção no sistema."

Exemplo melhor:

"Realização de manutenção e suporte em sistemas internos, contribuindo para a resolução de incidentes e melhoria da disponibilidade das aplicações."

Mas nunca inventar métricas.

Não criar números fictícios.

22. Keywords da vaga

Criar uma área:

Keywords importantes

Separar:

Encontradas no currículo

Python

Django

REST

PostgreSQL

Ausentes

AWS

Kubernetes

Alta relevância

Mostrar as keywords mais importantes para aquela vaga.

23. Editor de currículo

Criar editor visual do currículo.

Layout dividido:

Esquerda:

Editor/formulário.

Direita:

Preview em tempo real.

Permitir editar:

resumo

experiência

formação

skills

projetos

idiomas

certificações

O preview deve parecer um currículo real.

Criar opção:

Visualizar versão ATS

Essa versão deve ser propositalmente simples:

uma coluna

texto limpo

títulos claros

sem elementos decorativos excessivos

sem tabelas desnecessárias

sem informações escondidas

24. Exportação

Permitir:

Baixar currículo em PDF

Preparar arquitetura para futuramente permitir:

DOCX

TXT

O PDF deve possuir aparência profissional e ser adequado para ATS.

25. Histórico

Criar seção:

Histórico

Mostrar:

vagas analisadas

currículos gerados

candidaturas

data

empresa

cargo

match

ATS score

Permitir acessar novamente o currículo criado para determinada vaga.

26. Candidaturas

Criar seção:

Minhas candidaturas

Status:

Interessado

Aplicar

Aplicado

Entrevista

Oferta

Rejeitado

Encerrado

Permitir alterar status.

Mostrar:

empresa

vaga

data

currículo utilizado

match

status

Criar visão de pipeline.

27. Página detalhada da vaga

Ao clicar em uma vaga:

Criar página:

Detalhes da vaga

Seções:

Informações

cargo

empresa

localização

modalidade

senioridade

salário

link

Descrição

Requisitos

Diferenciais

Match

Mostrar o score do usuário.

Keywords

Mostrar keywords encontradas e ausentes.

Currículo

Mostrar:

Seu currículo atual

e

Criar currículo personalizado

28. Landing Page

Criar uma landing page pública moderna.

Hero:

Encontre vagas certas para você.

Adapte seu currículo para cada oportunidade.

Subtítulo:

Compare seu perfil com as vagas, descubra seu nível de compatibilidade e gere currículos otimizados para sistemas ATS.

CTA principal:

Começar gratuitamente

CTA secundário:

Como funciona

Criar seções:

Como funciona

Crie seu perfil

Encontre ou adicione uma vaga

Veja seu Match Score

Gere seu currículo ATS

Candidate-se

Benefícios

Match inteligente

Currículo personalizado

Análise ATS

Identificação de gaps

Histórico de candidaturas

CTA final

Prepare seu próximo currículo.

29. Navegação

Desktop:

Sidebar lateral.

Itens:

Dashboard

Vagas

Meu Perfil

Meus Currículos

Minhas Candidaturas

Histórico

No final:

Configurações

Preferências

Não incluir:

Conta

Login

Logout

Usuário autenticado

Mobile:

Utilizar navegação responsiva utilizando Drawer/Sheet do shadcn/ui.

30. Banco de dados

Utilizar Supabase quando necessário.

Criar estrutura relacional adequada.

Como não existe autenticação nesta primeira versão, utilizar uma estrutura preparada para posteriormente associar os dados a usuários autenticados.

Tabelas sugeridas:

profiles

id

session_id

full_name

phone

city

state

country

linkedin_url

github_url

portfolio_url

desired_role

desired_area

experience_level

salary_expectation

preferred_work_mode

created_at

updated_at

experiences

id

profile_id

company

position

start_date

end_date

is_current

description

achievements

education

id

profile_id

institution

course

degree

start_date

end_date

is_current

skills

id

profile_id

name

type

level

languages

id

profile_id

language

level

certifications

id

profile_id

name

institution

issue_date

resumes

id

profile_id

name

type

summary

content

ats_score

created_at

updated_at

resume_versions

id

resume_id

job_id

content

ats_score

created_at

jobs

id

profile_id

title

company

location

work_mode

seniority

salary

url

description

requirements

nice_to_have

created_at

published_at

job_keywords

id

job_id

keyword

importance

matches

id

profile_id

job_id

match_score

skills_score

experience_score

education_score

seniority_score

location_score

keywords_score

analysis

created_at

applications

id

profile_id

job_id

resume_version_id

status

applied_at

notes

created_at

updated_at

31. Sessão sem login

Como não haverá autenticação nesta primeira versão, criar um mecanismo de sessão anônima/local.

Ao iniciar a aplicação:

Criar um session_id único.

Persistir o session_id no navegador.

Associar o perfil, currículo, vagas, matches e candidaturas à sessão.

Ao retornar ao aplicativo no mesmo navegador, recuperar os dados da sessão.

Utilizar, quando apropriado:

localStorage

sessionStorage

Supabase

A experiência deve parecer contínua para o usuário.

Não mostrar nenhum conceito técnico relacionado a session_id para o usuário.

32. Segurança

Mesmo sem login nesta primeira versão, estruturar o código de forma que posteriormente seja possível adicionar autenticação.

Não expor informações sensíveis.

Não colocar API keys diretamente no frontend.

Quando autenticação for implementada futuramente, preparar o modelo para:

Supabase Auth

Row Level Security

associação dos dados ao usuário autenticado

Nesta primeira versão, não bloquear o acesso com autenticação.

33. Dados de demonstração

Criar seed/demo data para facilitar testes.

Criar algumas vagas fictícias claramente identificadas como demonstração.

Exemplos:

Desenvolvedor Backend Júnior

Analista de Sistemas

Desenvolvedor Python

Desenvolvedor Java

Analista de Dados

Não utilizar empresas reais de maneira que pareça uma vaga real.

34. Inteligência artificial

Preparar a arquitetura para utilizar IA nas seguintes tarefas:

Análise de vaga

Extrair:

cargo

senioridade

skills

keywords

requisitos

diferenciais

Match

Comparar perfil x vaga.

Currículo

Gerar versão personalizada.

ATS

Analisar currículo.

Sugestões

Explicar como melhorar o currículo.

Criar uma camada de serviço bem organizada para essas operações.

Não espalhar chamadas de IA pelo código.

Criar funções/serviços separados, por exemplo:

analyzeJob()

calculateMatch()

analyzeATS()

generateTailoredResume()

extractJobKeywords()

Se uma API de IA ainda não estiver configurada, implementar a interface/estrutura necessária e utilizar dados mockados para que o restante da aplicação continue funcional.

Não colocar API keys diretamente no frontend.

35. Estados de carregamento

Toda operação que envolva processamento deve possuir:

loading state

skeleton quando apropriado

feedback de sucesso

feedback de erro

Exemplo:

Ao gerar currículo:

Analisando a vaga...

Depois:

Identificando keywords...

Depois:

Adaptando seu currículo...

Depois:

Currículo pronto!

Criar uma experiência visual agradável.

36. Empty states

Criar estados vazios profissionais.

Exemplo:

Sem currículos:

Você ainda não possui currículos personalizados.

CTA:

Criar currículo

Sem vagas:

Nenhuma vaga adicionada ainda.

CTA:

Adicionar vaga

37. Tratamento de erros

Nunca apresentar erros técnicos diretamente ao usuário.

Evitar mensagens como:

Supabase error 23505

Mostrar mensagens amigáveis.

Exemplo:

Não foi possível salvar suas informações. Tente novamente.

Registrar detalhes técnicos apenas onde apropriado para debugging.

38. Responsividade

A aplicação precisa funcionar muito bem em:

Desktop

Notebook

Tablet

Smartphone

Não simplesmente reduzir o desktop.

Adaptar:

sidebar

cards

tabelas

formulários

editor

preview do currículo

dashboard

39. Acessibilidade

Utilizar boas práticas:

labels nos inputs

contraste adequado

navegação por teclado

aria-label quando necessário

foco visível

botões com estados claros

mensagens de erro associadas aos campos

40. UX

A experiência deve ser simples para alguém que não entende de ATS.

Evitar termos técnicos sem explicação.

Quando utilizar:

ATS

Mostrar tooltip ou explicação:

ATS significa Applicant Tracking System, sistema utilizado por empresas para filtrar e organizar currículos.

Quando mostrar Match Score:

Este percentual representa o quanto seu perfil está alinhado aos requisitos identificados nesta vaga.

41. Configurações

Criar página:

Configurações

Seções:

Preferências profissionais

cargo desejado

localização

modalidade

salário

Privacidade

Permitir controlar preferências de dados.

Aparência

Preparar estrutura para:

tema claro

tema escuro

Por padrão utilizar tema claro.

Não criar configurações relacionadas a conta, senha, login ou autenticação.

42. Monetização futura

Não implementar cobrança agora.

Mas preparar arquitetura para futuramente suportar:

Free

perfil

quantidade limitada de análises

poucos currículos

Pro

análises ilimitadas

currículos personalizados

análises ATS avançadas

histórico completo

Não criar telas de pagamento agora, apenas deixar a arquitetura preparada.

43. Regras importantes

Estas regras são obrigatórias:

Não inventar informações profissionais do usuário.

Não inventar experiências.

Não inventar empresas.

Não inventar certificações.

Não inventar tecnologias.

Não inventar métricas.

Não recomendar mentiras no currículo.

O currículo deve refletir somente informações fornecidas pelo usuário.

Keywords podem ser reorganizadas e destacadas quando verdadeiras.

O usuário sempre deve conseguir editar o currículo gerado.

O usuário deve conseguir visualizar o que foi alterado.

Manter histórico das versões.

Não sobrescrever o currículo original ao gerar uma versão específica.

Cada vaga pode possuir várias versões de currículo.

A interface deve funcionar mesmo quando a IA não estiver configurada, usando mocks onde necessário.

Não depender inicialmente de integração externa com sites de emprego.

Criar a arquitetura para adicionar essas integrações posteriormente.

Não exigir login ou cadastro para utilizar qualquer funcionalidade da primeira versão.

O usuário deve conseguir entrar diretamente e começar a executar o fluxo principal.

Não apresentar telas de autenticação nesta versão.

44. Primeira experiência do usuário

O fluxo ideal deve ser:

Entrar no MatchCV

↓

Criar meu perfil ou importar currículo

↓

Completar/revisar perfil

↓

Dashboard

↓

Adicionar currículo base

↓

Adicionar vaga

↓

Analisar vaga

↓

Ver Match Score

↓

Ver gaps

↓

Gerar currículo personalizado

↓

Analisar ATS

↓

Editar currículo

↓

Baixar PDF

↓

Registrar candidatura

↓

Acompanhar candidatura

45. Microcopy

Utilizar português brasileiro em toda a interface.

Tom:

profissional

amigável

objetivo

encorajador

sem exagero de marketing

Exemplos:

Match

Seu perfil tem alta compatibilidade com esta vaga.

Gap

Esta competência aparece nos requisitos da vaga, mas ainda não está presente no seu perfil.

ATS

Seu currículo está bem estruturado para sistemas de triagem.

Currículo

Personalizamos seu currículo com base nos requisitos desta vaga, sem inventar informações.

46. Componentes reutilizáveis

Criar componentes reutilizáveis como:

AppSidebar

DashboardCard

JobCard

MatchScore

MatchBreakdown

SkillBadge

SkillComparison

ATSScore

ATSIssue

ResumePreview

ResumeEditor

ProfileCompletion

ApplicationStatusBadge

JobHeader

KeywordList

EmptyState

LoadingState

ConfirmDialog

Manter os componentes organizados e reutilizáveis.

47. Qualidade do código

Priorizar:

TypeScript

tipagem forte

componentes pequenos

hooks reutilizáveis

services separados

validação de formulários

tratamento de erros

código legível

evitar duplicação

evitar lógica de negócio dentro de componentes visuais

Utilizar React Hook Form + Zod quando apropriado.

48. Resultado esperado

Ao finalizar esta implementação, quero ter uma aplicação funcional chamada MatchCV, com:

Landing Page

Entrada direta sem login

Onboarding

Dashboard

Perfil profissional

Currículo base

Importação de currículo

Cadastro de vagas

Análise de vagas

Match Score

Comparação de skills

Gaps

Keywords

Análise ATS

Geração de currículo personalizado

Editor de currículo

Preview

Exportação PDF

Histórico

Gestão de candidaturas

Configurações

Sessão anônima

Persistência local/Supabase quando apropriado

Dados de demonstração

Responsividade

Design System baseado em shadcn/ui

Não implementar nesta versão:

Login

Cadastro

Autenticação

Recuperação de senha

Logout

Perfil de conta

Gestão de senha

49. Ordem de implementação

Não tente criar apenas telas estáticas.

Implemente seguindo esta ordem lógica:

Fase 1

Setup do projeto + Design System + identidade visual.

Fase 2

Estrutura de dados + sessão anônima + persistência.

Fase 3

Onboarding + perfil profissional.

Fase 4

Currículos + editor + preview.

Fase 5

Cadastro e gerenciamento de vagas.

Fase 6

Motor de Match.

Fase 7

Análise ATS.

Fase 8

Geração de currículo personalizado.

Fase 9

Candidaturas + histórico.

Fase 10

Polimento de UX, responsividade, acessibilidade e tratamento de erros.

50. Regra final de implementação

Construa a aplicação de verdade.

Não entregue somente mockups.

Não crie botões que não fazem nada.

Não crie páginas sem navegação.

Não use dados falsos quando a informação deveria vir do banco.

Quando uma integração externa ainda não estiver disponível, encapsule a integração e use dados mockados claramente identificados, mantendo a aplicação funcional.

Priorize primeiro um MVP completo e funcional, depois refinamentos visuais.

Use shadcn/ui como Design System principal em toda a aplicação.

A interface final deve transmitir a sensação de um produto SaaS profissional de recrutamento e carreira, com:

azul claro + branco + amarelo claro, muito espaço em branco, excelente hierarquia visual e UX simples.

O usuário deve conseguir abrir o MatchCV e imediatamente começar a criar seu perfil, adicionar uma vaga, descobrir seu Match Score, entender seus gaps e gerar uma versão ATS-friendly do currículo para aquela vaga, sem criar conta e sem fazer login.

Nesta primeira versão, a prioridade absoluta é validar o fluxo principal do produto. Autenticação e sistema de contas serão implementados posteriormente.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/04f80647-d895-40ac-ab91-360f958f4bcb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

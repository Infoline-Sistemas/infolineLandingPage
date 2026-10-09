# Site institucional Infoline

Este repositório contém o novo site institucional da Infoline em **HTML, CSS e JavaScript puros**. O site publicado é estático: não precisa de Node.js no servidor, banco de dados ou framework no navegador.

Node.js é usado somente durante a manutenção para gerar novamente os arquivos HTML a partir dos templates e do conteúdo centralizado.

## Integração neste repositório

O site está preparado para o GitHub Pages da Infoline: publicação da raiz da `main` e domínio mantido em `CNAME`. A integração V4 foi feita em uma branch nova baseada na `main`; a publicação depende da integração dessa branch à `main`.

Use `npm run build`, `npm run check` e `npm run dev` para gerar, validar e abrir a prévia em `http://127.0.0.1:4175`. `npm run package` cria uma release pública em uma pasta nova dentro de `dist/`.

O envio de demonstrações mantém a chave pública Web3Forms já utilizada. Foram adicionados banner, preferências por finalidade e revogação de consentimento. Os identificadores de Google e Meta permanecem vazios até a configuração das contas pelo responsável. A política antiga, as políticas de aplicativos presentes na `main` e os acessos V3/V3.1 são preservados.

Veja [a integração e as pendências de ativação](docs/11-INTEGRACAO-GITHUB-PAGES.md).

## Regra mais importante

> Não edite diretamente os arquivos `.html` da raiz para fazer mudanças permanentes.

Arquivos como `index.html`, `crm.html`, `financeiro.html` e `solucoes.html` são gerados por `tools/build.mjs`. Uma execução posterior do build sobrescreve alterações manuais nesses HTMLs.

Altere a fonte correspondente:

- conteúdo institucional e catálogo de módulos: `tools/content.mjs`;
- estrutura da home: `tools/pages/home.mjs`;
- estrutura do portal de soluções: `tools/pages/solucoes.mjs`;
- estrutura de um módulo aprofundado: `tools/pages/<modulo>.mjs`;
- estrutura dos módulos ainda não aprofundados: `tools/pages/module.mjs`;
- identidade visual compartilhada: `assets/css/base.css`, `components.css`, `module.css` e `module-system.css`;
- visual específico de um módulo aprofundado: `assets/css/<modulo>.css`;
- comportamento no navegador: `assets/js/*.js`.

Depois, gere e valide novamente:

```powershell
Set-Location C:\infolinenovositev4
node tools/build.mjs
node tools/qa.mjs
```

## Por que os módulos compartilham uma base

PCPM, WMS, Compras, Custos, Comercial, Financeiro e CRM são áreas do mesmo ERP Infoline. Eles não devem parecer produtos de empresas diferentes.

Por isso, elementos recorrentes como hero, bento de capacidades, fluxo, tela demonstrativa, situações reais e ecossistema usam classes genéricas definidas em `assets/css/module-system.css`.

Cada módulo mantém um arquivo CSS próprio apenas para o que realmente o diferencia: painel de ordem de produção, pedido comercial, posição de estoque, cotação, composição de custos, posição financeira ou pipeline de CRM.

Essa divisão evita:

- copiar as mesmas regras para muitos arquivos;
- corrigir o mesmo problema de responsividade várias vezes;
- criar pequenas diferenças visuais involuntárias;
- transformar cada módulo em uma identidade de marca diferente;
- aumentar o custo de manutenção a cada novo módulo modernizado.

Leia a explicação completa em [docs/03-SISTEMA-DE-MODULOS.md](docs/03-SISTEMA-DE-MODULOS.md).

## Estrutura resumida

```text
infolinenovositev4/
├── assets/                 CSS, JavaScript, ícones e imagens públicas
├── docs/                   documentação de arquitetura e manutenção
├── tools/                  fonte do gerador, conteúdo e testes
│   └── pages/              templates que geram cada tipo de página
├── *.html                  páginas geradas para publicação
├── sitemap.xml             gerado pelo build
├── robots.txt              gerado pelo build
├── site.webmanifest        configuração instalável/ícones do site
└── .qa-* / .chrome-*       artefatos locais de teste, não publicar
```

## Documentação

Comece pelo [índice da documentação](docs/README.md).

- [Arquitetura e fluxo de geração](docs/01-ARQUITETURA.md)
- [Mapa e responsabilidade dos arquivos](docs/02-MAPA-DE-ARQUIVOS.md)
- [Sistema compartilhado de módulos](docs/03-SISTEMA-DE-MODULOS.md)
- [Conteúdo, SEO e integrações entre módulos](docs/04-CONTEUDO-SEO-E-INTEGRACOES.md)
- [JavaScript, formulários e métricas](docs/05-JAVASCRIPT-FORMULARIOS-E-METRICAS.md)
- [Build, testes e publicação](docs/06-BUILD-TESTES-E-PUBLICACAO.md)
- [Checklist de manutenção](docs/07-CHECKLIST-DE-MANUTENCAO.md)
- [Migração do site atual](docs/08-MIGRACAO-DO-SITE-ATUAL.md)
- [Design system](docs/09-DESIGN-SYSTEM.md)
- [Auditoria de arquitetura e regressão final da Sprint 4](docs/10-AUDITORIA-SPRINT-4.md)

## Pré-requisitos de manutenção

- Node.js 18 ou superior para gerar o site;
- Node.js 22 ou superior e Google Chrome para os testes visuais baseados no protocolo de depuração;
- um servidor HTTP simples para pré-visualização local.

O projeto não possui dependências de produção nem exige `npm install` para o build comum.

## Pré-visualização local

Depois do build, sirva a pasta pela rede local:

```powershell
Set-Location C:\infolinenovositev4
python -m http.server 4175 --bind 0.0.0.0
```

No próprio computador:

```text
http://127.0.0.1:4175/
```

Em outro dispositivo da mesma rede, use o IPv4 do computador que está executando o servidor:

```text
http://IP-DO-COMPUTADOR:4175/
```

O endereço IP pode mudar; consulte-o novamente antes de compartilhar o link.

## Fonte oficial

`C:\infolinenovositev4` é a fonte oficial de manutenção.

Os antigos pacotes duplicados por segmento foram descontinuados. Não recrie cópias completas do site para Indústria, Importadores ou Atacado. As três páginas de segmento já fazem parte do site principal e são geradas pelo mesmo build.

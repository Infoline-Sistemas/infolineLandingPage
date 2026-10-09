# Integração V4 no site Infoline

## Escopo

O pacote recebido substitui o site institucional e adiciona 20 páginas oficiais. A URL antiga `politicadeprivacidade.html` também é gerada, com o conteúdo e o canonical da política nova. As âncoras antigas da home continuam funcionando. `charlotte-paes-privacidade.html` e `tattooflow/` pertencem às políticas de aplicativos existentes na `main` e devem permanecer intactos.

A publicação atual é GitHub Pages, raiz da `main`, domínio em `CNAME`. A entrega foi preparada em branch nova baseada na `main`. Fazer push nessa branch de trabalho não publica o domínio. A publicação ocorre quando a mudança entra na `main`.

## Formulários

`config.js` mantém a chave pública Web3Forms já usada no site. Ela identifica o destino do formulário e não é senha nem token privado. `leadEndpoint`, quando configurado, tem prioridade. Sem endpoint e sem chave pública, o fallback por e-mail permanece disponível.

O Web3Forms só confirma sucesso com HTTP válido e `success: true`. Recusa cookies não impede o envio da solicitação. Dados pessoais não entram nos eventos de métricas. A candidatura abre uma mensagem no WhatsApp que o visitante ainda precisa confirmar.

Os testes interceptam Web3Forms e WhatsApp. Eles verificam comportamento, payload e retornos sem enviar mensagens reais. Recebimento efetivo pelo comercial permanece uma verificação de publicação com envio controlado autorizado.

## Consentimento

`consent.js` executa antes de `tracking.js`. As quatro propriedades do Consent Mode v2 começam negadas. Os botões permitem rejeitar opcionais, aceitar todos ou escolher estatísticas e publicidade. A escolha expira em 180 dias e pode ser reaberta no rodapé.

Sem autorização não há scripts Google/Meta nem persistência de campanhas. UTMs exigem autorização para uma finalidade de medição; identificadores de anúncios exigem publicidade. Campanhas expiram em 90 dias. A revogação remove os dados correspondentes, apaga cookies próprios conhecidos e recarrega a página se tags já estiverem inicializadas.

A CSP em `tools/head.mjs` permite scripts próprios e provedores Google/Meta configuráveis; bloqueia o beacon de `static.cloudflareinsights.com` observado no domínio atual. Essa restrição impede que a injeção do proxy contorne o banner. Os registros técnicos da hospedagem e da CDN continuam sob responsabilidade dos provedores. A injeção automática também pode ser desabilitada no painel Cloudflare, sem alterar DNS ou proteção do domínio.

## Ativação pelo responsável

1. Criar ou selecionar contas empresariais do Tag Manager, Analytics e Ads.
2. Colocar o ID público `GTM-...` em `assets/js/config.js`, mantendo `ga4Id` vazio se GA4 for carregado pelo GTM.
3. Configurar Consent Mode no container, preferencialmente com template que use `setDefaultConsentState` e `updateConsentState`. O site fornece o evento `infoline_consent_update` e os quatro estados no dataLayer. As tags precisam verificar a finalidade correspondente, inclusive as que não têm verificações nativas de consentimento.
4. Configurar GA4 e eventos: `page_view`, `module_view`, `solution_view`, `navigation_click`, `cta_click`, `whatsapp_click`, `form_start`, `form_submit`, `demo_request`, `lead_handoff` e `generate_lead`.
5. Usar `generate_lead` para sucesso confirmado; `form_submit` é tentativa e `lead_handoff` é abertura de um canal.
6. Configurar Conversion Linker e conversões Google Ads no GTM. `googleAdsId` segue reservado e não inicializa Ads diretamente.
7. Verificar recusa, autorização parcial, autorização completa e revogação no Tag Assistant/Preview e DebugView. Evitar duplicar a medição automática de páginas com o evento explícito do site.
8. Não encaminhar campos do formulário ou query strings com dados pessoais para as tags. Para page_location, usar origem e pathname.
9. Conferir a CSP ao adicionar tags ou modos de depuração. Não liberar origens arbitrárias nem `unsafe-eval` para contornar bloqueios.
10. Criar e ativar campanhas no painel Ads após definir conta, conversões, segmentação e orçamento.

O usuário confirmou que configurará as contas e enviará o GTM posteriormente. Nenhuma campanha foi criada nem ativada nesta integração.

Referências: [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent), [GTM e CSP](https://developers.google.com/tag-platform/security/guides/csp), [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/get-started/) e [guia de cookies da ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais).

## Validação e pacote

`npm run check` executa os oito QAs estruturais recebidos. `tools/runtime-qa.mjs` exige Playwright e Chrome e valida todas as páginas institucionais em 1440, 1024 e 390 px, menus, consentimento e formulários. Execute com a prévia aberta; `PLAYWRIGHT_MODULE` pode apontar para uma instalação externa do Playwright e `QA_SITE_URL` pode definir a URL local.

`npm run package` gera uma pasta pública nova em `dist/`, sem `tools/`, `docs/` ou READMEs. O pacote mantém os arquivos de aplicativos e `CNAME`. `_config.yml` fornece a mesma exclusão para a publicação atual por branch.

## Após integração à main

Verificar HTTPS, páginas, política antiga, políticas dos aplicativos, recursos, acessos V3/V3.1, consentimento e formulário. Conferir exclusão de fontes e documentação no artefato de Pages. Para rollback, reverter o commit de integração com um novo commit e aguardar a republicação; preservar a versão anterior e não forçar o histórico da `main`.

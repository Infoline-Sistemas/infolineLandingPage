# JavaScript, formulários e métricas

## 1. Organização

O projeto usa JavaScript nativo, dividido por responsabilidade. Todos os arquivos são carregados com `defer` ao final do HTML gerado.

Ordem atual:

```text
config.js
consent.js
tracking.js
navigation.js
interactions.js
forms.js
```

Essa ordem é importante: tracking e formulários leem `window.INFOLINE_CONFIG`, que precisa existir primeiro.

Na integração com GitHub Pages, `consent.js` inicializa as preferências e o Consent Mode antes de qualquer tracking. As métricas só iniciam após autorização. O formulário usa o Web3Forms existente quando `leadEndpoint` está vazio; o fallback por e-mail só ocorre se também não houver chave Web3Forms. Veja [os detalhes atuais](11-INTEGRACAO-GITHUB-PAGES.md).

## 2. `assets/js/config.js`

É o ponto único das integrações executadas no navegador.

```js
window.INFOLINE_CONFIG = {
  gtmId: '',
  ga4Id: '',
  googleAdsId: '',
  metaPixelId: '',
  leadEndpoint: '',
  web3formsAccessKey: '(chave pública existente)',
  leadCcEmail: 'comercial@infolinesystems.com.br',
  whatsapp: '5541988538135',
};
```

### Cuidados

- IDs vazios não carregam scripts externos.
- Não coloque senha, token privado ou segredo nesse arquivo; ele é público.
- Se `gtmId` estiver preenchido, o código atual usa GTM e não carrega GA4 diretamente.
- `metaPixelId` pode ser usado em paralelo.
- `googleAdsId` está reservado na configuração, mas o código atual não inicializa Google Ads diretamente. Configure conversões pelo GTM ou implemente e teste o carregamento antes de considerar esse campo ativo.

## 3. `tracking.js`

### Data layer

O arquivo cria:

```js
window.dataLayer
window.infolineTrack(nome, dados)
```

Assim, componentes podem registrar eventos sem conhecer GTM ou GA4 diretamente.

### Parâmetros de campanha

São capturados:

- `utm_source`;
- `utm_medium`;
- `utm_campaign`;
- `utm_term`;
- `utm_content`;
- `gclid`;
- `gbraid`;
- `wbraid`;
- `fbclid`.

Eles ficam em `localStorage` por até 90 dias, junto com a página de entrada. No envio do formulário, são incorporados ao payload.

### Eventos automáticos

| Evento | Momento |
|---|---|
| `page_view` | carregamento de qualquer página |
| `module_view` | página cujo `body` tem `data-page-type="module"` |
| `solution_view` | portal de soluções |
| `navigation_click` | cliques de navegação sem evento específico |

### Eventos declarados no HTML

Elementos com:

```html
data-track="cta_click"
data-label="header_demo"
```

geram um evento com nome, label e href. Use nomes estáveis; não transforme o texto visível do botão no único identificador de conversão.

## 4. `forms.js`

### Formulário de lead

Formulários com `data-lead-form` seguem este fluxo:

1. validação nativa dos campos;
2. verificação do honeypot `website`;
3. coleta dos valores via `FormData`;
4. inclusão de UTMs/click IDs, URL e horário;
5. evento `form_submit` e `demo_request`;
6. POST JSON para `leadEndpoint`, se configurado;
7. mensagem de sucesso e evento `generate_lead`.

### Fallback atual

Se `leadEndpoint` estiver vazio, o site usa o Web3Forms já configurado e exige `success: true` na resposta. Sem endpoint e sem chave Web3Forms, abre o aplicativo de e-mail com os dados preenchidos e registra `lead_handoff` com canal `mailto`, sem confirmar recebimento.

Isso é um fallback, não uma solução definitiva de captação. Ele depende de um cliente de e-mail configurado no dispositivo.

### Payload do endpoint

O endpoint deve aceitar:

```http
POST
Content-Type: application/json
```

O JSON inclui os campos do formulário, parâmetros de campanha, `page` e `submitted_at`.

O endpoint precisa:

- responder com status HTTP 2xx quando aceitar o lead;
- permitir CORS para o domínio oficial, se estiver em outro domínio;
- validar e sanitizar tudo novamente no servidor;
- aplicar proteção contra abuso/rate limit;
- registrar falhas sem expor detalhes sensíveis ao navegador;
- respeitar consentimento, retenção e política de privacidade.

O honeypot do navegador reduz bots simples, mas não substitui proteção no servidor.

### Formulários enviados ao WhatsApp

Formulários com `data-whatsapp-form`:

- validam os campos;
- montam uma mensagem com rótulos definidos no HTML;
- abrem `wa.me` em nova guia;
- registram `form_submit` e `lead_handoff`.

Esse fluxo não envia dados para um banco do site; o usuário conclui o contato no WhatsApp.

## 5. Eventos de formulário

| Evento | Significado |
|---|---|
| `form_start` | primeiro foco em campo do formulário |
| `form_submit` | tentativa válida de envio |
| `demo_request` | solicitação de demonstração iniciada |
| `lead_handoff` | visitante encaminhado para e-mail ou WhatsApp |
| `generate_lead` | endpoint confirmou o recebimento |

Não trate `form_submit` como lead recebido. Para conversão confirmada pelo endpoint, use `generate_lead`.

## 6. `navigation.js`

Controla:

- sombra do header ao rolar;
- ocultação e retorno da barra móvel de CTA;
- abertura do menu mobile e scrim;
- foco inicial e contenção de Tab no menu;
- fechamento com Escape;
- fechamento ao voltar para desktop;
- mega-menu por clique e teclado;
- combo “Sou cliente”;
- fechamento ao navegar por âncoras.

Ao alterar o HTML do menu, preserve os atributos usados como seletores:

```text
[data-header]
[data-menu-toggle]
[data-mobile-nav]
[data-nav-scrim]
[data-mobile-cta]
```

## 7. `interactions.js`

### Reveal

Elementos `.reveal` entram de forma sutil com `IntersectionObserver`. Quando o visitante prefere movimento reduzido, o conteúdo aparece sem animação.

### Demonstrações da home

`[data-demo]` controla abas e progressão automática. Interação do usuário interrompe/reinicia o ciclo de forma controlada.

### Ecossistema da home

`[data-ecosystem]` destaca uma conexão e atualiza a explicação central.

### Fluxo dos módulos

`[data-module-flow]` é um controlador genérico compartilhado por todos os módulos aprofundados. Ele atualiza textos e `aria-pressed` em hover, foco ou clique.

## 8. Privacidade e consentimento

O projeto possui uma política de privacidade, mas não inclui atualmente uma plataforma de gerenciamento de consentimento de cookies.

Antes de ativar GTM, GA4, Meta Pixel ou novas tecnologias de rastreamento, a equipe responsável deve avaliar:

- base legal aplicável;
- necessidade de consentimento prévio;
- mecanismo de opt-in/opt-out;
- atualização da política de privacidade;
- retenção dos parâmetros gravados em `localStorage`;
- contratos com os fornecedores envolvidos.

Ativar um ID em `config.js` é uma decisão de produção, não apenas uma alteração técnica.

## 9. Checklist para ativar o endpoint de lead

- endpoint criado e protegido;
- domínio e CORS configurados;
- campos e consentimento validados no servidor;
- destino do lead testado;
- mensagem de erro testada;
- `leadEndpoint` preenchido em `config.js`;
- teste real em desktop e mobile;
- confirmação de `generate_lead` no dataLayer;
- nenhum dado sensível exposto em logs do navegador;
- política de privacidade revisada.

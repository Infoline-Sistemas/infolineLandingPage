# Checklist de manutenção

Use este documento como sequência operacional para alterações futuras.

## 1. Antes de editar

- [ ] Confirmar que a pasta de trabalho é `C:\infolinenovositev4`.
- [ ] Criar backup ou usar controle de versão.
- [ ] Ler a documentação relacionada à mudança.
- [ ] Identificar o arquivo-fonte; não editar o HTML gerado.
- [ ] Confirmar a funcionalidade real do ERP quando a mudança for de produto.
- [ ] Registrar quais páginas podem ser afetadas.

## 2. Alteração de texto ou dado institucional

- [ ] Atualizar `tools/content.mjs`.
- [ ] Revisar formatos duplicados de telefone/WhatsApp.
- [ ] Revisar `assets/js/config.js` quando houver contato operacional.
- [ ] Revisar título, descrição, H1 e FAQ relacionados.
- [ ] Atualizar `site.buildDate` antes da publicação relevante.
- [ ] Executar build e QA.

## 3. Alteração visual global

- [ ] Determinar se a regra pertence a `base.css` ou `components.css`.
- [ ] Testar home, soluções, páginas de segmento e módulos.
- [ ] Testar desktop, notebook e mobile.
- [ ] Respeitar `prefers-reduced-motion`.
- [ ] Confirmar foco visível e navegação por teclado.
- [ ] Verificar contraste e legibilidade.

## 4. Alteração no sistema de módulos

- [ ] Se é comum, alterar `module-system.css`.
- [ ] Se representa uma interface particular, alterar o CSS do módulo.
- [ ] Não adicionar uma lista de nomes de módulos em seletor compartilhado.
- [ ] Não criar uma paleta de marca diferente.
- [ ] Confirmar que informativos do hero não cobrem o painel.
- [ ] Testar fluxo por hover, clique e teclado.
- [ ] Verificar tela e scroll interno no mobile.
- [ ] Executar o QA específico e `hero-overlap-qa.mjs`.

## 5. Novo módulo aprofundado

- [ ] Validar capacidades reais em `content.mjs` e fontes.
- [ ] Definir pergunta principal da página.
- [ ] Definir hero, oito capacidades e fluxo de cinco etapas.
- [ ] Criar tela principal e seis situações reais.
- [ ] Incluir somente integrações comprovadas.
- [ ] Criar `tools/pages/<modulo>.mjs`.
- [ ] Criar `assets/css/<modulo>.css`.
- [ ] Registrar o renderer em `tools/pages/module.mjs`.
- [ ] Promover o card no portal de soluções.
- [ ] Criar QA específico.
- [ ] Validar desktop e mobile.

## 6. Nova imagem

- [ ] Guardar fonte em local apropriado.
- [ ] Confirmar direito de uso.
- [ ] Evitar aparência artificial ou elementos impossíveis.
- [ ] Gerar tamanhos responsivos.
- [ ] Gerar AVIF e WebP.
- [ ] Atualizar manifest e referência.
- [ ] Informar proporção correta.
- [ ] Escrever `alt` adequado.
- [ ] Revisar recorte no desktop e mobile.

## 7. Formulário ou tracking

- [ ] Não inserir segredos em `config.js`.
- [ ] Testar endpoint e CORS.
- [ ] Confirmar mensagem de sucesso e erro.
- [ ] Diferenciar tentativa (`form_submit`) de lead recebido (`generate_lead`).
- [ ] Testar UTMs e click IDs.
- [ ] Revisar consentimento e política de privacidade.
- [ ] Validar dataLayer sem duplicidade.
- [ ] Testar fallback de e-mail/WhatsApp.

## 8. Build obrigatório

```powershell
Set-Location C:\infolinenovositev4
node tools/build.mjs
node tools/qa.mjs
```

- [ ] Build concluiu sem erro.
- [ ] QA estrutural concluiu sem erro.
- [ ] Arquivos gerados contêm a alteração.
- [ ] Nenhuma alteração foi feita apenas no HTML final.

## 9. QA visual

- [ ] 1440 px.
- [ ] 1024 px.
- [ ] 500 px.
- [ ] 390 px.
- [ ] Sem overflow horizontal da página.
- [ ] Sem texto cortado.
- [ ] Sem informativos sobre a tela principal.
- [ ] Cards e previews equilibrados.
- [ ] Menu e CTA móvel funcionando.
- [ ] Teclado e foco funcionando.
- [ ] Redução de movimento respeitada.

## 10. Antes de publicar

- [ ] Backup da versão atual.
- [ ] Homologação validada.
- [ ] `site.url`, `site.buildDate` e `site.year` corretos.
- [ ] IDs de métricas revisados.
- [ ] Endpoint de lead revisado.
- [ ] Sitemap e robots revisados.
- [ ] Mapa de redirecionamentos preparado.
- [ ] Pastas de QA, ferramentas e documentação excluídas do pacote público.
- [ ] Configuração existente do servidor preservada.
- [ ] Plano de rollback definido.

## 11. Depois de publicar

- [ ] Home e páginas principais retornam HTTP 200.
- [ ] HTTPS sem conteúdo misto.
- [ ] Imagens, ícones, CSS e JS carregam.
- [ ] Formulário testado de ponta a ponta.
- [ ] WhatsApp e acessos do cliente conferidos.
- [ ] Eventos aparecem na ferramenta de métricas.
- [ ] URLs antigas redirecionam com 301.
- [ ] `sitemap.xml` foi enviado ao Search Console, se aplicável.
- [ ] Cache/CDN invalidado.
- [ ] Produção conferida no desktop e celular.
- [ ] Backup anterior mantido até a estabilização.

## 12. Registro da alteração

Para cada publicação, registre:

```text
Data:
Responsável:
Objetivo:
Arquivos-fonte alterados:
Páginas afetadas:
Testes executados:
Versão/backup anterior:
Observações pós-publicação:
```

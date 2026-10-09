# Documentação do site Infoline

Esta pasta registra como o site foi construído, por que a arquitetura funciona dessa forma e como mantê-la sem criar versões divergentes.

## Ordem recomendada de leitura

1. [01-ARQUITETURA.md](01-ARQUITETURA.md) — visão geral, fonte versus saída gerada e fluxo do build.
2. [02-MAPA-DE-ARQUIVOS.md](02-MAPA-DE-ARQUIVOS.md) — responsabilidade de cada diretório e arquivo importante.
3. [03-SISTEMA-DE-MODULOS.md](03-SISTEMA-DE-MODULOS.md) — por que existe uma base comum e como modernizar um módulo.
4. [04-CONTEUDO-SEO-E-INTEGRACOES.md](04-CONTEUDO-SEO-E-INTEGRACOES.md) — onde manter textos, metadados, FAQs e relações entre áreas.
5. [05-JAVASCRIPT-FORMULARIOS-E-METRICAS.md](05-JAVASCRIPT-FORMULARIOS-E-METRICAS.md) — comportamentos, formulário, analytics e configuração.
6. [06-BUILD-TESTES-E-PUBLICACAO.md](06-BUILD-TESTES-E-PUBLICACAO.md) — comandos de geração, QA, prévia e envio ao servidor.
7. [07-CHECKLIST-DE-MANUTENCAO.md](07-CHECKLIST-DE-MANUTENCAO.md) — sequência curta para alterações futuras.
8. [08-MIGRACAO-DO-SITE-ATUAL.md](08-MIGRACAO-DO-SITE-ATUAL.md) — troca segura do site existente, URLs e rollback.
9. [09-DESIGN-SYSTEM.md](09-DESIGN-SYSTEM.md) — tokens, identidade, responsividade e acessibilidade.
10. [10-AUDITORIA-SPRINT-4.md](10-AUDITORIA-SPRINT-4.md) — evidências da limpeza conservadora, classificação de órfãos e regressão final.

## Princípios que não devem ser quebrados

- A raiz `C:\infolinenovositev4` é a fonte oficial do projeto.
- HTML gerado não é fonte de manutenção.
- O azul Infoline é a estrutura visual de todos os módulos.
- Cores adicionais representam estado, não marcas diferentes.
- Conteúdo de produto deve ter comprovação nos materiais do Infoline.
- Componentes repetidos pertencem à base compartilhada.
- O CSS próprio de um módulo contém somente sua representação particular.
- Toda alteração deve terminar com build, QA e inspeção responsiva.
- Pastas e capturas de QA não fazem parte do site público.

## Para quem esta documentação foi escrita

- equipe interna que atualizará textos e contatos;
- desenvolvedor responsável por criar ou modernizar módulos;
- agência ou fornecedor que fará a publicação;
- pessoa responsável por SEO, métricas e recebimento de leads;
- futuros mantenedores que precisem entender decisões já tomadas.

Quando o comportamento real do ERP mudar, atualize primeiro a documentação funcional e `tools/content.mjs`. A comunicação do site nunca deve antecipar uma funcionalidade que ainda não exista no produto.

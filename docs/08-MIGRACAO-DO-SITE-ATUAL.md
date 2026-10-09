# Migração do site atual

Este guia trata especificamente da substituição do site que já está publicado no domínio da Infoline.

## 1. Não comece enviando arquivos

Antes de alterar produção, levante:

- empresa/provedor de hospedagem;
- caminho atual do document root;
- forma de acesso: painel, SFTP, Git ou pipeline;
- regras existentes de `.htaccess`, Nginx, CDN ou proxy;
- certificado HTTPS;
- DNS e subdomínios;
- lista de URLs atualmente indexadas;
- formulários e destino atual dos leads;
- IDs de GTM, GA4, Google Ads e Meta;
- verificações de Search Console/Bing;
- arquivos que não pertencem ao site, mas vivem na mesma hospedagem;
- procedimento de backup e restauração.

## 2. Criar inventário das URLs antigas

Exporte ou liste as páginas relevantes do site atual. Para cada URL antiga, defina:

| URL antiga | Destino novo | Ação |
|---|---|---|
| `/pagina-antiga` | `/solucoes.html` | redirecionar 301 |
| `/produto-x` | `/modulo.html` | redirecionar 301 |
| URL sem equivalente | página mais próxima ou 410, após decisão de SEO | decidir |

Não redirecione todas as páginas indiscriminadamente para a home. Isso perde contexto e pode prejudicar usuários e mecanismos de busca.

As regras de redirecionamento pertencem à configuração da hospedagem, não ao gerador atual. Preserve-as em arquivo separado e documentado.

## 3. Preparar o conteúdo de produção

Antes do build final, confirme em `tools/content.mjs`:

- `site.url` com HTTPS e domínio correto;
- telefone e WhatsApp;
- e-mail comercial;
- links “Sou cliente”;
- `buildDate`;
- `year`;
- cidade/estado e informações legais.

Em `assets/js/config.js`, confirme:

- GTM ou GA4;
- Meta Pixel, se aprovado;
- endpoint real de leads;
- e-mail de fallback;
- WhatsApp.

Não publique com um endpoint de teste ou com IDs de outra propriedade.

## 4. Homologação

Publique primeiro em ambiente de homologação, por exemplo:

```text
https://novo.infolinesystems.com.br/
```

Se o ambiente for público e não deve ser indexado, proteja-o por autenticação no servidor. `noindex` ajuda, mas não substitui controle de acesso para conteúdo que ainda não deve ser divulgado.

Na homologação, teste:

- todas as páginas;
- navegação e breadcrumbs;
- acesso às versões do ERP;
- WhatsApp;
- formulário com destino real controlado;
- métricas em modo debug;
- canonical — atenção para não apontar incorretamente ao subdomínio de teste no build final;
- redirects simulados;
- desktop e mobile;
- desempenho e cache.

## 5. Pacote de publicação

Monte um pacote contendo apenas:

```text
arquivos HTML da raiz
assets/
favicons e ícone
site.webmanifest
sitemap.xml
robots.txt
```

Adicione separadamente as regras de servidor aprovadas, quando aplicável.

Não inclua:

- ferramentas do gerador;
- documentação interna;
- capturas de QA;
- perfis do Chrome;
- imagens-fonte;
- backups antigos dentro do document root.

## 6. Backup

Crie um backup recuperável que inclua:

- arquivos públicos atuais;
- `.htaccess` ou configuração equivalente;
- regras de redirects;
- configurações de formulário;
- data do backup;
- instrução exata de restauração.

Se houver banco ou CMS no site antigo, o backup deve incluir banco e uploads mesmo que o novo site seja estático.

## 7. Troca recomendada

Quando a hospedagem permitir:

1. envie o novo pacote para uma pasta de release separada;
2. valide arquivos e permissões;
3. aplique redirects e configurações;
4. altere o document root/symlink para a nova release;
5. mantenha a release anterior intacta para rollback.

Essa troca reduz o período em que produção pode ficar parcialmente atualizada.

Se a hospedagem só permitir sobrescrever arquivos, faça isso em uma janela de menor tráfego e tenha o pacote anterior pronto para restauração imediata.

## 8. Cuidados com os acessos do ERP

Os links “Sou cliente” apontam para sistemas separados do site institucional. A migração do site não deve alterar DNS, certificado ou roteamento destes endereços:

```text
erp.infolinesystems.app.br
erp.infoline.app.br
```

Confirme os links manualmente antes e depois da publicação, sem modificar a infraestrutura dos sistemas.

## 9. Dia da publicação

- congelar alterações paralelas;
- confirmar backup;
- gerar e validar o pacote final;
- registrar horário e responsável;
- executar a troca;
- testar home e páginas críticas;
- testar formulário de ponta a ponta;
- testar acessos do cliente e WhatsApp;
- conferir redirects;
- conferir métricas;
- invalidar CDN/cache;
- acompanhar erros 404/500.

## 10. SEO depois da troca

- confirmar canonical em produção;
- publicar `sitemap.xml`;
- conferir `robots.txt`;
- enviar sitemap ao Search Console;
- inspecionar home e páginas principais;
- acompanhar cobertura e páginas não encontradas;
- manter 301 antigos por longo prazo;
- não trocar URLs novas sem necessidade;
- verificar título e descrição nas páginas mais importantes.

## 11. Monitoramento inicial

Nas primeiras horas e dias, acompanhe:

- disponibilidade HTTP/HTTPS;
- erros de console e carregamento;
- leads recebidos;
- eventos de conversão;
- cliques em WhatsApp;
- 404 do servidor/Search Console;
- páginas de entrada orgânica;
- desempenho em mobile;
- relatos da equipe comercial e de clientes.

## 12. Critérios de rollback

Considere restaurar a versão anterior se ocorrer:

- indisponibilidade prolongada;
- perda do formulário sem canal alternativo;
- links de acesso do cliente incorretos;
- grande volume de 404 por redirects ausentes;
- CSS/JS não carregando por caminho ou cache;
- falha crítica de HTTPS;
- configuração de métricas ou lead enviando dados ao destino errado.

O rollback deve restaurar a release anterior e suas configurações, não apenas alguns HTMLs.

## 13. Registro pós-migração

Documente:

```text
Data e horário:
Responsável técnico:
Hospedagem/document root:
Backup anterior:
Release publicada:
Redirects aplicados:
Endpoint de lead validado:
Métricas validadas:
Problemas encontrados:
Ações pendentes:
```

import { head } from '../head.mjs';
import { header, footer, breadcrumb, appPrivacyNav } from '../layout.mjs';
import { site } from '../content.mjs';
import { esc } from '../lib.mjs';

export function renderPrivacidadeInfolineFDV() {
  const headHtml = head({
    title: 'Infoline FDV: política de privacidade e suporte',
    description: 'Privacidade do Infoline FDV para iOS e Android: acesso ao ERP, cadastros, pedidos, dados financeiros, uso offline, compartilhamento e canais de suporte.',
    path: 'infoline-fdv-privacidade.html',
  });
  const body = `
${header({ variant: 'internal' })}
${breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Privacidade do Infoline FDV' }])}
<main id="conteudo">
  <section class="section" style="padding-bottom:0;">
    <div class="container apps-policy">
      <p class="kicker">Aplicativo de força de vendas</p>
      <h1>Privacidade do Infoline FDV</h1>
      <p class="lede">Como o Infoline FDV utiliza os dados necessários para consultar clientes e produtos, registrar pedidos de venda e sincronizar informações com o ERP da sua empresa.</p>
      <p class="body-text">Última atualização: 5 de novembro de 2026.</p>
      ${appPrivacyNav('fdv')}
      <nav class="privacy-sections" aria-label="Nesta página"><a href="#privacidade">Política de privacidade</a><a href="#suporte">Suporte e solicitações sobre dados</a></nav>
    </div>
  </section>
  <section class="section" id="privacidade">
    <div class="container apps-policy">
      <h2>1. Aplicativo e responsáveis</h2>
      <p class="body-text">Esta política se aplica ao <strong>Infoline FDV</strong> para iOS e Android, disponibilizado pela <strong>${esc(site.legalName)}</strong>. O aplicativo tem finalidade empresarial e é destinado a usuários autorizados de empresas clientes do ERP Infoline. Não oferece cadastro público de contas.</p>
      <p class="body-text">A empresa cliente administra os acessos de seus usuários e os registros de sua operação. A Infoline fornece o aplicativo e o suporte à integração com o ERP. Para tratar de dados empresariais ou de pessoas cadastradas pela empresa, procure o responsável pela conta, com apoio da Infoline quando necessário.</p>

      <h2>2. Dados utilizados e finalidades</h2>
      <ul class="privacy-data-list body-text">
        <li><strong>Acesso e sessão:</strong> empresa, usuário e senha informados no login, identificadores da conta e do representante, permissões e token de autenticação, para validar e manter o acesso autorizado.</li>
        <li><strong>Cadastros comerciais:</strong> dados de clientes e agentes disponíveis no ERP ou inseridos por um usuário autorizado, como nome ou razão social, CNPJ, inscrição estadual, endereço, telefone e e-mail.</li>
        <li><strong>Operação de vendas:</strong> produtos, embalagens, preços, condições de pagamento, descontos, pedidos, itens, vencimentos e observações, para consultar informações e registrar a atividade comercial.</li>
        <li><strong>Dados financeiros da operação:</strong> títulos e valores a receber, vencimentos e condições comerciais disponibilizados para a conta, para apoiar o atendimento e a análise das vendas.</li>
        <li><strong>Atendimento:</strong> dados e informações que você optar por enviar ao suporte, para investigar o problema e responder à solicitação.</li>
      </ul>
      <p class="body-text">Os dados acessíveis variam conforme a empresa, a configuração do ERP e as permissões da conta. O tratamento descrito nesta política atende à autenticação, à execução do serviço contratado, à sincronização dos registros e ao suporte. Obrigações legais e o exercício de direitos também podem justificar a manutenção de determinados registros, conforme o caso.</p>

      <h2>3. Comunicação, consultas e compartilhamento</h2>
      <p class="body-text">O aplicativo se comunica por HTTPS com os serviços do ERP em <strong>erp.infolinesystems.app.br</strong>. O login é enviado para autenticação; o token da sessão identifica as consultas e sincronizações seguintes. Os registros de vendas e os cadastros são enviados ao ERP da empresa para a execução dessas funções.</p>
      <p class="body-text">Ao utilizar as consultas de CNPJ e CEP no cadastro, o identificador informado pode ser enviado aos serviços da <strong>CNPJá</strong> (api.cnpja.com ou open.cnpja.com) e do <strong>ViaCEP</strong> (viacep.com.br), respectivamente, para obter os dados cadastrais ou de endereço. Esses serviços e os provedores de infraestrutura podem tratar os dados técnicos necessários à conexão e estão sujeitos às suas próprias políticas.</p>
      <p class="body-text">Se você usar os recursos de abrir ou compartilhar arquivos, o documento será entregue ao aplicativo ou destinatário escolhido por você. Confira o conteúdo e o destinatário antes de compartilhar informações comerciais ou pessoais.</p>
      <p class="body-text">O Infoline FDV não inclui SDKs de anúncios nem recursos de rastreamento publicitário entre aplicativos. A distribuição e a atualização pela App Store ou pelo Google Play seguem também as políticas da Apple e do Google. A infraestrutura dos serviços pode manter registros técnicos, como endereço IP e informações de acesso, necessários ao funcionamento e à segurança.</p>

      <h2>4. Armazenamento no aparelho e uso offline</h2>
      <p class="body-text">O app mantém dados da conta, token de sessão, preferências e informações da última carga no aparelho. Um banco de dados local armazena os cadastros, produtos, preços, condições de pagamento, títulos e pedidos utilizados pela conta para permitir o trabalho offline após a carga inicial.</p>
      <p class="body-text">Pedidos criados offline precisam ser sincronizados para chegar ao ERP. As informações locais permanecem no dispositivo até sua atualização, remoção ou limpeza pelos recursos do aplicativo ou do sistema operacional. A função <strong>Resetar</strong> remove o banco local e os dados de sessão; ela pode apagar pedidos ainda não enviados. Confirme a sincronização antes de utilizá-la.</p>
      <p class="body-text">Limpar os dados locais ou desinstalar o aplicativo não exclui os registros já enviados ao ERP. O app não oferece exclusão da conta empresarial: a administração do acesso cabe ao responsável da empresa cliente.</p>

      <h2>5. Segurança e conservação</h2>
      <p class="body-text">O acesso utiliza credenciais e token de autenticação e a comunicação com o ERP ocorre por HTTPS. Proteja o aparelho com os recursos do sistema operacional, mantenha o app atualizado e não compartilhe suas credenciais.</p>
      <p class="body-text">Os registros mantidos nos servidores seguem as finalidades do serviço, as regras da empresa responsável pela operação e as obrigações legais aplicáveis. O prazo de conservação varia conforme o tipo de registro e a finalidade; os dados não precisam ser eliminados quando houver fundamento aplicável para sua manutenção. Você pode solicitar esclarecimentos sobre um registro ou sobre sua conservação pelos canais abaixo.</p>

      <h2>6. Seus direitos e contato</h2>
      <p class="body-text">Você pode solicitar informações sobre o tratamento de seus dados pessoais e exercer os direitos previstos na Lei Geral de Proteção de Dados Pessoais (LGPD), incluindo confirmação do tratamento, acesso, correção e eliminação quando aplicável, além de informações sobre compartilhamento e demais direitos pertinentes ao caso.</p>
      <p class="body-text">Envie sua solicitação para <a href="mailto:suporte@infolinesystems.com.br">suporte@infolinesystems.com.br</a> ou fale com o responsável pela conta na sua empresa. Informe a empresa e o contexto do pedido. A confirmação de identidade e o encaminhamento à empresa responsável podem ser necessários para proteger os dados e atender corretamente à solicitação. Não envie senhas.</p>

      <h2>7. Público e atualizações</h2>
      <p class="body-text">O Infoline FDV é uma ferramenta de uso empresarial, destinada a usuários autorizados das empresas clientes, e não é direcionado a crianças. Esta política poderá ser atualizada quando houver mudanças no aplicativo ou no tratamento de dados; a data de revisão aparecerá no início da página.</p>
      <p class="body-text">Esta política descreve o Infoline FDV. A navegação nesta página segue a <a href="politica-de-privacidade.html">Política de Privacidade do Site</a> e as preferências de cookies disponíveis no rodapé.</p>
    </div>
  </section>
  <section class="section" id="suporte">
    <div class="container apps-policy">
      <p class="kicker">Suporte do Infoline FDV</p>
      <h2>Precisa de ajuda?</h2>
      <p class="body-text">Entre em contato pelo e-mail <a href="mailto:suporte@infolinesystems.com.br">suporte@infolinesystems.com.br</a> ou pelo telefone <a href="tel:${site.tel}">${esc(site.phoneDisplay)}</a>. Informe a empresa, a versão do app, o modelo do aparelho e o problema observado, sem incluir senhas ou documentos confidenciais.</p>
      <p class="body-text">Para acessar o app, use a empresa, o usuário e a senha fornecidos pelo administrador do ERP. Após o primeiro login, execute a carga de dados antes de iniciar a operação offline. Caso não tenha acesso, solicite ao responsável da sua empresa a verificação do cadastro e das permissões.</p>
    </div>
  </section>
</main>
${footer()}`;
  return { headHtml, body, styles: ['privacy.css'], pageType: 'fdv-app-privacy' };
}

import { head } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';

export function renderPrivacidadeInfolineMobile() {
  const headHtml = head({
    title: 'Infoline para iOS e Android: privacidade e suporte',
    description: 'Política de privacidade e suporte do aplicativo Infoline: acesso ao ERP, dados dos painéis, sessão opcional, armazenamento local e canais de atendimento.',
    path: 'infoline-privacidade.html',
  });
  const body = `
${header({ variant: 'internal' })}
${breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Privacidade do app Infoline' }])}
<main id="conteudo">
  <section class="section" style="padding-bottom:0;">
    <div class="container" style="max-width:760px;">
      <p class="kicker">Aplicativo Infoline</p>
      <h1>Privacidade e suporte</h1>
      <p class="lede">Como o aplicativo Infoline para iOS e Android utiliza os dados necessários para acessar os painéis do ERP da sua empresa.</p>
      <p class="body-text">Última atualização: 30 de outubro de 2026.</p>
      <nav aria-label="Nesta página"><a href="#privacidade">Política de privacidade</a> · <a href="#suporte">Falar com o suporte</a></nav>
    </div>
  </section>
  <section class="section" id="privacidade">
    <div class="container" style="max-width:760px; display:grid; gap:28px;">
      <div>
        <h2>1. Aplicativo e responsáveis</h2>
        <p class="body-text">Esta política se aplica ao aplicativo <strong>Infoline</strong>, disponibilizado pela Infoline Fábrica de Softwares Ltda para usuários autorizados de empresas que utilizam o ERP Infoline. O app não oferece cadastro público de contas. O acesso é concedido e administrado pelos responsáveis pelo ERP e pela empresa cliente.</p>
        <p class="body-text">A empresa cliente administra os dados de sua operação e os acessos de seus usuários. Solicitações relativas aos registros empresariais devem ser encaminhadas ao responsável da empresa, com apoio da Infoline quando necessário. O contato de suporte do aplicativo é <a href="mailto:ncampos48@gmail.com">ncampos48@gmail.com</a>.</p>
      </div>
      <div>
        <h2>2. Dados utilizados</h2>
        <p class="body-text">Para autenticar o acesso, o app envia empresa, usuário e senha ao servidor do ERP correspondente. Após o login, utiliza o identificador da conta, um token de sessão e as permissões retornadas pelo ERP. A senha não é gravada pelo aplicativo.</p>
        <p class="body-text">Conforme as permissões da conta, o app consulta e apresenta faturamento, metas, resultados, representantes, grupos de agentes e informações de clientes, como razão social, CNPJ, cidade e UF. Filtros e parâmetros de consulta são enviados ao ERP para obter os recortes solicitados.</p>
        <p class="body-text">Esses dados são utilizados para autenticação, controle de acesso e apresentação do Painel Diretor e do Dashboard de Desempenho. O aplicativo não utiliza esses registros para publicidade ou criação de perfis publicitários.</p>
      </div>
      <div>
        <h2>3. Comunicação e destinatários</h2>
        <p class="body-text">As consultas são feitas por HTTPS aos serviços do ERP configurados para a empresa: <strong>erp.infolinesystems.app.br</strong>, <strong>erp.givimobili.app.br</strong> ou <strong>erp.charlottepaes.com.br</strong>. Os serviços e sua infraestrutura podem tratar dados técnicos da conexão, como endereço IP e registros de acesso, necessários ao funcionamento e à segurança.</p>
        <p class="body-text">O app não inclui SDKs de anúncios, rastreamento entre aplicativos ou análise de comportamento. Não solicita acesso à localização, câmera, microfone, fotos ou agenda de contatos. Apple e Google administram a distribuição e a atualização do app conforme suas próprias políticas.</p>
      </div>
      <div>
        <h2>4. O que fica no aparelho</h2>
        <p class="body-text">A última empresa informada é lembrada para facilitar o próximo login. A opção <strong>Manter conectado</strong> começa desligada. Quando marcada, salva somente a identidade da conta, o token, o servidor e a versão do registro no armazenamento protegido do sistema: Keychain no iOS e arquivo criptografado com chave do Android Keystore no Android.</p>
        <p class="body-text">Sem essa opção, a sessão permanece apenas na memória durante a execução do app. Minimizar e retomar o aplicativo mantém a conta em memória e revalida o acesso; encerrar e iniciar uma nova execução exige login. Entrar com a opção desligada remove uma sessão anteriormente salva.</p>
        <p class="body-text">O app não mantém banco local nem cache persistente dos relatórios empresariais. Os dados consultados são retirados da tela ao atualizar, entrar em segundo plano ou encerrar a sessão e dependem de nova validação online.</p>
      </div>
      <div>
        <h2>5. Segurança, retenção e exclusão</h2>
        <p class="body-text">As permissões são verificadas pelo ERP durante as consultas. O app usa os recursos de proteção de credenciais do sistema operacional e comunicação HTTPS; mantenha o aparelho e sua conta protegidos e não compartilhe suas credenciais.</p>
        <p class="body-text">Use <strong>Conta → Sair da conta</strong> para encerrar o acesso e remover a sessão salva. Sessões invalidadas pelo ERP também exigem um novo login. A remoção da sessão ou a desinstalação do app não apaga os registros existentes no ERP.</p>
        <p class="body-text">Os registros corporativos e os dados de acesso mantidos nos servidores seguem as finalidades do serviço, as regras da empresa responsável e as obrigações legais aplicáveis. Solicitações de acesso, correção ou eliminação devem ser direcionadas ao responsável pela conta na empresa ou ao suporte. Não há criação nem exclusão de contas pelo aplicativo.</p>
      </div>
      <div>
        <h2>6. Atendimento e direitos</h2>
        <p class="body-text">Você pode solicitar informações sobre o tratamento de seus dados pessoais e exercer os direitos previstos na LGPD, incluindo acesso, correção e eliminação quando aplicável. Entre em contato pelo e-mail <a href="mailto:ncampos48@gmail.com">ncampos48@gmail.com</a> e informe a empresa e o contexto da solicitação, sem enviar senhas.</p>
        <p class="body-text">Se entrar em contato por e-mail, as informações da mensagem serão utilizadas para atender à solicitação. O provedor de e-mail pode processar a mensagem e os dados técnicos necessários ao serviço. As mensagens são mantidas enquanto necessárias ao atendimento e às obrigações aplicáveis.</p>
      </div>
      <div>
        <h2>7. Público e alterações</h2>
        <p class="body-text">O Infoline tem finalidade empresarial e é destinado aos usuários autorizados das empresas clientes; não é direcionado a crianças. Esta página poderá ser atualizada quando houver mudanças nas funcionalidades ou no tratamento de dados, com revisão da data de atualização.</p>
        <p class="body-text">Esta política descreve o aplicativo móvel. A navegação neste site segue também a <a href="politica-de-privacidade.html">Política de Privacidade do Site</a> e as preferências de cookies disponíveis no rodapé.</p>
      </div>
    </div>
  </section>
  <section class="section" id="suporte">
    <div class="container" style="max-width:760px;">
      <p class="kicker">Suporte do aplicativo</p>
      <h2>Precisa de ajuda?</h2>
      <p class="body-text">Escreva para <a href="mailto:ncampos48@gmail.com">ncampos48@gmail.com</a>. Informe a versão do app, o modelo do aparelho, a empresa e o problema observado. Não envie senha ou relatórios com informações confidenciais para explicar o problema.</p>
      <p class="body-text">Se uma tela não estiver disponível, peça ao responsável pelo ERP que confira as permissões de sua conta. O aplicativo utiliza o usuário e a senha já fornecidos à sua empresa e não realiza autocadastro.</p>
    </div>
  </section>
</main>
${footer()}`;
  return { headHtml, body, styles: ['privacy.css'], pageType: 'mobile-app-privacy' };
}

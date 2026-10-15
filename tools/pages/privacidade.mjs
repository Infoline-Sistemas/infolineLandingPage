import { esc } from '../lib.mjs';
import { head } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';
import { site } from '../content.mjs';

export function renderPrivacidade() {
  const title = 'Política de Privacidade do Site | Infoline';
  const description = 'Política de privacidade da Infoline: dados enviados nos formulários, cookies, preferências de estatísticas e publicidade e canais para exercer seus direitos.';
  const headHtml = head({ title, description, path: 'politica-de-privacidade.html', noindex: false });

  const bc = breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Privacidade do site' }]);

  const body = `
${header({ variant: 'internal' })}
${bc}
<main id="conteudo">
  <section class="section" style="padding-bottom:0;">
    <div class="container" style="max-width:760px;">
      <p class="kicker">Privacidade</p>
      <h1>Política de Privacidade do Site</h1>
      <p class="lede">Conheça o uso dos dados enviados a este site, suas escolhas de cookies e os canais para exercer os direitos previstos na Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
    </div>
  </section>
  <section class="section">
    <div class="container" style="max-width:760px; display:grid; gap:28px;">
      <div>
        <h2 style="font-size:22px;">1. Quem trata os seus dados</h2>
        <p class="body-text">Os dados coletados por este site são tratados pela ${esc(site.legalName)} ("Infoline"), controladora dos dados pessoais para os fins descritos nesta política. Em caso de dúvida, entre em contato pelo e-mail <a href="mailto:${site.email}" style="color:var(--blue); font-weight:700;">${esc(site.email)}</a> ou pelo telefone ${esc(site.phoneDisplay)}.</p>
        <p class="body-text">Endereço: ${esc(site.address.streetAddress)}, CEP ${esc(site.address.postalCode)}, ${esc(site.address.city)}/${esc(site.address.region)}, Brasil.</p>
      </div>
      <div>
        <h2 style="font-size:22px;">2. Quais dados coletamos</h2>
        <p class="body-text">Coletamos os dados que você fornece diretamente nos formulários do site — como nome, nome da empresa, e-mail e telefone/WhatsApp — quando solicita uma demonstração, envia uma candidatura ou entra em contato pelos canais disponíveis (formulário, WhatsApp, telefone ou e-mail).</p>
        <p class="body-text">A candidatura também pode incluir experiência profissional, mensagem e link de currículo ou LinkedIn. Dados de navegação e origem da campanha (UTMs e identificadores de anúncios) são armazenados somente quando você autoriza a finalidade correspondente nas preferências de cookies.</p>
      </div>
      <div>
        <h2 style="font-size:22px;">3. Para que usamos os dados</h2>
        <p class="body-text">Usamos os dados fornecidos para responder à sua solicitação de contato, apresentar as soluções Infoline, agendar demonstrações, avaliar candidaturas e, quando aplicável, dar continuidade a um relacionamento comercial.</p>
      </div>
      <div>
        <h2 style="font-size:22px;">4. Compartilhamento</h2>
        <p class="body-text">Não vendemos dados pessoais a terceiros. Os dados podem ser tratados por ferramentas de tecnologia utilizadas pela Infoline (como plataformas de e-mail, telefonia e mensageria) estritamente para viabilizar o contato solicitado.</p>
        <p class="body-text">O formulário de demonstração usa o Web3Forms para encaminhar sua solicitação. A candidatura é preparada para envio pelo WhatsApp e só é encaminhada quando você confirma a mensagem nesse serviço. Esses fornecedores podem processar dados fora do Brasil e possuem suas próprias políticas de privacidade.</p>
        <p class="body-text">Se configuradas e autorizadas, ferramentas do Google (Tag Manager, Analytics e Ads) e da Meta podem receber dados de navegação e conversão. O código de eventos do site não envia nome, e-mail, telefone ou conteúdo dos formulários para essas ferramentas.</p>
      </div>
      <div>
        <h2 style="font-size:22px;">5. Seus direitos</h2>
        <p class="body-text">Nos termos da LGPD, você pode solicitar a qualquer momento a confirmação de tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos seus dados pessoais, bem como revogar consentimentos dados anteriormente. Para exercer esses direitos, entre em contato pelo e-mail <a href="mailto:${site.email}" style="color:var(--blue); font-weight:700;">${esc(site.email)}</a>.</p>
      </div>
      <div>
        <h2 style="font-size:22px;">6. Retenção e segurança</h2>
        <p class="body-text">Mantemos os dados pelo tempo necessário para cumprir as finalidades descritas nesta política ou obrigações legais aplicáveis, adotando medidas técnicas e organizacionais razoáveis para proteger essas informações.</p>
      </div>
      <div>
        <h2 style="font-size:22px;">7. Cookies e armazenamento local</h2>
        <p class="body-text">O armazenamento necessário registra apenas sua escolha de privacidade (infoline_cookie_consent), por até 180 dias. Estatísticas e publicidade começam desativadas. Você pode aceitar todos, rejeitar os opcionais ou autorizar cada finalidade separadamente. A recusa não impede a navegação, o contato comercial ou a candidatura.</p>
        <p class="body-text">Com autorização para estatísticas, guardamos parâmetros de origem da campanha por até 90 dias. Identificadores de anúncios, como gclid e fbclid, exigem autorização para publicidade. Esses dados ficam no armazenamento local do navegador (infoline_campaign_params) e podem acompanhar sua solicitação de demonstração.</p>
        <p class="body-text">Ferramentas de métricas ou anúncios só são carregadas quando seus identificadores estão configurados e há autorização para a finalidade correspondente. Elas podem criar cookies próprios conforme a configuração de cada plataforma. Ao revogar uma finalidade, o site interrompe suas tags opcionais e remove os cookies próprios conhecidos dessa categoria e os parâmetros de campanha correspondentes.</p>
        <p class="body-text"><button type="button" class="cookie-settings-link" data-cookie-settings style="color:var(--blue);text-decoration:underline;">Abrir preferências de cookies</button>. Você também pode apagar dados de navegação nas configurações do seu navegador. Cookies de serviços externos, como o WhatsApp, são administrados pelos próprios serviços.</p>
      </div>
      <div>
        <h2 style="font-size:22px;">8. Alterações desta política</h2>
        <p class="body-text">Esta política pode ser atualizada para refletir mudanças legais ou nas práticas da Infoline. A data da última atualização é ${new Date(site.buildDate + 'T12:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: 'long', year: 'numeric' })}.</p>
      </div>
    </div>
  </section>
</main>
${footer()}`;

  return { headHtml, body, pageType: 'privacy' };
}

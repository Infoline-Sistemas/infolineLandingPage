import { icon } from '../lib.mjs';
import { head, orgSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';

export function renderTrabalhe() {
  const title = 'Trabalhe Conosco | Infoline Sistemas de Gestão Empresarial';
  const description = 'Envie sua candidatura para trabalhar na Infoline: desenvolvimento, suporte e implantação, comercial ou administrativo/financeiro.';
  const headHtml = head({ title, description, path: 'trabalhe-conosco.html', schemas: [orgSchema()] });

  const bc = breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Trabalhe conosco' }]);

  const fieldLabels = JSON.stringify({
    nome: 'Nome', email: 'E-mail', telefone: 'Telefone/WhatsApp', area: 'Área de interesse',
    experiencia: 'Experiência', perfil: 'Currículo/LinkedIn', mensagem: 'Mensagem',
  });

  const body = `
${header({ variant: 'internal' })}
${bc}
<main id="conteudo">
  <section class="mod-hero">
    <div class="container" style="max-width:760px;">
      <p class="kicker">Trabalhe conosco</p>
      <h1>Construa o próximo capítulo da Infoline.</h1>
      <p class="lede">Buscamos profissionais que acreditam em tecnologia útil, relações próximas e evolução contínua — em desenvolvimento, suporte e implantação, comercial ou administrativo/financeiro.</p>
    </div>
  </section>

  <section class="section">
    <div class="container contact-grid">
      <div class="contact-side reveal">
        <h2>Conte sua trajetória e o que você busca construir.</h2>
        <p class="body-text">Preencha suas informações abaixo. Ao enviar, abrimos uma conversa no WhatsApp com sua apresentação já organizada — você confirma e envia diretamente para a Infoline.</p>
        <ul class="feature-list" style="margin-top:20px;">
          <li>${icon('i-check', 'i')}<span>Dados para contato</span></li>
          <li>${icon('i-check', 'i')}<span>Área de interesse e experiência</span></li>
          <li>${icon('i-check', 'i')}<span>Link de currículo ou LinkedIn, se disponível</span></li>
        </ul>
      </div>
      <form class="contact-form reveal" id="career-form" data-whatsapp-form data-field-labels='${fieldLabels}' novalidate>
        <h3>Formulário de candidatura</h3>
        <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="field field-full" data-field>
          <label for="t-nome">Nome completo</label>
          <input id="t-nome" name="nome" type="text" required placeholder="Como você gostaria de ser chamado?" autocomplete="name">
          <span class="field-error">Informe seu nome.</span>
        </div>
        <div class="field" data-field>
          <label for="t-email">E-mail</label>
          <input id="t-email" name="email" type="email" required placeholder="voce@email.com" autocomplete="email">
          <span class="field-error">Informe um e-mail válido.</span>
        </div>
        <div class="field" data-field>
          <label for="t-tel">Telefone / WhatsApp</label>
          <input id="t-tel" name="telefone" type="tel" required placeholder="(00) 00000-0000" autocomplete="tel">
          <span class="field-error">Informe um telefone.</span>
        </div>
        <div class="field field-full" data-field>
          <label for="t-area">Área de interesse</label>
          <select id="t-area" name="area" required>
            <option value="">Selecione uma área</option>
            <option>Desenvolvimento</option>
            <option>Suporte e implantação</option>
            <option>Comercial</option>
            <option>Administrativo / financeiro</option>
            <option>Outra oportunidade</option>
          </select>
          <span class="field-error">Selecione uma área.</span>
        </div>
        <div class="field field-full" data-field>
          <label for="t-exp">Experiência profissional</label>
          <textarea id="t-exp" name="experiencia" rows="4" required placeholder="Conte brevemente suas experiências, conhecimentos e resultados que considera importantes."></textarea>
          <span class="field-error">Conte um pouco da sua experiência.</span>
        </div>
        <div class="field field-full">
          <label for="t-perfil">Currículo ou LinkedIn (opcional)</label>
          <input id="t-perfil" name="perfil" type="url" placeholder="https://linkedin.com/in/seu-perfil ou link do currículo">
        </div>
        <div class="field field-full">
          <label for="t-msg">Mensagem para a Infoline (opcional)</label>
          <textarea id="t-msg" name="mensagem" rows="3" placeholder="Por que você gostaria de fazer parte da Infoline?"></textarea>
        </div>
        <div class="form-status field-full" data-form-status role="status" aria-live="polite" aria-atomic="true"></div>
        <label class="consent field-full" data-field><input type="checkbox" name="consentimento" required><span>Autorizo o uso dos dados informados para avaliar minha candidatura e entrar em contato, conforme a <a href="politica-de-privacidade.html">política de privacidade</a>.<span class="field-error">Confirme a autorização para continuar.</span></span></label>
        <button class="button button-primary button-block field-full" type="submit">Continuar candidatura no WhatsApp</button>
        <p class="field-hint field-full">O envio abre o WhatsApp com os dados preenchidos; você confirma a mensagem antes de encaminhar.</p>
      </form>
    </div>
  </section>
</main>
${footer()}`;

  return { headHtml, body, styles: ['module.css'], pageType: 'careers' };
}

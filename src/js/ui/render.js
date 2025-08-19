import { $, escapeHTML } from '../utils/dom.js';

const box = $('#res');

export function setLoading() {
  box.innerHTML = `<div class="card loading">Validando...</div>`;
}

export function clearResult() {
  box.innerHTML = '';
}

export function renderError(msg) {
  box.innerHTML = `
    <div class="card err">
      <strong>Erro:</strong> ${escapeHTML(msg || 'Falha na verificação')}
    </div>
  `;
}

export function renderInvalid() {
  box.innerHTML = `
    <div class="card err">
      <h3>❌ Não encontrado ou inválido</h3>
      <p>Confira o ID e o CPF informados.</p>
    </div>
  `;
}

export function renderValid(data) {
  const certId = escapeHTML(data.cert_id ?? '-');
  const nome = escapeHTML(data.nome ?? '-');
  const emitido = escapeHTML(data.emitido_em ?? '-');
  const status = escapeHTML(data.status ?? 'ativo');
  const pdf = data.pdf_url ? `<p><a href="${escapeHTML(data.pdf_url)}" target="_blank" rel="noopener">Baixar certificado</a></p>` : '';

  box.innerHTML = `
    <div class="card ok">
      <h3>✅ Certificado válido</h3>
      <p><strong>ID:</strong> ${certId}</p>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Emitido em:</strong> ${emitido}</p>
      <p><strong>Status:</strong> ${status}</p>
      ${pdf}
    </div>
  `;
}

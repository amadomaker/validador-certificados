// src/js/app.js
import { $, onlyDigits, maskCPF } from './utils/dom.js';
import { verifySigned, verifyWithCpf } from './services/api.js';
import { setLoading, clearResult, renderError, renderInvalid, renderValid } from './ui/render.js';
import { initMobileMenu } from './ui/menu.js';

// Referências
const form = $('#f');
const inputId = $('#id');
const inputCpf = $('#cpf');
const btnClear = $('#clear');
const btnSubmit = $('#btn');

// Helpers de UI para CPF (quando vier via QR não pedimos CPF)
function hideCpfField() {
  if (!inputCpf) return;
  const row = inputCpf.closest('.form-group') || inputCpf.closest('.row') || inputCpf.parentElement;
  if (row) row.style.display = 'none';
  inputCpf.disabled = true;
}
function showCpfField() {
  if (!inputCpf) return;
  const row = inputCpf.closest('.form-group') || inputCpf.closest('.row') || inputCpf.parentElement;
  if (row) row.style.display = '';
  inputCpf.disabled = false;
}

// Limpar
btnClear?.addEventListener('click', () => {
  inputId.value = '';
  inputCpf.value = '';
  showCpfField();
  clearResult();
  inputId.focus();
});

// Máscara de CPF (visual) sem interferir na captura de dígitos
inputCpf?.addEventListener('input', () => {
  const caret = inputCpf.selectionStart;
  const beforeLen = inputCpf.value.length;
  inputCpf.value = maskCPF(inputCpf.value);
  const afterLen = inputCpf.value.length;
  const diff = afterLen - beforeLen;
  inputCpf.setSelectionRange(caret + diff, caret + diff);
});

// Submit (fluxo com CPF → POST JSON)
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = inputId.value.trim().toUpperCase();
  const cpfDigits = onlyDigits(inputCpf.value);

  if (!id) {
    renderError('Informe o ID do certificado.');
    inputId.focus();
    return;
  }
  if (cpfDigits.length !== 11) {
    renderError('CPF deve conter 11 dígitos.');
    inputCpf.focus();
    return;
  }

  setLoading();
  if (btnSubmit) btnSubmit.disabled = true;

  try {
    const data = await verifyWithCpf(id, cpfDigits);

    if (!data?.ok) {
      renderError(data?.error || 'Falha na verificação.');
      return;
    }
    if (data.valid) {
      renderValid(data);
    } else {
      renderInvalid();
    }
  } catch (err) {
    renderError(err?.message || 'Erro inesperado.');
  } finally {
    if (btnSubmit) btnSubmit.disabled = false;
  }
});

// --- Auto-validação por querystring (QR assinado: ?id=...&s=...) ---
(function autoFromQuery() {
  const p = new URLSearchParams(location.search);
  const id = (p.get('id') || '').toUpperCase();
  const s  = p.get('s') || '';

  if (id) inputId.value = id;

  // Se veio assinatura, escondemos o CPF e validamos automaticamente (GET assinado)
  if (id && s) {
    hideCpfField();
    setLoading();
    if (btnSubmit) btnSubmit.disabled = true;

    verifySigned(id, s)
      .then((data) => {
        if (data?.ok && data.valid) {
          renderValid(data);
        } else if (data && data.ok === false) {
          renderError(data.error || 'Erro na validação.');
        } else {
          renderInvalid();
        }
      })
      .catch(() => {
        renderError('Falha de rede na validação.');
      })
      .finally(() => {
        if (btnSubmit) btnSubmit.disabled = false;
      });
  }
})();

initMobileMenu();
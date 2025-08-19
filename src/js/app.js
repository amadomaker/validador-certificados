import { $, onlyDigits, maskCPF } from './utils/dom.js';
import { validateCertificate } from './services/api.js';
import { setLoading, clearResult, renderError, renderInvalid, renderValid } from './ui/render.js';



// Referências
const form = $('#f');
const inputId = $('#id');
const inputCpf = $('#cpf');
const btnClear = $('#clear');
const btnSubmit = $('#btn');

// Limpar
btnClear.addEventListener('click', () => {
  inputId.value = '';
  inputCpf.value = '';
  clearResult();
  inputId.focus();
});

// Máscara de CPF (visual) sem interferir na captura de dígitos
inputCpf.addEventListener('input', () => {
  const caret = inputCpf.selectionStart;
  const beforeLen = inputCpf.value.length;
  inputCpf.value = maskCPF(inputCpf.value);
  const afterLen = inputCpf.value.length;
  const diff = afterLen - beforeLen;
  inputCpf.setSelectionRange(caret + diff, caret + diff);
});

// Submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = inputId.value.trim();
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
  btnSubmit.disabled = true;

  try {
    const data = await validateCertificate({ id, cpf: cpfDigits });

    if (!data?.ok) {
      renderError(data?.error || 'Falha na verificação');
      return;
    }
    if (data.valid) {
      renderValid(data);
    } else {
      renderInvalid();
    }
  } catch (err) {
    renderError(err.message);
  } finally {
    btnSubmit.disabled = false;
  }
});

// --- Auto-preencher por querystring (QR Code amigável) ---
(function autoFill() {
  const p = new URLSearchParams(location.search);
  const id = p.get('id');
  const cpf = p.get('cpf');

  if (id) inputId.value = id;
  if (cpf) inputCpf.value = maskCPF(cpf);

  if (id && cpf) {
    // dispara submissão automática
    setTimeout(() => form.dispatchEvent(new Event('submit')), 0);
  }
})();


import { initMobileMenu } from './ui/menu.js';
initMobileMenu();
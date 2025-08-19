// Utilidades de DOM e formatação

export const $ = (sel, root = document) => root.querySelector(sel);

export const onlyDigits = (s) => (s || '').replace(/\D+/g, '');

export const maskCPF = (value) => {
  const digits = onlyDigits(value).slice(0, 11);
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 3));
  if (digits.length > 3) parts.push(digits.slice(3, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 9));
  let masked = parts
    .map((p, idx) => (idx < 2 ? p : p)) // só organiza
    .join('.');
  if (digits.length > 9) masked += '-' + digits.slice(9, 11);
  return masked;
};

export const escapeHTML = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

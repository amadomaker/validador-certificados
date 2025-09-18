import { API_URL } from '../config.js';

// Fluxo ASSINADO (QR): GET ?id=<cert_id>&s=<assinatura>
export async function verifySigned(id, s) {
  const url = `${API_URL}?id=${encodeURIComponent((id || '').toUpperCase())}&s=${encodeURIComponent(s || '')}`;
  const res = await fetch(url, { method: 'GET', credentials: 'omit' });
  return res.json();
}

// Fluxo com CPF (form): POST "simple request" para evitar preflight CORS
export async function verifyWithCpf(id, cpf) {
  const payload = {
    id: String(id || '').trim().toUpperCase(),
    cpf: String(cpf || '').replace(/\D+/g, '')
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    // <- texto plano evita o preflight OPTIONS
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(payload),
    credentials: 'omit'
  });

  return res.json();
}

import { API_BASE } from '../config.js';

export async function validateCertificate({ id, cpf }) {
  const url = new URL(API_BASE);
  url.searchParams.set('id', id);
  url.searchParams.set('cpf', cpf);

  const r = await fetch(url.toString(), { method: 'GET' });
  if (!r.ok) {
    throw new Error(`HTTP ${r.status}`);
  }
  const data = await r.json();
  // Normaliza resposta esperada
  return data;
}

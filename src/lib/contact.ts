import { serviceLabel, type ServiceValue } from './services';

export type { ServiceValue };

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;
export const FORMSPREE_ENDPOINT_RE = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/;

export interface ContactValues {
  nombre: string;
  email: string;
  empresa: string;
  servicio: ServiceValue;
  mensaje: string;
  privacidad: boolean;
  honeypot: string;
}

export type ContactField = 'nombre' | 'email' | 'mensaje' | 'privacidad';
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Quita los espacios de los extremos; no toca los saltos de línea internos. */
export function normalizeContact(v: ContactValues): ContactValues {
  return {
    ...v,
    nombre: v.nombre.trim(),
    email: v.email.trim(),
    empresa: v.empresa.trim(),
    mensaje: v.mensaje.trim(),
    honeypot: v.honeypot.trim(),
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateContact(v: ContactValues): ContactErrors {
  const n = normalizeContact(v);
  const errors: ContactErrors = {};
  if (n.nombre === '') errors.nombre = 'Escribe tu nombre.';
  if (n.email === '') errors.email = 'Escribe tu email.';
  else if (!isValidEmail(n.email))
    errors.email = 'El email no parece válido. Ejemplo: nombre@empresa.es';
  if (n.mensaje === '') errors.mensaje = 'Escribe tu mensaje.';
  else if (n.mensaje.length < MESSAGE_MIN)
    errors.mensaje = `El mensaje es demasiado corto: escribe al menos ${MESSAGE_MIN} caracteres.`;
  else if (n.mensaje.length > MESSAGE_MAX)
    errors.mensaje = `El mensaje es demasiado largo: máximo ${MESSAGE_MAX} caracteres.`;
  if (!v.privacidad) errors.privacidad = 'Debes aceptar la política de privacidad.';
  return errors;
}

export type SubmitMode = { kind: 'formspree'; url: string } | { kind: 'mailto' };

/** Solo acepta el formato estricto de Formspree (INV-10); todo lo demás es el plan B `mailto:`. */
export function getSubmitMode(endpoint: string): SubmitMode {
  const url = (endpoint ?? '').trim();
  return FORMSPREE_ENDPOINT_RE.test(url) ? { kind: 'formspree', url } : { kind: 'mailto' };
}

const enc = encodeURIComponent;

export function buildMailtoUrl(to: string, v: ContactValues): string {
  const n = normalizeContact(v);
  const body = [
    `Nombre: ${n.nombre}`,
    `Email: ${n.email}`,
    `Empresa: ${n.empresa}`,
    `Servicio: ${serviceLabel(n.servicio)}`,
    '',
    'Mensaje:',
    n.mensaje,
  ].join('\n');
  return `mailto:${to}?subject=${enc(`Contacto web: ${n.nombre}`)}&body=${enc(body)}`;
}

export function buildFormspreeBody(v: ContactValues): FormData {
  const n = normalizeContact(v);
  const data = new FormData();
  data.set('nombre', n.nombre);
  data.set('email', n.email);
  data.set('empresa', n.empresa);
  data.set('servicio', serviceLabel(n.servicio));
  data.set('mensaje', n.mensaje);
  data.set('_gotcha', n.honeypot);
  return data;
}

import { describe, expect, it } from 'vitest';
import {
  buildFormspreeBody,
  buildMailtoUrl,
  getSubmitMode,
  isValidEmail,
  validateContact,
  type ContactValues,
} from '../../src/lib/contact';

const base: ContactValues = {
  nombre: 'Ana',
  email: 'ana@empresa.es',
  empresa: '',
  servicio: '',
  mensaje: 'Un mensaje válido de prueba',
  privacidad: true,
  honeypot: '',
};

describe('validateContact (CA-19)', () => {
  it('rechaza 9 y 2001 caracteres y acepta 10 y 2000', () => {
    expect(validateContact({ ...base, mensaje: 'a'.repeat(9) }).mensaje).toBeTruthy();
    expect(validateContact({ ...base, mensaje: 'a'.repeat(2001) }).mensaje).toBeTruthy();
    expect(validateContact({ ...base, mensaje: 'a'.repeat(10) }).mensaje).toBeUndefined();
    expect(validateContact({ ...base, mensaje: 'a'.repeat(2000) }).mensaje).toBeUndefined();
  });

  it('un mensaje de solo espacios cuenta como vacío', () => {
    expect(validateContact({ ...base, mensaje: ' '.repeat(30) }).mensaje).toMatch(/Escribe/);
  });

  it('empresa y servicio son opcionales', () => {
    expect(validateContact({ ...base, servicio: 'otro' })).toEqual({});
    expect(validateContact(base)).toEqual({});
  });

  it('exige nombre, email y la casilla de privacidad', () => {
    const errors = validateContact({
      ...base,
      nombre: ' ',
      email: '',
      privacidad: false,
    });
    expect(Object.keys(errors).sort()).toEqual(['email', 'nombre', 'privacidad']);
  });
});

describe('isValidEmail (CA-20)', () => {
  it('acepta solo los emails válidos', () => {
    expect(isValidEmail('a@b.es')).toBe(true);
    expect(isValidEmail('nombre.apellido+x@empresa.com')).toBe(true);
    for (const bad of ['', 'juan@', '@b.es', 'a b@c.es', 'a@b']) {
      expect(isValidEmail(bad)).toBe(false);
    }
  });

  it('acepta espacios en los extremos', () => {
    expect(isValidEmail('  a@b.es ')).toBe(true);
  });
});

describe('getSubmitMode (CA-22)', () => {
  it('solo Formspree con la URL estricta', () => {
    for (const e of [
      '',
      '   ',
      'http://formspree.io/f/abc',
      'https://evil.example/f/abc',
      'https://formspree.io/f/',
      'https://formspree.io/f/abc/x',
    ]) {
      expect(getSubmitMode(e)).toEqual({ kind: 'mailto' });
    }
    expect(getSubmitMode('https://formspree.io/f/abc123')).toEqual({
      kind: 'formspree',
      url: 'https://formspree.io/f/abc123',
    });
  });
});

describe('buildMailtoUrl (CA-26)', () => {
  it('codifica tildes, &, ?, #, =, saltos de línea y emojis', () => {
    const mensaje = '«Año & niño»?#=\n🚀';
    const url = buildMailtoUrl('hola@axyntia.example', { ...base, mensaje });
    expect(url.startsWith('mailto:hola@axyntia.example?subject=')).toBe(true);
    const query = url.slice(url.indexOf('?') + 1);
    expect(query.split('&')).toHaveLength(2);
    const [subject, body] = query.split('&').map((p) => decodeURIComponent(p.split('=')[1] ?? ''));
    expect(subject).toBe('Contacto web: Ana');
    expect(body).toContain(`Mensaje:\n${mensaje}`);
    expect(body).toContain('Email: ana@empresa.es');
  });

  it('con empresa vacía y servicio Otro no rompe el cuerpo', () => {
    const url = buildMailtoUrl('x@y.es', { ...base, servicio: 'otro' });
    const body = decodeURIComponent(url.split('&body=')[1] ?? '');
    expect(body).toContain('Empresa: \n');
    expect(body).toContain('Servicio: Otro');
  });
});

describe('buildFormspreeBody', () => {
  it('incluye los campos con el servicio legible', () => {
    const data = buildFormspreeBody({ ...base, servicio: 'agentes-ia', empresa: ' ACME ' });
    expect(data.get('nombre')).toBe('Ana');
    expect(data.get('empresa')).toBe('ACME');
    expect(data.get('servicio')).toBe('Agentes de IA personalizados');
    expect(data.get('mensaje')).toBe(base.mensaje);
    expect(data.get('_gotcha')).toBe('');
  });
});

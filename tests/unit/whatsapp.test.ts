import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl } from '../../src/lib/whatsapp';

describe('buildWhatsAppUrl', () => {
  it('construye el enlace de wa.me con el número y el mensaje', () => {
    expect(buildWhatsAppUrl('34600000000', 'Hola')).toBe('https://wa.me/34600000000?text=Hola');
  });

  it('quita el +, los espacios, los guiones y los paréntesis del número', () => {
    expect(buildWhatsAppUrl('+34 600 00-00 (00)', 'Hola')).toBe(
      'https://wa.me/34600000000?text=Hola',
    );
  });

  it('codifica espacios, tildes, eñes y caracteres reservados del mensaje', () => {
    const message = 'Hola, ¿me ayudáis con un año & más?';
    const url = buildWhatsAppUrl('34600000000', message);
    expect(url).toBe(
      'https://wa.me/34600000000?text=Hola%2C%20%C2%BFme%20ayud%C3%A1is%20con%20un%20a%C3%B1o%20%26%20m%C3%A1s%3F',
    );
    expect(new URL(url).searchParams.get('text')).toBe(message);
  });

  it('acepta un mensaje vacío', () => {
    expect(buildWhatsAppUrl('34600000000', '')).toBe('https://wa.me/34600000000?text=');
  });

  it('falla si el número no tiene ningún dígito', () => {
    expect(() => buildWhatsAppUrl(' + ', 'Hola')).toThrow(/dígitos/);
  });
});

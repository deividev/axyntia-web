/**
 * Enlace de WhatsApp («click to chat») con un mensaje ya escrito.
 *
 * El número se limpia a solo dígitos (fuera +, espacios, guiones y paréntesis) y el mensaje se
 * codifica para la URL.
 */
export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = number.replace(/\D/g, '');
  if (digits === '') {
    throw new Error('El número de WhatsApp no tiene dígitos');
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

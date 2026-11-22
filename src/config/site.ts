// Datos de contacto de la web. Sin secretos: todo lo que hay aquí acaba en el HTML público.
// Los valores marcados como «marcador» se sustituyen por los reales antes de publicar.
export const site = {
  companyName: 'Axyntia',
  siteUrl: 'https://axyntia.example', // marcador
  contactEmail: 'hola@axyntia.example', // marcador
  whatsappNumber: '34600000000', // marcador; con prefijo de país, sin + ni espacios
  whatsappMessage: 'Hola, me gustaría hablar con Axyntia sobre un proyecto.',
  formEndpoint: '', // URL del formulario de Formspree (https://formspree.io/f/…); vacío hasta tenerla
} as const;

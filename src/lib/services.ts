export type ServiceId = 'crm-3d' | 'software-a-medida' | 'agentes-ia' | 'automatizaciones';
export type ServiceValue = '' | ServiceId | 'otro';

export interface Service {
  id: ServiceId;
  title: string;
  description: string;
  benefits: readonly [string, string, string];
}

export const SERVICES: readonly Service[] = [
  {
    id: 'crm-3d',
    title: 'CRM personalizados en 3D',
    description:
      'Tus clientes, ventas y proyectos en un panel 3D interactivo que se entiende de un vistazo. Adiós a las hojas de cálculo infinitas.',
    benefits: [
      'Visión global del negocio de un vistazo',
      'Datos de clientes ordenados en un solo sitio',
      'Hecho a la medida de tu forma de vender',
    ],
  },
  {
    id: 'software-a-medida',
    title: 'Desarrollo de software a medida',
    description:
      'Aplicaciones web y de gestión hechas para tu forma de trabajar, no al revés. Escalables, seguras y tuyas.',
    benefits: [
      'Se adapta a tus procesos, no al revés',
      'Crece contigo sin rehacerse',
      'Código y datos son tuyos',
    ],
  },
  {
    id: 'agentes-ia',
    title: 'Agentes de IA personalizados',
    description:
      'Asistentes que atienden clientes, cualifican contactos o preparan informes 24/7, conectados a tus herramientas.',
    benefits: [
      'Atención continua a tus clientes',
      'Contactos cualificados antes de llegar a tu equipo',
      'Conectados a las herramientas que ya usas',
    ],
  },
  {
    id: 'automatizaciones',
    title: 'Automatizaciones que reducen gastos en tu empresa',
    description:
      'Eliminamos tareas repetitivas entre tus programas para que tu equipo dedique el tiempo a lo que aporta. Menos errores, menos gastos.',
    benefits: [
      'Menos tareas manuales repetitivas',
      'Menos errores entre programas',
      'Tu equipo, centrado en lo importante',
    ],
  },
];

/** Texto legible de un valor del desplegable de servicio. */
export function serviceLabel(value: ServiceValue): string {
  if (value === '') return '';
  if (value === 'otro') return 'Otro';
  return SERVICES.find((s) => s.id === value)?.title ?? '';
}

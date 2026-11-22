import { describe, expect, it } from 'vitest';
import { SERVICES, serviceLabel } from '../../src/lib/services';

describe('services', () => {
  it('hay 4 servicios con los títulos exactos y 3 beneficios cada uno', () => {
    expect(SERVICES.map((s) => s.title)).toEqual([
      'CRM personalizados en 3D',
      'Desarrollo de software a medida',
      'Agentes de IA personalizados',
      'Automatizaciones que reducen gastos en tu empresa',
    ]);
    for (const s of SERVICES) expect(s.benefits).toHaveLength(3);
  });

  it('serviceLabel', () => {
    expect(serviceLabel('')).toBe('');
    expect(serviceLabel('otro')).toBe('Otro');
    expect(serviceLabel('crm-3d')).toBe('CRM personalizados en 3D');
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getLastCutoffDate,
  toISODateString,
  formatCurrency,
  formatDay,
  getCurrentMonthLabel,
} from './dateUtils';

// Usa hora local al mediodía para evitar ambigüedades por zona horaria UTC±
describe('getLastCutoffDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve el corte del mes actual cuando hoy es el día de corte', () => {
    vi.setSystemTime(new Date(2026, 3, 24, 12, 0, 0));
    const result = getLastCutoffDate(24);
    expect(result).toEqual(new Date(2026, 3, 24));
  });

  it('devuelve el corte del mes actual cuando hoy supera el día de corte', () => {
    vi.setSystemTime(new Date(2026, 3, 25, 12, 0, 0));
    const result = getLastCutoffDate(24);
    expect(result).toEqual(new Date(2026, 3, 24));
  });

  it('devuelve el corte del mes anterior cuando hoy no ha llegado al día de corte', () => {
    vi.setSystemTime(new Date(2026, 3, 10, 12, 0, 0));
    const result = getLastCutoffDate(24);
    expect(result).toEqual(new Date(2026, 2, 24));
  });

  it('maneja el cambio de año (enero con corte en día 31)', () => {
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0));
    const result = getLastCutoffDate(31);
    expect(result).toEqual(new Date(2025, 11, 31));
  });
});

describe('toISODateString', () => {
  it('convierte una Date a formato AAAA-MM-DD', () => {
    expect(toISODateString(new Date('2026-04-24T12:00:00Z'))).toBe('2026-04-24');
  });

  it('maneja el primer día del mes', () => {
    expect(toISODateString(new Date('2026-01-01T00:00:00Z'))).toBe('2026-01-01');
  });
});

describe('formatCurrency', () => {
  it('formatea correctamente en pesos colombianos', () => {
    expect(formatCurrency(50000)).toMatch(/50\.000/);
  });

  it('formatea montos mayores al millón', () => {
    expect(formatCurrency(1500000)).toMatch(/1\.500\.000/);
  });

  it('formatea montos pequeños sin separador de miles', () => {
    expect(formatCurrency(500)).toMatch(/500/);
  });

  it('incluye el símbolo de moneda COP', () => {
    const result = formatCurrency(1000);
    expect(result).toMatch(/\$|COP/);
  });
});

describe('formatDay', () => {
  it('devuelve el string con el número de día', () => {
    expect(formatDay(15)).toBe('Día 15');
  });

  it('funciona con día 1', () => {
    expect(formatDay(1)).toBe('Día 1');
  });
});

describe('getCurrentMonthLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-22'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve una cadena con el año actual', () => {
    const result = getCurrentMonthLabel();
    expect(result).toContain('2026');
  });

  it('devuelve una cadena no vacía', () => {
    expect(getCurrentMonthLabel().length).toBeGreaterThan(0);
  });
});

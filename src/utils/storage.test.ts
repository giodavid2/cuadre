import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadStorage, saveStorage, updateStorage } from './storage';
import type { AppStorage } from '@/types/expense';

const BASE: AppStorage = {
  expenses: [],
  checkState: {},
  cutoffDay: null,
  lastResetDate: null,
};

describe('loadStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('devuelve el estado por defecto cuando localStorage está vacío', () => {
    expect(loadStorage()).toEqual(BASE);
  });

  it('devuelve el estado guardado cuando existe', () => {
    const stored: AppStorage = {
      expenses: [{ id: '1', name: 'Netflix', amount: 20000, dayOfMonth: 15 }],
      checkState: { '1': true },
      cutoffDay: 24,
      lastResetDate: '2026-04-24',
    };
    localStorage.setItem('cuadre_app', JSON.stringify(stored));
    expect(loadStorage()).toEqual(stored);
  });

  it('devuelve el estado por defecto cuando el JSON es inválido', () => {
    localStorage.setItem('cuadre_app', 'JSON-ROTO{{');
    expect(loadStorage()).toEqual(BASE);
  });

  it('mezcla el estado guardado con los defaults para claves faltantes', () => {
    localStorage.setItem('cuadre_app', JSON.stringify({ cutoffDay: 10 }));
    const result = loadStorage();
    expect(result.cutoffDay).toBe(10);
    expect(result.expenses).toEqual([]);
  });
});

describe('saveStorage', () => {
  it('guarda el estado serializado en localStorage', () => {
    const state: AppStorage = { ...BASE, cutoffDay: 5 };
    saveStorage(state);
    const raw = localStorage.getItem('cuadre_app');
    expect(JSON.parse(raw!)).toEqual(state);
  });
});

describe('updateStorage', () => {
  it('mezcla el partial con el estado existente y lo persiste', () => {
    saveStorage({ ...BASE, cutoffDay: 3 });
    const result = updateStorage({ cutoffDay: 20 });
    expect(result.cutoffDay).toBe(20);
    expect(result.expenses).toEqual([]);
    expect(JSON.parse(localStorage.getItem('cuadre_app')!).cutoffDay).toBe(20);
  });

  it('no sobreescribe claves no incluidas en el partial', () => {
    const expense = { id: '1', name: 'Test', amount: 1000, dayOfMonth: 1 };
    saveStorage({ ...BASE, expenses: [expense] });
    const result = updateStorage({ cutoffDay: 15 });
    expect(result.expenses).toHaveLength(1);
  });
});

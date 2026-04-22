import type { AppStorage } from '@/types/expense';

const STORAGE_KEY = 'cuadre_app';

const defaultState: AppStorage = {
  expenses: [],
  checkState: {},
  cutoffDay: null,
  lastResetDate: null,
};

export function loadStorage(): AppStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveStorage(data: AppStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateStorage(partial: Partial<AppStorage>): AppStorage {
  const current = loadStorage();
  const next = { ...current, ...partial };
  saveStorage(next);
  return next;
}

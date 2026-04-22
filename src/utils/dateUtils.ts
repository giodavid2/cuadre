/**
 * Calcula la fecha de corte más reciente que ya ocurrió.
 * Si el día de corte es, por ejemplo, 24 y hoy es el 25,
 * el corte más reciente fue el 24 del mes actual.
 */
export function getLastCutoffDate(cutoffDay: number): Date {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  if (day >= cutoffDay) {
    return new Date(year, month, cutoffDay);
  }
  // El corte del mes anterior
  return new Date(year, month - 1, cutoffDay);
}

export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDay(day: number): string {
  return `Día ${day}`;
}

export function getCurrentMonthLabel(): string {
  return new Date().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
}

export interface CheckState {
  [expenseId: string]: boolean;
}

export interface AppStorage {
  expenses: RecurringExpense[];
  checkState: CheckState;
  cutoffDay: number | null;
  lastResetDate: string | null;
}

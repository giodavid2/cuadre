import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ExpensesProvider } from '@/context/ExpensesContext';
import { MainLayout } from '@/components/templates/MainLayout/MainLayout';
import { RegisterPage } from '@/pages/RegisterPage/RegisterPage';
import { ChecklistPage } from '@/pages/ChecklistPage/ChecklistPage';

export function App() {
  return (
    <BrowserRouter>
      <ExpensesProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<RegisterPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
          </Route>
        </Routes>
      </ExpensesProvider>
    </BrowserRouter>
  );
}

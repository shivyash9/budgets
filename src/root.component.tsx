import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BudgetList from './components/BudgetList';
import BudgetForm from './components/BudgetForm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/budgets" element={<BudgetList />} />
        <Route path="/budgets/new" element={<BudgetForm />} />
        <Route path="/budgets/edit/:id" element={<BudgetForm />} />
      </Routes>
    </Router>
  );
};

export default App;

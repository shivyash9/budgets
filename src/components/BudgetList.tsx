import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BudgetList.css'; 

const BudgetList: React.FC = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user_budgets', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setBudgets(response.data);
    } catch (err) {
      setError('Failed to fetch budgets.');
    }
  };

  return (
    <div className="budget-container">
      <h2>Budget Management</h2>
      {error && <p className="error">{error}</p>}
      <Link to="/budgets/new" className="btn btn-primary">Add New Budget</Link>
      <table className="budget-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Currency</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget.id}>
              <td>{budget.id}</td>
              <td>{budget.amount}</td>
              <td>{new Date(budget.start_date).toLocaleDateString()}</td>
              <td>{new Date(budget.end_date).toLocaleDateString()}</td>
              <td>{budget.currency_id}</td>
              <td>{budget.expense_category_id}</td>
              <td>
                <Link to={`/budgets/edit/${budget.id}`} className="btn btn-warning">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './BudgetForm.css';

const BudgetForm: React.FC = () => {
  const [amount, setAmount] = useState<number | string>(''); 
  const [currencyId, setCurrencyId] = useState<string>(''); 
  const [categoryId, setCategoryId] = useState<string>(''); 
  const [startDate, setStartDate] = useState<string>(''); 
  const [endDate, setEndDate] = useState<string>(''); 
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 

  useEffect(() => {
    fetchCurrencies();
    fetchCategories();
    if (id) {
      fetchBudget(id); 
    }
  }, [id]);

  const fetchBudget = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user_budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAmount(response.data.amount);
      setCurrencyId(response.data.currency_id);
      setCategoryId(response.data.expense_category_id);
      setStartDate(new Date(response.data.start_date).toISOString().substring(0, 10)); 
      setEndDate(new Date(response.data.end_date).toISOString().substring(0, 10)); 
    } catch (err) {
      setError('Failed to fetch budget.');
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/currencies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrencies(response.data);
    } catch (err) {
      setError('Failed to fetch currencies.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/expense_categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch budget categories.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { 
        amount: Number(amount), 
        currency_id: currencyId,
        expense_category_id: categoryId,
        start_date: startDate, 
        end_date: endDate, 
      };
      if (id) {
        await axios.patch(`http://localhost:3000/api/user_budgets/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('http://localhost:3000/api/user_budgets', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate('/budgets'); 
    } catch (err) {
      setError('Failed to submit budget.');
    }
  };

  return (
    <div className="budget-form-container">
      <h2>{id ? 'Edit Budget' : 'Add New Budget'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select
            value={currencyId}
            onChange={(e) => setCurrencyId(e.target.value)}
            required
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>{currency.currency_code}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? 'Update Budget' : 'Add Budget'}
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;

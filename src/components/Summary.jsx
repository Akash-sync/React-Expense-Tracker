import { useState, useMemo } from 'react';
import { useTransactions } from '../context/TransactionsContext';
import { formatCurrency } from '../utils/currency';
import SavingsSprint from './SavingsSprint';

export default function Summary({ selectedMonth: propSelectedMonth, setSelectedMonth: setPropSelectedMonth, selectedYear: propSelectedYear, setSelectedYear: setPropSelectedYear }) {
  const { transactions } = useTransactions();

  // Use props if provided, otherwise fallback to local state
  const [localMonth, setLocalMonth] = useState(new Date().getMonth());
  const [localYear, setLocalYear] = useState(new Date().getFullYear());

  const selectedMonth = propSelectedMonth !== undefined ? propSelectedMonth : localMonth;
  const selectedYear = propSelectedYear !== undefined ? propSelectedYear : localYear;
  const setSelectedMonth = setPropSelectedMonth || setLocalMonth;
  const setSelectedYear = setPropSelectedYear || setLocalYear;

  // Filter transactions by selected month/year
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === selectedMonth &&
        txDate.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate monthly totals
  const monthlyTotals = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  // Generate month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options (current year and previous 2 years)
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className="container">
      {/* Month/Year Selector */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--card-bg)',
            color: 'var(--text)',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {months.map((month, index) => (
            <option key={month} value={index}>{month}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            background: 'var(--card-bg)',
            color: 'var(--text)',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="card">
          <h3>Income</h3>
          <p style={{ color: '#22c55e', fontSize: 24 }}>{formatCurrency(monthlyTotals.income)}</p>
        </div>
        <div className="card">
          <h3>Expenses</h3>
          <p style={{ color: '#ef4444', fontSize: 24 }}>{formatCurrency(monthlyTotals.expense)}</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3>Balance</h3>
            <p style={{ fontSize: 28 }}>{formatCurrency(monthlyTotals.balance)}</p>
          </div>
          <SavingsSprint />
        </div>
      </div>
    </div>
  );
}

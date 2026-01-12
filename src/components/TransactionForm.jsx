import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionsContext';
import { DatePicker } from './DatePicker';
import { getCategoriesByType } from '../utils/categories';

const empty = {
  type: 'expense',
  amount: '',
  category: '',
  note: '',
  date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
};

export default function TransactionForm({ editing, onDone, selectedMonth, selectedYear }) {
  const { addTransaction, updateTransaction } = useTransactions();

  // Helper to get default date based on selected month/year
  const getDefaultDate = () => {
    const today = new Date();
    // If no specific month selected (or 'all' logic implied, though passed as numbers here)
    if (selectedMonth === undefined || selectedYear === undefined) {
      return today.toISOString().slice(0, 10);
    }

    // If selected matches today's month/year, use today
    if (selectedMonth === today.getMonth() && selectedYear === today.getFullYear()) {
      return today.toISOString().slice(0, 10);
    }

    // Otherwise use 1st of selected month
    // Handle timezone offset by creating date at noon local time to ensure safe ISO string
    // Or just construct string manually
    const year = selectedYear;
    const month = String(selectedMonth + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  };

  const getEmptyForm = () => ({
    type: 'expense',
    amount: '',
    category: getCategoriesByType('expense')[0],
    note: '',
    date: getDefaultDate(),
  });

  const [form, setForm] = useState(editing ? editing : getEmptyForm());

  // Update default category when type changes
  useEffect(() => {
    if (!editing) {
      const categories = getCategoriesByType(form.type);
      // If current category is not in the new list, reset it
      if (!categories.includes(form.category)) {
        setForm(f => ({ ...f, category: categories[0] }));
      }
    }
  }, [form.type, editing]);

  // Update form date when selected month/year changes, only if not editing
  useEffect(() => {
    if (!editing) {
      setForm(prev => ({
        ...prev,
        date: getDefaultDate()
      }));
    }
  }, [selectedMonth, selectedYear, editing]);

  useEffect(() => {
    if (editing) {
      setForm(editing);
    } else {
      // If we finished editing or switched to add mode, reset with correct date
      setForm(getEmptyForm());
    }
  }, [editing]); // Removed selectedMonth/Year dependency here to avoid double update logic conflict

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    if (editing?.id) {
      updateTransaction(editing.id, form);
    } else {
      addTransaction(form);
    }
    onDone?.();
    setForm(getEmptyForm());
  };

  const categories = getCategoriesByType(form.type);

  return (
    <div className="container">
      <div className="card">
        <h3>{editing ? 'Edit transaction' : 'Add transaction'}</h3>
        <form onSubmit={handleSubmit} className="row">
          <div>
            <label className="muted">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="muted">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="muted">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="muted">Note</label>
            <input
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="muted">Date</label>
            <DatePicker
              value={form.date}
              onChange={(date) => setForm((f) => ({ ...f, date }))}
              placeholder="Select date"
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
            <button type="submit" className="primary">
              {editing ? 'Save changes' : 'Add'}
            </button>
            {editing && (
              <button type="button" className="ghost" onClick={() => onDone?.()}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

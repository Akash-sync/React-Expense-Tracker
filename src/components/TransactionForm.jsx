import { useEffect, useState } from 'react';
import { useTransactions } from '../context/TransactionsContext';
import { DatePicker } from './DatePicker';

const empty = {
  type: 'expense',
  amount: '',
  category: '',
  note: '',
  date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
};

export default function TransactionForm({ editing, onDone }) {
  const { addTransaction, updateTransaction } = useTransactions();
  const [form, setForm] = useState(editing ? editing : empty);

  useEffect(() => {
    setForm(editing ? editing : empty);
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    if (editing?.id) {
      updateTransaction(editing.id, form);
    } else {
      addTransaction(form);
    }
    onDone?.();
    setForm(empty);
  };

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
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="Food, Rent, Salary…"
            />
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

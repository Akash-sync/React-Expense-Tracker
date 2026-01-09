import { useState } from 'react';

export default function Filters({ onChange }) {
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('all');

  const handleChange = (next) => {
    onChange(next);
  };

  return (
    <div className="container">
      <div className="card row">
        <div>
          <label className="muted">Type</label>
          <select
            value={type}
            onChange={(e) => {
              const v = e.target.value;
              setType(v);
              handleChange({ type: v, query, month });
            }}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="muted">Search</label>
          <input
            placeholder="Note or category…"
            value={query}
            onChange={(e) => {
              const v = e.target.value;
              setQuery(v);
              handleChange({ type, query: v, month });
            }}
          />
        </div>
        <div>
          <label className="muted">Month</label>
          <select
            value={month}
            onChange={(e) => {
              const v = e.target.value;
              setMonth(v);
              handleChange({ type, query, month: v });
            }}
          >
            <option value="all">All</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                {new Date(0, i).toLocaleString('en-IN', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

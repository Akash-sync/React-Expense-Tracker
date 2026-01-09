import { useMemo, useState } from 'react';
import { useTransactions } from '../context/TransactionsContext';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';

export default function TransactionList({ filters }) {
  const { transactions, deleteTransaction } = useTransactions();
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const typeOk = filters.type === 'all' ? true : t.type === filters.type;
      const queryOk =
        filters.query.trim() === ''
          ? true
          : [t.note, t.category].some((x) =>
              (x || '').toLowerCase().includes(filters.query.toLowerCase())
            );
      const monthOk =
        filters.month === 'all'
          ? true
          : String(new Date(t.date).getMonth() + 1).padStart(2, '0') === filters.month;
      return typeOk && queryOk && monthOk;
    });
  }, [transactions, filters]);

  return (
    <div className="container">
      {editing && (
        <TransactionForm editing={editing} onDone={() => setEditing(null)} />
      )}
      <div className="card">
        <h3>Transactions</h3>
        <div className="list">
          {filtered.length === 0 ? (
            <p className="muted">No transactions match your filters.</p>
          ) : (
            filtered.map((tx) => (
              <TransactionItem
                key={tx.id}
                tx={tx}
                onEdit={setEditing}
                onDelete={deleteTransaction}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { formatCurrency } from '../utils/currency';

export default function TransactionItem({ tx, onEdit, onDelete }) {
  return (
    <div className="item card">
      <div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className={`badge ${tx.type}`}>{tx.type}</span>
          <strong>{tx.category || 'Uncategorized'}</strong>
        </div>
        <div className="muted">
          {tx.note ? tx.note + ' • ' : ''}{new Date(tx.date).toLocaleDateString('en-IN')}
        </div>
      </div>
      <div style={{ fontWeight: 600, color: tx.type === 'income' ? '#22c55e' : '#ef4444' }}>
        {tx.type === 'expense' ? '-' : '+'} {formatCurrency(tx.amount)}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onEdit(tx)}>Edit</button>
        <button onClick={() => onDelete(tx.id)} style={{ color: '#ef4444' }}>Delete</button>
      </div>
    </div>
  );
}

import { useTransactions } from '../context/TransactionsContext';
import { formatCurrency } from '../utils/currency';

export default function Summary() {
  const { totals } = useTransactions();
  return (
    <div className="container">
      <div className="row">
        <div className="card">
          <h3>Income</h3>
          <p style={{ color: '#22c55e', fontSize: 24 }}>{formatCurrency(totals.income)}</p>
        </div>
        <div className="card">
          <h3>Expenses</h3>
          <p style={{ color: '#ef4444', fontSize: 24 }}>{formatCurrency(totals.expense)}</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Balance</h3>
        <p style={{ fontSize: 28 }}>{formatCurrency(totals.balance)}</p>
      </div>
    </div>
  );
}

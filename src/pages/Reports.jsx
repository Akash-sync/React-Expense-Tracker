import { TransactionsProvider } from '../context/TransactionsContext';
import { useMemo } from 'react';
import { useTransactions } from '../context/TransactionsContext';
import ExpenseChart from '../components/ExpenseChart';

export default function Reports() {
  return (
    <TransactionsProvider>
      <ReportsPage />
    </TransactionsProvider>
  );
}

function ReportsPage() {
  const { transactions } = useTransactions();

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory = {};
    transactions.forEach(t => {
      if (!byCategory[t.category]) {
        byCategory[t.category] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        byCategory[t.category].income += t.amount;
      } else {
        byCategory[t.category].expense += t.amount;
      }
    });

    return { income, expenses, byCategory };
  }, [transactions]);

  return (
    <div className="container">
      <h1 style={{ marginTop: '80px', marginBottom: '24px' }}>Financial Reports</h1>

      <div className="row">
        <div className="card">
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
            Total Income
          </h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent)' }}>
            ${stats.income.toFixed(2)}
          </div>
        </div>
        <div className="card">
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--muted)', fontSize: '12px', textTransform: 'uppercase' }}>
            Total Expenses
          </h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--danger)' }}>
            ${stats.expenses.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px' }}>Category Overview</h2>
        <ExpenseChart data={stats.byCategory} />
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h2 style={{ marginTop: 0 }}>Breakdown by Category</h2>
        <div className="list">
          {Object.entries(stats.byCategory).length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>No transactions to analyze</p>
          ) : (
            Object.entries(stats.byCategory).map(([category, data]) => (
              <div key={category} style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{category}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {data.income > 0 && (
                    <div>
                      <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Income: </span>
                      <span style={{ color: 'var(--accent)', fontWeight: 500 }}>+${data.income.toFixed(2)}</span>
                    </div>
                  )}
                  {data.expense > 0 && (
                    <div>
                      <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Expense: </span>
                      <span style={{ color: 'var(--danger)', fontWeight: 500 }}>-${data.expense.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { TransactionsProvider, useTransactions } from '../context/TransactionsContext';
import EntryAnimation from '../components/EntryAnimation';
import Header from '../components/Header';
import Summary from '../components/Summary';
import TransactionForm from '../components/TransactionForm';
import Filters from '../components/Filters';
import TransactionDataTable from '../components/TransactionDataTable';
import { createTransactionColumns } from '../components/TransactionColumns';
import { useState, useMemo } from 'react';

function DashboardContent() {
  const [filters, setFilters] = useState({ type: 'all', query: '', month: 'all' });
  const [editing, setEditing] = useState(null);
  const { transactions, deleteTransaction } = useTransactions();

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

  const columns = useMemo(
    () => createTransactionColumns(setEditing, deleteTransaction),
    [deleteTransaction]
  );

  return (
    <>
      <EntryAnimation />
      <Header />
      <Summary />
      <TransactionForm />
      {editing && (
        <TransactionForm editing={editing} onDone={() => setEditing(null)} />
      )}
      <Filters onChange={setFilters} />
      <div className="container">
        <div className="card">
          <h3>Transactions</h3>
          <TransactionDataTable columns={columns} data={filtered} />
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  return (
    <TransactionsProvider>
      <DashboardContent />
    </TransactionsProvider>
  );
}

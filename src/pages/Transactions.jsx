import { TransactionsProvider } from '../context/TransactionsContext';
import { useTransactions } from '../context/TransactionsContext';
import TransactionDataTable from '../components/TransactionDataTable';
import { createTransactionColumns } from '../components/TransactionColumns';
import TransactionForm from '../components/TransactionForm';
import { useState, useMemo } from 'react';

export default function Transactions() {
  return (
    <TransactionsProvider>
      <TransactionsPage />
    </TransactionsProvider>
  );
}

function TransactionsPage() {
  const { transactions, deleteTransaction } = useTransactions();
  const [editing, setEditing] = useState(null);

  const columns = useMemo(
    () => createTransactionColumns(setEditing, deleteTransaction),
    [deleteTransaction]
  );

  return (
    <div className="container">
      <h1 style={{ marginTop: '80px', marginBottom: '24px' }}>All Transactions</h1>
      {editing && (
        <TransactionForm editing={editing} onDone={() => setEditing(null)} />
      )}
      <div className="card">
        <TransactionDataTable columns={columns} data={transactions} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { TransactionsProvider } from './context/TransactionsContext';
import Header from './components/Header';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import Filters from './components/Filters';
import TransactionList from './components/TransactionList';
import './styles.css';

export default function App() {
  const [filters, setFilters] = useState({ type: 'all', query: '', month: 'all' });

  return (
    <TransactionsProvider>
      <Header />
      <Summary />
      <TransactionForm />
      <Filters onChange={setFilters} />
      <TransactionList filters={filters} />
    </TransactionsProvider>
  );
}
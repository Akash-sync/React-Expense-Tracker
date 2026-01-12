import { TransactionsProvider } from '../context/TransactionsContext';
import EntryAnimation from '../components/EntryAnimation';
import Header from '../components/Header';
import Summary from '../components/Summary';
import TransactionForm from '../components/TransactionForm';
import { useState } from 'react';

function DashboardContent() {
  // Lifted month/year state for synchronization
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <>
      <EntryAnimation />
      <Header />
      <Summary
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
      <TransactionForm selectedMonth={selectedMonth} selectedYear={selectedYear} />
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

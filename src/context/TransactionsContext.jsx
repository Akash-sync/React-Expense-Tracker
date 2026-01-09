import { createContext, useContext, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';
import { parseISO } from 'date-fns';

const TransactionsContext = createContext();

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('transactions', []);

  const addTransaction = (tx) => {
    setTransactions((prev) => [
      { id: uuid(), ...tx, amount: Number(tx.amount), date: tx.date },
      ...prev,
    ]);
  };

  const updateTransaction = (id, updates) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, amount: Number(updates.amount ?? t.amount) } : t
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const sortByDateDesc = (list) =>
    [...list].sort((a, b) => parseISO(b.date) - parseISO(a.date));

  const value = {
    transactions: sortByDateDesc(transactions),
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totals,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionsContext);
}

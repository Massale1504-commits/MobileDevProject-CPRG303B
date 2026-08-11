import type { MaterialIcons } from "@expo/vector-icons";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type TransactionStatus = "Pending" | "Settled";

export interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number; // positive = income, negative = expense
  status: TransactionStatus;
  icon: keyof typeof MaterialIcons.glyphMap;
}

// What you pass in to add a transaction id/date/status are filled in
// automatically if you don't supply them.
export type NewTransaction = Partial<Pick<Transaction, "id" | "date" | "status">> &
  Pick<Transaction, "title" | "category" | "amount" | "icon">;

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "1", title: "Whole Foods Market", category: "Groceries", date: "May 24, 2024", amount: -142.3, status: "Pending", icon: "shopping-cart" },
  { id: "2", title: "Tech Corp Salary", category: "Salary", date: "May 22, 2024", amount: 2100.0, status: "Settled", icon: "payments" },
  { id: "3", title: "Monthly Rent", category: "Rent", date: "May 01, 2024", amount: -1250.0, status: "Settled", icon: "home" },
  { id: "4", title: "Shell Gas Station", category: "Transport", date: "May 18, 2024", amount: -45.2, status: "Settled", icon: "directions-car" },
  { id: "5", title: "Cash Gift", category: "Others", date: "May 15, 2024", amount: 50.0, status: "Settled", icon: "card-giftcard" },
];

interface TransactionsContextValue {
  transactions: Transaction[];
  addTransaction: (transaction: NewTransaction) => void;
  clearAll: () => void;
  totals: { income: number; expenses: number; balance: number };
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const addTransaction = (transaction: NewTransaction) => {
    setTransactions((prev) => [
      {
        id: transaction.id ?? genId(),
        date: transaction.date ?? todayLabel(),
        status: transaction.status ?? "Settled",
        title: transaction.title,
        category: transaction.category,
        amount: transaction.amount,
        icon: transaction.icon,
      },
      ...prev,
    ]);
  };

  const clearAll = () => setTransactions([]);

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const value = useMemo(
    () => ({ transactions, addTransaction, clearAll, totals }),
    [transactions, totals]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within a TransactionsProvider (see app/_layout.tsx)");
  }
  return ctx;
}

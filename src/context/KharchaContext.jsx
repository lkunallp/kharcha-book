import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { getUserBookData, saveUserBookData } from '../services/storage';
import confetti from 'canvas-confetti';

const KharchaContext = createContext();

const currentYearMonth = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
};

export function KharchaProvider({ children }) {
  const { currentUser } = useAuth();
  const { t, setLang } = useLanguage();

  const [month, setMonth] = useState(currentYearMonth);
  const [tab, setTab] = useState('overview');
  const [modeFilter, setModeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [tx, setTx] = useState([]);
  const [savings, setSavings] = useState([]);
  const [goals, setGoals] = useState([]);
  const [themeHue, setThemeHue] = useState(175);
  const [darkMode, setDarkMode] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Load user data when user changes
  useEffect(() => {
    if (currentUser?.id) {
      const data = getUserBookData(currentUser.id);
      setTx(data.tx || []);
      setSavings(data.savings || []);
      setGoals(data.goals || []);
      setThemeHue(data.themeHue ?? 175);
      setDarkMode(!!data.darkMode);
      if (data.lang) {
        setLang(data.lang);
      }
    } else {
      setTx([]);
      setSavings([]);
      setGoals([]);
    }
  }, [currentUser?.id]);

  // Persist user data whenever state updates
  useEffect(() => {
    if (currentUser?.id) {
      saveUserBookData(currentUser.id, {
        tx,
        savings,
        goals,
        themeHue,
        darkMode
      });
    }
  }, [currentUser?.id, tx, savings, goals, themeHue, darkMode]);

  // Apply CSS root variable for hue and dark mode class
  useEffect(() => {
    document.documentElement.style.setProperty('--h', String(themeHue));
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [themeHue, darkMode]);

  const shiftMonth = (delta) => {
    const parts = month.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1 + delta, 1);
    const newYm = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    setMonth(newYm);
  };

  // Transactions CRUD
  const addTransaction = (data) => {
    const newTx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      type: data.type || 'expense',
      amount: Math.round(Number(data.amount) * 100) / 100,
      mode: data.mode || 'UPI',
      category: data.category || 'Other',
      date: data.date || new Date().toISOString().slice(0, 10),
      note: (data.note || '').trim(),
      ts: Date.now()
    };

    setTx((prev) => [newTx, ...prev]);

    // Jump to month if transaction is in a different month
    const txYm = newTx.date.slice(0, 7);
    if (txYm !== month) {
      setMonth(txYm);
    }

    showToast(newTx.type === 'income' ? t('addIncomeSuccess') : t('addExpenseSuccess'));
  };

  const deleteTransaction = (id) => {
    setTx((prev) => prev.filter((item) => item.id !== id));
    showToast(t('deleteSuccess'));
  };

  // Goals CRUD
  const addGoal = ({ name, target }) => {
    const newGoal = {
      id: 'goal_' + Date.now(),
      name: name.trim(),
      target: Math.round(Number(target)),
      ts: Date.now()
    };
    setGoals((prev) => [...prev, newGoal]);
    showToast(t('goalCreated'));
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast(t('goalDeleted'));
  };

  // Savings CRUD
  const addSavings = ({ kind, amount, goal, note, date }) => {
    const amt = Math.round(Number(amount) * 100) / 100;
    const newSv = {
      id: 'sv_' + Date.now(),
      kind: kind || 'deposit',
      amount: amt,
      goal: goal || null,
      note: (note || '').trim(),
      date: date || new Date().toISOString().slice(0, 10),
      ts: Date.now()
    };

    // Check if goal was reached with this deposit
    if (newSv.kind === 'deposit' && goal) {
      const g = goals.find((item) => item.id === goal);
      if (g) {
        const currentSaved = savings
          .filter((s) => s.goal === goal)
          .reduce((acc, s) => acc + (s.kind === 'withdraw' ? -s.amount : s.amount), 0);
        if (currentSaved + amt >= g.target) {
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {}
        }
      }
    }

    setSavings((prev) => [newSv, ...prev]);
    showToast(newSv.kind === 'withdraw' ? t('withdrawSuccess') : t('savedSuccess'));
  };

  const deleteSavings = (id) => {
    setSavings((prev) => prev.filter((s) => s.id !== id));
    showToast(t('deleteSuccess'));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const exportBackup = () => {
    const data = {
      user: currentUser?.username,
      exportDate: new Date().toISOString(),
      tx,
      savings,
      goals,
      themeHue,
      darkMode
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kharcha_book_${currentUser?.username}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a);
    showToast(t('dataExportSuccess'));
  };

  const importBackup = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.tx)) setTx(data.tx);
      if (Array.isArray(data.savings)) setSavings(data.savings);
      if (Array.isArray(data.goals)) setGoals(data.goals);
      if (data.themeHue) setThemeHue(data.themeHue);
      if (typeof data.darkMode === 'boolean') setDarkMode(data.darkMode);
      showToast(t('dataImportSuccess'));
    } catch (e) {
      showToast('Invalid backup file format');
    }
  };

  return (
    <KharchaContext.Provider
      value={{
        month,
        setMonth,
        shiftMonth,
        tab,
        setTab,
        modeFilter,
        setModeFilter,
        searchQuery,
        setSearchQuery,
        tx,
        savings,
        goals,
        themeHue,
        setThemeHue,
        darkMode,
        toggleDarkMode,
        addTransaction,
        deleteTransaction,
        addGoal,
        deleteGoal,
        addSavings,
        deleteSavings,
        toastMessage,
        showToast,
        hideToast,
        exportBackup,
        importBackup
      }}
    >
      {children}
    </KharchaContext.Provider>
  );
}

export function useKharcha() {
  const context = useContext(KharchaContext);
  if (!context) {
    throw new Error('useKharcha must be used within a KharchaProvider');
  }
  return context;
}

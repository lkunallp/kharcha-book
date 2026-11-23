import React from 'react';
import { useAuth } from './context/AuthContext';
import { useKharcha } from './context/KharchaContext';
import { useLanguage } from './context/LanguageContext';

import AuthView from './components/AuthView';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import MonthSelector from './components/MonthSelector';
import OverviewTab from './components/OverviewTab';
import EntriesTab from './components/EntriesTab';
import SavingsTab from './components/SavingsTab';
import FloatingActionButton from './components/FloatingActionButton';
import Toast from './components/Toast';

export default function App() {
  const { currentUser, loading } = useAuth();
  const { tab } = useKharcha();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="auth-gate" style={{ textAlign: 'center', marginTop: '30vh' }}>
        <svg className="logo-big" viewBox="0 0 48 48" aria-hidden="true" style={{ width: '56px', height: '56px', margin: '0 auto' }}>
          <rect width="48" height="48" rx="14" fill="var(--accent)" />
          <path
            d="M14 17h20a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V20a3 3 0 0 1 3-3Z"
            fill="none"
            stroke="var(--accent-fg)"
            strokeWidth="2.5"
          />
          <path
            d="M14 17l16-6a2 2 0 0 1 3 1.9V17"
            fill="none"
            stroke="var(--accent-fg)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="30" cy="26" r="2.5" fill="var(--accent-fg)" />
        </svg>
        <h2 style={{ marginTop: '16px' }}>{t('appName')}</h2>
        <p className="muted small">Opening your book…</p>
      </div>
    );
  }

  // Not logged in -> Show Authentication View
  if (!currentUser) {
    return <AuthView />;
  }

  // Logged in -> Show App
  return (
    <div className="app-container">
      <Header />
      <NavigationTabs />
      <MonthSelector />

      <main>
        {tab === 'overview' && <OverviewTab />}
        {tab === 'entries' && <EntriesTab />}
        {tab === 'savings' && <SavingsTab />}
      </main>

      <footer className="credit">
        <span>
          {t('createdBy')}
        </span>
        <span style={{ fontSize: '0.78rem' }}>
          {t('privateNotice')}
        </span>
      </footer>

      <FloatingActionButton />
      <Toast />
    </div>
  );
}

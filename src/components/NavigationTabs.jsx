import React from 'react';
import { useKharcha } from '../context/KharchaContext';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, Receipt, PiggyBank } from 'lucide-react';

export default function NavigationTabs() {
  const { tab, setTab, tx, savings, goals, month } = useKharcha();
  const { t } = useLanguage();

  const mTxCount = tx.filter((x) => (x.date || '').slice(0, 7) === month).length;
  const goalsCount = goals.length;

  return (
    <nav className="tabs" aria-label="Sections">
      <button
        type="button"
        className={tab === 'overview' ? 'active' : ''}
        onClick={() => setTab('overview')}
      >
        <LayoutDashboard size={18} />
        <span>{t('tabOverview')}</span>
      </button>

      <button
        type="button"
        className={tab === 'entries' ? 'active' : ''}
        onClick={() => setTab('entries')}
      >
        <Receipt size={18} />
        <span>{t('tabEntries')}</span>
        {mTxCount > 0 && (
          <span
            style={{
              background: tab === 'entries' ? 'var(--accent-soft)' : 'var(--line)',
              color: tab === 'entries' ? 'var(--accent)' : 'var(--fg)',
              borderRadius: '999px',
              padding: '1px 7px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            {mTxCount}
          </span>
        )}
      </button>

      <button
        type="button"
        className={tab === 'savings' ? 'active' : ''}
        onClick={() => setTab('savings')}
      >
        <PiggyBank size={18} />
        <span>{t('tabSavings')}</span>
        {goalsCount > 0 && (
          <span
            style={{
              background: tab === 'savings' ? 'var(--accent-soft)' : 'var(--line)',
              color: tab === 'savings' ? 'var(--accent)' : 'var(--fg)',
              borderRadius: '999px',
              padding: '1px 7px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            {goalsCount}
          </span>
        )}
      </button>
    </nav>
  );
}

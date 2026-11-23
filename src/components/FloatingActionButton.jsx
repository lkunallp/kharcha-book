import React from 'react';
import { useKharcha } from '../context/KharchaContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus } from 'lucide-react';

export default function FloatingActionButton() {
  const { tab, setTab } = useKharcha();
  const { t } = useLanguage();

  if (tab === 'entries') return null;

  const handleClick = () => {
    setTab('entries');
    setTimeout(() => {
      const input = document.getElementById('txAmount');
      if (input) input.focus();
    }, 100);
  };

  return (
    <button
      type="button"
      id="fab-btn"
      onClick={handleClick}
      aria-label="Add entry"
    >
      <Plus size={20} strokeWidth={2.6} />
      <span>{t('floatingAddBtn')}</span>
    </button>
  );
}

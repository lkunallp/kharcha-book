import React from 'react';
import { useKharcha } from '../context/KharchaContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function MonthSelector() {
  const { month, shiftMonth, setMonth, tab } = useKharcha();
  const { formatMonth, t } = useLanguage();

  if (tab === 'savings') return null;

  const currentYm = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  };

  const isCurrentMonth = month === currentYm();

  return (
    <div className="monthbar">
      <div className="month" role="group" aria-label="Month">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label={t('prevMonth')}
          title={t('prevMonth')}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="num">{formatMonth(month)}</span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label={t('nextMonth')}
          title={t('nextMonth')}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {!isCurrentMonth && (
        <button
          type="button"
          className="btn ghost small"
          onClick={() => setMonth(currentYm())}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Calendar size={14} />
          <span>{t('today')}</span>
        </button>
      )}
    </div>
  );
}

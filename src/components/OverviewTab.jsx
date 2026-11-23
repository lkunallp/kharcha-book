import React from 'react';
import { useKharcha } from '../context/KharchaContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MODES } from '../i18n/translations';
import { TrendingUp, ArrowDownRight, ArrowUpRight, PiggyBank } from 'lucide-react';

const CAT_HUES = [175, 35, 265, 340, 205, 95, 15, 300, 120];

export default function OverviewTab() {
  const { tx, savings, month, setMonth } = useKharcha();
  const { currentUser } = useAuth();
  const { t, formatCurrency, formatMonth, getCategoryLabel } = useLanguage();

  // Current month transactions & savings
  const mTx = tx.filter((x) => (x.date || '').slice(0, 7) === month);
  const mSv = savings.filter((x) => (x.date || '').slice(0, 7) === month);

  const inc = mTx.filter((x) => x.type === 'income').reduce((a, b) => a + Number(b.amount || 0), 0);
  const exp = mTx.filter((x) => x.type === 'expense').reduce((a, b) => a + Number(b.amount || 0), 0);
  const sav = mSv.reduce((a, b) => a + (b.kind === 'withdraw' ? -Number(b.amount || 0) : Number(b.amount || 0)), 0);
  const avail = inc - exp - sav;

  // Time-based greeting
  const hr = new Date().getHours();
  const greetTime = hr < 12 ? t('goodMorning') : hr < 17 ? t('goodAfternoon') : t('goodEvening');
  const firstName = (currentUser?.name || 'Friend').split(' ')[0];

  // 6-month trend calculations
  const [baseYear, baseMonth] = month.split('-').map(Number);
  const trendMonths = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(baseYear, baseMonth - 1 - i, 1);
    const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const rows = tx.filter((x) => (x.date || '').slice(0, 7) === ym);
    const mInc = rows.filter((x) => x.type === 'income').reduce((a, b) => a + Number(b.amount || 0), 0);
    const mExp = rows.filter((x) => x.type === 'expense').reduce((a, b) => a + Number(b.amount || 0), 0);
    trendMonths.push({
      ym,
      label: d.toLocaleDateString('en-IN', { month: 'short' }),
      inc: mInc,
      exp: mExp
    });
  }

  const maxVal = Math.max(
    ...trendMonths.map((d) => Math.max(d.inc, d.exp)),
    1
  );

  // Category breakdown for donut chart
  const catSums = {};
  mTx
    .filter((x) => x.type === 'expense')
    .forEach((x) => {
      const c = x.category || 'Other';
      catSums[c] = (catSums[c] || 0) + Number(x.amount || 0);
    });

  const sortedCats = Object.keys(catSums)
    .sort((a, b) => catSums[b] - catSums[a])
    .map((c) => ({
      name: c,
      amount: catSums[c],
      pct: exp > 0 ? (catSums[c] / exp) * 100 : 0
    }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Hero Available Balance */}
      <div className="card hero">
        <p className="greet">
          {greetTime}, {firstName}!
        </p>
        <span className="label">
          {t('availableThisMonth')} {formatMonth(month)}
        </span>
        <div className={`big num ${avail < 0 ? 'neg' : ''}`}>
          {formatCurrency(avail)}
        </div>
        <span className="eq">{t('incomeMinusSpent')}</span>
      </div>

      {/* Stats row */}
      <div className="stats">
        <div className="stat in">
          <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowDownRight size={14} /> {t('income')}
          </span>
          <b className="num">{formatCurrency(inc)}</b>
        </div>
        <div className="stat out">
          <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} /> {t('spent')}
          </span>
          <b className="num">{formatCurrency(exp)}</b>
        </div>
        <div className="stat sav">
          <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PiggyBank size={14} /> {t('saved')}
          </span>
          <b className="num">{formatCurrency(sav)}</b>
        </div>
      </div>

      {/* 6-Month Trend */}
      <div className="card">
        <header>
          <h2>{t('lastSixMonths')}</h2>
          <div className="legend">
            <span>{t('income')}</span>
            <span className="o">{t('spent')}</span>
          </div>
        </header>

        <div className="trend" role="img" aria-label="Income and spending trend for last six months">
          {trendMonths.map((d) => {
            const hInc = Math.round((d.inc / maxVal) * 100);
            const hExp = Math.round((d.exp / maxVal) * 100);
            const isCur = d.ym === month;
            return (
              <div
                key={d.ym}
                className={`tcol ${isCur ? 'cur' : ''}`}
                onClick={() => setMonth(d.ym)}
                title={`${formatMonth(d.ym)}: In ${formatCurrency(d.inc)}, Out ${formatCurrency(d.exp)}`}
              >
                <div className="tbars">
                  <i
                    className="in"
                    style={{ height: `${Math.max(hInc, 4)}%` }}
                    aria-label={`Income ${formatCurrency(d.inc)}`}
                  />
                  <i
                    className="out"
                    style={{ height: `${Math.max(hExp, 4)}%` }}
                    aria-label={`Expense ${formatCurrency(d.exp)}`}
                  />
                </div>
                <span className="tm num">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Modes */}
      <div className="card">
        <header>
          <h2>{t('byPaymentMode')}</h2>
          <span className="small muted">{t('balanceFormula')}</span>
        </header>
        <div className="wallets">
          {MODES.map((m) => {
            const mIn = mTx
              .filter((x) => x.mode === m && x.type === 'income')
              .reduce((a, b) => a + Number(b.amount || 0), 0);
            const mOut = mTx
              .filter((x) => x.mode === m && x.type === 'expense')
              .reduce((a, b) => a + Number(b.amount || 0), 0);
            const bal = mIn - mOut;
            return (
              <div key={m} className="wallet">
                <span className="label">{m}</span>
                <b className={`num ${bal < 0 ? 'neg' : ''}`}>{formatCurrency(bal)}</b>
                <span className="io num">
                  {t('inAmount')} {formatCurrency(mIn)} · {t('outAmount')} {formatCurrency(mOut)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spending Donut */}
      <div className="card">
        <header>
          <h2>{t('whereItWent')}</h2>
          {exp > 0 && <span className="small muted num">{formatCurrency(exp)} {t('spent').toLowerCase()}</span>}
        </header>

        {sortedCats.length === 0 ? (
          <div className="empty">
            <b>{t('noSpendingInMonth')} {formatMonth(month)}</b>
            <span>{t('donutEmptyDesc')}</span>
          </div>
        ) : (
          <div className="donutwrap">
            <div className="donut">
              <svg viewBox="0 0 42 42" aria-hidden="true">
                <circle className="ring" cx="21" cy="21" r="15.9155" />
                {(() => {
                  let acc = 0;
                  return sortedCats.map((cat, i) => {
                    const strokeDash = `${cat.pct} ${100 - cat.pct}`;
                    const strokeOffset = -acc;
                    acc += cat.pct;
                    const hue = CAT_HUES[i % CAT_HUES.length];
                    return (
                      <circle
                        key={cat.name}
                        className="slice"
                        cx="21"
                        cy="21"
                        r="15.9155"
                        stroke={`hsl(${hue} 62% var(--catl))`}
                        strokeDasharray={strokeDash}
                        strokeDashoffset={strokeOffset}
                      />
                    );
                  });
                })()}
              </svg>
              <div className="mid">
                <span className="label">{t('spent')}</span>
                <b className="num">{formatCurrency(exp)}</b>
              </div>
            </div>

            <div className="dl">
              {sortedCats.map((cat, i) => {
                const hue = CAT_HUES[i % CAT_HUES.length];
                return (
                  <div key={cat.name}>
                    <span
                      className="sw"
                      style={{ background: `hsl(${hue} 62% var(--catl))` }}
                    />
                    <span className="n">{getCategoryLabel('expense', cat.name)}</span>
                    <span className="num muted small">
                      {formatCurrency(cat.amount)} · {Math.round(cat.pct)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

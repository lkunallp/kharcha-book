import React, { useState } from 'react';
import { useKharcha } from '../context/KharchaContext';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES, MODES } from '../i18n/translations';
import { Search, Plus, Trash2, Calendar, Check } from 'lucide-react';

export default function EntriesTab() {
  const { tx, month, addTransaction, deleteTransaction } = useKharcha();
  const { t, formatCurrency, formatShortDate, getCategoryLabel, formatMonth } = useLanguage();

  const [txType, setTxType] = useState('expense'); // 'expense' | 'income'
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('UPI');
  const [category, setCategory] = useState(CATEGORIES.expense[0].id);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  // Filters
  const [modeFilter, setModeFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Armed delete ID for two-step confirmation
  const [armedDeleteId, setArmedDeleteId] = useState(null);

  const categories = CATEGORIES[txType] || [];

  const handleTypeChange = (type) => {
    setTxType(type);
    const available = CATEGORIES[type] || [];
    if (available.length > 0) {
      setCategory(available[0].id);
    }
  };

  const setDateToday = () => {
    setDate(new Date().toISOString().slice(0, 10));
  };

  const setDateYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setDate(d.toISOString().slice(0, 10));
  };

  const applyPreset = (presetAmt, presetCat, presetNote) => {
    setAmount(String(presetAmt));
    if (presetCat) setCategory(presetCat);
    if (presetNote) setNote(presetNote);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (!(numAmt > 0) || !date) return;

    addTransaction({
      type: txType,
      amount: numAmt,
      mode,
      category,
      date,
      note
    });

    setAmount('');
    setNote('');
  };

  const handleDelete = (id) => {
    if (armedDeleteId === id) {
      deleteTransaction(id);
      setArmedDeleteId(null);
    } else {
      setArmedDeleteId(id);
      setTimeout(() => {
        setArmedDeleteId((cur) => (cur === id ? null : cur));
      }, 3000);
    }
  };

  // Filtered entries for current month
  const monthlyTx = tx
    .filter((x) => (x.date || '').slice(0, 7) === month)
    .filter((x) => (modeFilter === 'all' ? true : x.mode === modeFilter))
    .filter((x) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const n = (x.note || '').toLowerCase();
      const c = (x.category || '').toLowerCase();
      return n.includes(q) || c.includes(q);
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.ts || 0) - (a.ts || 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Add Entry Card */}
      <div className="card">
        <header>
          <h2>{t('addAnEntry')}</h2>
          <div className="seg" role="group" aria-label="Entry type">
            <button
              type="button"
              className={txType === 'expense' ? 'active' : ''}
              onClick={() => handleTypeChange('expense')}
            >
              {t('entrySpent')}
            </button>
            <button
              type="button"
              className={txType === 'income' ? 'active' : ''}
              onClick={() => handleTypeChange('income')}
            >
              {t('entryReceived')}
            </button>
          </div>
        </header>

        {/* Quick Add Presets */}
        <div className="preset-row">
          <span className="label">{t('quickAddPreset')}:</span>
          {txType === 'expense' ? (
            <>
              <button
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(20, 'Food', 'Chai')}
              >
                ☕ Chai ₹20
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(50, 'Travel', 'Auto')}
              >
                🛺 Auto ₹50
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(180, 'Food', 'Lunch')}
              >
                🍛 Lunch ₹180
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(500, 'Food', 'Groceries')}
              >
                🛒 Grocery ₹500
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(299, 'Bills', 'Mobile Recharge')}
              >
                📱 Recharge ₹299
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(50000, 'Salary', 'Monthly Salary')}
              >
                💼 Salary ₹50,000
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(5000, 'Freelance', 'Project Payment')}
              >
                💻 Freelance ₹5,000
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => applyPreset(1000, 'Pocket money', 'Pocket Money')}
              >
                🎁 Pocket Money ₹1,000
              </button>
            </>
          )}
        </div>

        <form className="grid" onSubmit={handleSubmit} autoComplete="off">
          <div className="field">
            <label htmlFor="txAmount">{t('amount')}</label>
            <input
              id="txAmount"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="any"
              placeholder="e.g. 250"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="txMode">
              {txType === 'income' ? t('receivedThrough') : t('paidThrough')}
            </label>
            <select
              id="txMode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              {MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="txCat">{t('category')}</label>
            <select
              id="txCat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {getCategoryLabel(txType, c.id)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="txDate">{t('date')}</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="linkbtn"
                  onClick={setDateToday}
                  style={{ fontSize: '0.74rem' }}
                >
                  {t('today')}
                </button>
                <button
                  type="button"
                  className="linkbtn"
                  onClick={setDateYesterday}
                  style={{ fontSize: '0.74rem' }}
                >
                  {t('yesterday')}
                </button>
              </div>
            </div>
            <input
              id="txDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="field wide">
            <label htmlFor="txNote">{t('note')}</label>
            <input
              id="txNote"
              type="text"
              maxLength={80}
              placeholder={t('notePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="wide">
            <button className="btn" type="submit" style={{ width: '100%' }}>
              <Plus size={18} />
              {txType === 'income' ? t('addIncomeBtn') : t('addExpenseBtn')}
            </button>
          </div>
        </form>
      </div>

      {/* Entries List Card */}
      <div className="card">
        <header>
          <h2>{t('entriesThisMonth')}</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '160px' }}>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  minHeight: '36px',
                  paddingLeft: '32px',
                  paddingRight: '10px',
                  fontSize: '0.84rem'
                }}
              />
              <Search
                size={14}
                className="muted"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            {/* Mode Filter */}
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              style={{ minHeight: '36px', width: 'auto', fontSize: '0.84rem' }}
              aria-label="Filter by mode"
            >
              <option value="all">{t('allModes')}</option>
              {MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="list">
          {monthlyTx.length === 0 ? (
            <div className="empty">
              <b>{t('noEntriesTitle')}</b>
              <span>{t('noEntriesDesc')}</span>
            </div>
          ) : (
            monthlyTx.map((item) => {
              const isIncome = item.type === 'income';
              const isArmed = armedDeleteId === item.id;
              return (
                <div key={item.id} className="item">
                  <span className={`badge ${isIncome ? 'in' : 'out'}`}>
                    {String(item.mode || '—').toUpperCase()}
                  </span>

                  <div className="m">
                    <strong>{item.note || getCategoryLabel(item.type, item.category) || 'Entry'}</strong>
                    <div className="chips">
                      <span className="num">{formatShortDate(item.date)}</span>
                      {item.category && (
                        <span className="chip">
                          {getCategoryLabel(item.type, item.category)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="a">
                    <span className={`num ${isIncome ? 'pos' : 'neg'}`}>
                      {formatCurrency(item.amount, true)}
                    </span>
                    <button
                      type="button"
                      className="linkbtn"
                      style={isArmed ? { color: 'var(--out)', fontWeight: 700 } : {}}
                      onClick={() => handleDelete(item.id)}
                    >
                      {isArmed ? t('confirmDelete') : t('delete')}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

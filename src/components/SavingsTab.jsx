import React, { useState, useRef } from 'react';
import { useKharcha } from '../context/KharchaContext';
import { useLanguage } from '../context/LanguageContext';
import { PiggyBank, Target, Plus, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';

export default function SavingsTab() {
  const { savings, goals, addGoal, deleteGoal, addSavings, deleteSavings } = useKharcha();
  const { t, formatCurrency, formatShortDate } = useLanguage();

  // New Goal form
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  // Add Savings form
  const [svKind, setSvKind] = useState('deposit'); // 'deposit' | 'withdraw'
  const [svAmount, setSvAmount] = useState('');
  const [svGoal, setSvGoal] = useState('');
  const [svDate, setSvDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [svNote, setSvNote] = useState('');

  // Armed delete ID for two-step confirmation
  const [armedGoalId, setArmedGoalId] = useState(null);
  const [armedSavingsId, setArmedSavingsId] = useState(null);

  const svAmountInputRef = useRef(null);

  // Total saved calculation
  const totalSaved = savings.reduce(
    (acc, item) => acc + (item.kind === 'withdraw' ? -Number(item.amount || 0) : Number(item.amount || 0)),
    0
  );

  const handleCreateGoal = (e) => {
    e.preventDefault();
    const numTarget = parseFloat(goalTarget);
    if (!goalName.trim() || !(numTarget > 0)) return;

    addGoal({
      name: goalName,
      target: numTarget
    });

    setGoalName('');
    setGoalTarget('');
  };

  const handleAddSavings = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(svAmount);
    if (!(numAmount > 0) || !svDate) return;

    if (svKind === 'withdraw') {
      const savedInTarget = savings
        .filter((s) => (svGoal ? s.goal === svGoal : true))
        .reduce((acc, s) => acc + (s.kind === 'withdraw' ? -Number(s.amount) : Number(s.amount)), 0);

      if (numAmount > savedInTarget) {
        alert(t('insufficientSavings') + ` (${formatCurrency(savedInTarget)})`);
        return;
      }
    }

    addSavings({
      kind: svKind,
      amount: numAmount,
      goal: svGoal || null,
      note: svNote,
      date: svDate
    });

    setSvAmount('');
    setSvNote('');
  };

  const handleQuickAddMoneyToGoal = (gId) => {
    setSvGoal(gId);
    setSvKind('deposit');
    if (svAmountInputRef.current) {
      svAmountInputRef.current.focus();
    }
  };

  const handleDeleteGoal = (id) => {
    if (armedGoalId === id) {
      deleteGoal(id);
      setArmedGoalId(null);
    } else {
      setArmedGoalId(id);
      setTimeout(() => {
        setArmedGoalId((cur) => (cur === id ? null : cur));
      }, 3000);
    }
  };

  const handleDeleteSavings = (id) => {
    if (armedSavingsId === id) {
      deleteSavings(id);
      setArmedSavingsId(null);
    } else {
      setArmedSavingsId(id);
      setTimeout(() => {
        setArmedSavingsId((cur) => (cur === id ? null : cur));
      }, 3000);
    }
  };

  // Map of goal ID to goal name for display in savings history
  const goalMap = {};
  goals.forEach((g) => {
    goalMap[g.id] = g.name;
  });

  const sortedSavings = [...savings].sort(
    (a, b) => (b.date || '').localeCompare(a.date || '') || (b.ts || 0) - (a.ts || 0)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Total Saved Hero */}
      <div className="card savhero">
        <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PiggyBank size={16} /> {t('totalSaved')}
        </span>
        <div className="bigsave num">{formatCurrency(totalSaved)}</div>
        <span className="small muted">
          {savings.length === 0
            ? t('savingsCountZero')
            : `${savings.length} ${savings.length === 1 ? t('savingsCountOne') : t('savingsCountMany')}`}
        </span>
      </div>

      {/* Goals Card */}
      <div className="card">
        <header>
          <h2>{t('savingsGoals')}</h2>
          <span className="small muted">{t('targetsToSaveTowards')}</span>
        </header>

        {goals.length === 0 ? (
          <div className="empty">
            <b>{t('noGoalsTitle')}</b>
            <span>{t('noGoalsDesc')}</span>
          </div>
        ) : (
          <div className="goals">
            {goals.map((g) => {
              const savedInGoal = savings
                .filter((e) => e.goal === g.id)
                .reduce((acc, e) => acc + (e.kind === 'withdraw' ? -Number(e.amount) : Number(e.amount)), 0);

              const frac = Math.max(0, Math.min(1, savedInGoal / (g.target || 1)));
              const pct = Math.round(frac * 100);
              const C = 2 * Math.PI * 26; // Circumference for r=26
              const strokeOffset = C * (1 - frac);
              const isArmed = armedGoalId === g.id;

              return (
                <div key={g.id} className="goal">
                  <svg viewBox="0 0 64 64" aria-hidden="true">
                    <circle className="tr" cx="32" cy="32" r="26" />
                    <circle
                      className="pr"
                      cx="32"
                      cy="32"
                      r="26"
                      strokeDasharray={C.toFixed(2)}
                      strokeDashoffset={strokeOffset.toFixed(2)}
                    />
                  </svg>

                  <div>
                    <strong>{g.name}</strong>
                    <div className="small muted num">
                      {formatCurrency(savedInGoal)} of {formatCurrency(g.target)}
                    </div>
                  </div>

                  <span className={`small num ${frac >= 1 ? 'pos' : 'muted'}`} style={{ fontWeight: 600 }}>
                    {frac >= 1 ? t('goalReached') : `${pct}% ${t('percentThere')}`}
                  </span>

                  <div className="acts">
                    <button
                      type="button"
                      className="btn ghost small"
                      onClick={() => handleQuickAddMoneyToGoal(g.id)}
                    >
                      {t('addMoneyToGoal')}
                    </button>
                    <button
                      type="button"
                      className="linkbtn"
                      style={isArmed ? { color: 'var(--out)', fontWeight: 700 } : {}}
                      onClick={() => handleDeleteGoal(g.id)}
                    >
                      {isArmed ? t('confirmDelete') : t('delete')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create new goal */}
        <form className="grid" onSubmit={handleCreateGoal} autoComplete="off" style={{ marginTop: '8px' }}>
          <div className="field">
            <label htmlFor="goalName">{t('newGoal')}</label>
            <input
              id="goalName"
              type="text"
              maxLength={40}
              placeholder={t('newGoalPlaceholder')}
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="goalTarget">{t('targetAmount')}</label>
            <input
              id="goalTarget"
              type="number"
              inputMode="decimal"
              min="1"
              step="1"
              placeholder="e.g. 15000"
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              required
            />
          </div>

          <div className="wide">
            <button className="btn ghost" type="submit" style={{ width: '100%' }}>
              <Target size={16} />
              {t('createGoalBtn')}
            </button>
          </div>
        </form>
      </div>

      {/* Add / Withdraw from savings */}
      <div className="card">
        <header>
          <h2>{t('addToSavings')}</h2>
          <div className="seg" role="group" aria-label="Savings action">
            <button
              type="button"
              className={svKind === 'deposit' ? 'active' : ''}
              onClick={() => setSvKind('deposit')}
            >
              {t('savingsSave')}
            </button>
            <button
              type="button"
              className={svKind === 'withdraw' ? 'active' : ''}
              onClick={() => setSvKind('withdraw')}
            >
              {t('savingsTakeOut')}
            </button>
          </div>
        </header>

        <form className="grid" onSubmit={handleAddSavings} autoComplete="off">
          <div className="field">
            <label htmlFor="svAmount">{t('amount')}</label>
            <input
              id="svAmount"
              ref={svAmountInputRef}
              type="number"
              inputMode="decimal"
              min="0.01"
              step="any"
              placeholder="e.g. 1000"
              value={svAmount}
              onChange={(e) => setSvAmount(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="svGoal">{t('forGoal')}</label>
            <select
              id="svGoal"
              value={svGoal}
              onChange={(e) => setSvGoal(e.target.value)}
            >
              <option value="">{t('generalSavings')}</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="svDate">{t('date')}</label>
            <input
              id="svDate"
              type="date"
              value={svDate}
              onChange={(e) => setSvDate(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="svNote">{t('note')}</label>
            <input
              id="svNote"
              type="text"
              maxLength={80}
              placeholder="e.g. Month-end savings"
              value={svNote}
              onChange={(e) => setSvNote(e.target.value)}
            />
          </div>

          <div className="wide">
            <button className="btn" type="submit" style={{ width: '100%' }}>
              <Plus size={18} />
              {svKind === 'withdraw' ? t('takeOutBtn') : t('saveBtn')}
            </button>
          </div>
        </form>
      </div>

      {/* Savings History */}
      <div className="card">
        <header>
          <h2>{t('savingsHistory')}</h2>
        </header>

        <div className="list">
          {sortedSavings.length === 0 ? (
            <div className="empty">
              <b>{t('noSavingsHistoryTitle')}</b>
              <span>{t('noSavingsHistoryDesc')}</span>
            </div>
          ) : (
            sortedSavings.map((item) => {
              const isDeposit = item.kind !== 'withdraw';
              const isArmed = armedSavingsId === item.id;
              return (
                <div key={item.id} className="item">
                  <span className={`badge ${isDeposit ? 'in' : 'out'}`}>
                    {isDeposit ? 'SAVE' : 'OUT'}
                  </span>

                  <div className="m">
                    <strong>
                      {item.note || (isDeposit ? t('savingsSave') : t('savingsTakeOut'))}
                    </strong>
                    <div className="chips">
                      <span className="num">{formatShortDate(item.date)}</span>
                      <span className="chip">
                        {item.goal && goalMap[item.goal] ? goalMap[item.goal] : t('generalSavings')}
                      </span>
                    </div>
                  </div>

                  <div className="a">
                    <span className={`num ${isDeposit ? 'pos' : 'neg'}`}>
                      {formatCurrency(item.amount, true)}
                    </span>
                    <button
                      type="button"
                      className="linkbtn"
                      style={isArmed ? { color: 'var(--out)', fontWeight: 700 } : {}}
                      onClick={() => handleDeleteSavings(item.id)}
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

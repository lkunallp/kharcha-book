import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AVATARS } from '../i18n/translations';
import { Lock, User, Eye, EyeOff, Globe, CheckCircle2 } from 'lucide-react';

export default function AuthView() {
  const { login, signup, loginWithDemo } = useAuth();
  const { lang, setLang, t, languages } = useLanguage();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t('fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        login(username, password, rememberMe);
      } else {
        if (!name.trim()) {
          setError(t('fillAllFields'));
          setLoading(false);
          return;
        }
        signup({
          username,
          password,
          name,
          avatar: selectedAvatar
        });
      }
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') {
        setError(t('invalidCredentials'));
      } else if (err.message === 'USER_EXISTS') {
        setError(t('userAlreadyExists'));
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoUser) => {
    setError('');
    loginWithDemo(demoUser);
  };

  return (
    <div className="auth-gate">
      {/* Top language toggle on auth screen */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <div className="lang-selector">
          <Globe size={15} className="muted" />
          <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Select Language">
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <svg className="logo-big" viewBox="0 0 48 48" aria-hidden="true">
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
          <div>
            <h1>{t('appName')}</h1>
            <p className="muted small" style={{ margin: '4px 0 0' }}>
              {mode === 'login' ? t('welcomeBack') : t('createYourAccount')}
            </p>
          </div>
        </div>

        {/* Tab switch between Login and Register */}
        <div className="seg" style={{ width: '100%' }}>
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            style={{ flex: 1 }}
            onClick={() => {
              setMode('login');
              setError('');
            }}
          >
            {t('signIn')}
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            style={{ flex: 1 }}
            onClick={() => {
              setMode('signup');
              setError('');
            }}
          >
            {t('signUp')}
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'var(--out-soft)',
              color: 'var(--out)',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div className="field">
              <label>{t('fullName')}</label>
              <input
                type="text"
                placeholder={t('fullNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field">
            <label>{t('username')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder={t('usernamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoCapitalize="none"
                style={{ paddingLeft: '38px' }}
              />
              <User
                size={18}
                className="muted"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="field">
            <label>{t('password')}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
              />
              <Lock
                size={18}
                className="muted"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'var(--muted)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="field">
              <label>{t('avatarChoice')}</label>
              <div className="avatar-grid">
                {AVATARS.map((avUrl, idx) => (
                  <img
                    key={idx}
                    src={avUrl}
                    alt={`Avatar ${idx + 1}`}
                    className={`avatar-option ${selectedAvatar === avUrl ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(avUrl)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Remember me option (checked by default for persistent login) */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
            />
            <span style={{ fontWeight: 500 }}>{t('rememberMe')}</span>
          </label>

          <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: '4px' }}>
            {mode === 'login' ? t('logInBtn') : t('signUpBtn')}
          </button>
        </form>

        {/* Demo Accounts Box */}
        <div className="demo-box">
          <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="var(--accent)" />
            {t('quickDemoAccounts')}
          </strong>
          <div className="demo-btns">
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoClick('kunal')}
            >
              👤 {t('demoKunal')}
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoClick('riya')}
            >
              👩 {t('demoRiya')}
            </button>
          </div>
        </div>

        <p className="small muted" style={{ textAlign: 'center', margin: 0 }}>
          {t('privateNotice')}
        </p>
      </div>

      <footer className="credit">
        <span>{t('createdBy')}</span>
      </footer>
    </div>
  );
}

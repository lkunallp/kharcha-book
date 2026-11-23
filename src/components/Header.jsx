import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useKharcha } from '../context/KharchaContext';
import { ACCENT_THEMES } from '../i18n/translations';
import {
  Globe,
  Moon,
  Sun,
  LogOut,
  Download,
  Upload,
  User,
  ShieldCheck
} from 'lucide-react';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { lang, setLang, t, languages } = useLanguage();
  const { themeHue, setThemeHue, darkMode, toggleDarkMode, exportBackup, importBackup } = useKharcha();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        importBackup(event.target.result);
        setMenuOpen(false);
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="top-nav">
      <div className="brand">
        <svg viewBox="0 0 48 48" aria-hidden="true">
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
          <p>{t('appTagline')}</p>
        </div>
      </div>

      <div className="actions-cluster">
        {/* Language selector */}
        <div className="lang-selector" title="Change Language / भाषा बदलें">
          <Globe size={16} className="muted" />
          <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Select Language">
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme swatches */}
        <div className="swatches" role="group" aria-label="Theme Accent Color">
          {ACCENT_THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={themeHue === theme.h ? 'active' : ''}
              style={{ background: theme.color }}
              onClick={() => setThemeHue(theme.h)}
              title={t(theme.nameKey)}
              aria-label={t(theme.nameKey)}
            />
          ))}
        </div>

        {/* Dark mode toggle */}
        <button
          type="button"
          className="btn ghost small"
          onClick={toggleDarkMode}
          title={darkMode ? t('lightMode') : t('darkMode')}
          aria-label="Toggle dark mode"
          style={{ padding: '6px 10px', borderRadius: '999px' }}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User profile menu */}
        <div className="user-menu-wrap" ref={menuRef}>
          <button
            type="button"
            className="chip-user"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
          >
            <img src={currentUser?.avatar} alt={currentUser?.name} />
            <span>{currentUser?.name?.split(' ')[0] || 'User'}</span>
          </button>

          {menuOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <strong>{currentUser?.name}</strong>
                <span>@{currentUser?.username}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--in)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <ShieldCheck size={13} /> {t('privateNotice')}
                </span>
              </div>

              <button
                type="button"
                className="user-dropdown-item"
                onClick={() => {
                  exportBackup();
                  setMenuOpen(false);
                }}
              >
                <Download size={16} />
                <span>{t('exportData')}</span>
              </button>

              <button
                type="button"
                className="user-dropdown-item"
                onClick={handleImportClick}
              >
                <Upload size={16} />
                <span>{t('importData')}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
              />

              <button
                type="button"
                className="user-dropdown-item danger"
                onClick={() => {
                  if (window.confirm(t('logoutConfirm'))) {
                    logout();
                  }
                }}
              >
                <LogOut size={16} />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { storage } from '@/lib/data';
import styles from './Settings.module.css';

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [username, setUsername] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const savedTheme = storage.getTheme();
    const savedName = storage.getUsername();
    setTheme(savedTheme);
    setUsername(savedName);
    setNameInput(savedName);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const saveName = () => {
    const name = nameInput.trim() || 'Friend';
    setUsername(name);
    storage.setUsername(name);
    setEditingName(false);
  };

  const clearAllData = () => {
    if (confirm('Clear all diary entries and mood logs? This cannot be undone.')) {
      localStorage.removeItem('moodify-entries');
      localStorage.removeItem('moodify-logs');
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className={styles.container}>
      {/* Profile */}
      <div className={styles.profileCard}>
        <div className={styles.avatarLg}>{initials}</div>
        {editingName ? (
          <div className={styles.nameEdit}>
            <input
              className={styles.nameInput}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
              placeholder="Your name"
            />
            <button className={styles.saveNameBtn} onClick={saveName}>Save</button>
          </div>
        ) : (
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{username}</p>
            <button className={styles.editBtn} onClick={() => setEditingName(true)}>
              Edit name
            </button>
          </div>
        )}
      </div>

      {/* Preferences */}
      <p className="section-label">Preferences</p>
      <div className={styles.settingsList}>
        <div className={styles.settingRow}>
          <div className={styles.settingLeft}>
            <span className={styles.settingIcon}>🌙</span>
            <div>
              <p className={styles.settingTitle}>Dark mode</p>
              <p className={styles.settingDesc}>Switch to dark theme</p>
            </div>
          </div>
          <button
            className={`${styles.toggle} ${theme === 'dark' ? styles.toggleOn : ''}`}
            onClick={toggleTheme}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>
      </div>

      {/* Data */}
      <p className="section-label">Data & Privacy</p>
      <div className={styles.settingsList}>
        <div className={styles.settingRow}>
          <div className={styles.settingLeft}>
            <span className={styles.settingIcon}>📱</span>
            <div>
              <p className={styles.settingTitle}>Stored locally</p>
              <p className={styles.settingDesc}>All data stays on your device</p>
            </div>
          </div>
          <span className={styles.badge}>Local</span>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLeft}>
            <span className={styles.settingIcon}>🗑</span>
            <div>
              <p className={styles.settingTitle}>Clear all data</p>
              <p className={styles.settingDesc}>Remove diary entries & mood logs</p>
            </div>
          </div>
          <button className={styles.dangerBtn} onClick={clearAllData}>
            Clear
          </button>
        </div>
      </div>

      {cleared && (
        <div className={styles.toast}>Data cleared successfully</div>
      )}

      {/* About */}
      <p className="section-label">About</p>
      <div className={styles.aboutCard}>
        <p className={styles.aboutTitle}>Moodify</p>
        <p className={styles.aboutDesc}>Your personal emotional companion. Track moods, write diary entries, and take care of yourself — all in one place.</p>
        <p className={styles.aboutVersion}>Version 1.0.0</p>
      </div>
    </div>
  );
}

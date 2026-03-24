'use client';
import { useState, useEffect } from 'react';
import { storage } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import styles from './Settings.module.css';

interface Rating {
  id: string;
  name: string;
  stars: number;
  comment: string;
  created_at: string;
}

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [username, setUsername] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [cleared, setCleared] = useState(false);

  // Ratings state
  const [allRatings, setAllRatings] = useState<Rating[]>([]);
  const [avgStars, setAvgStars] = useState(0);
  const [showRatingsWall, setShowRatingsWall] = useState(false);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  useEffect(() => {
    const savedTheme = storage.getTheme();
    const savedName = storage.getUsername();
    setTheme(savedTheme);
    setUsername(savedName);
    setNameInput(savedName);
    document.documentElement.setAttribute('data-theme', savedTheme);
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setRatingsLoading(true);
    const { data } = await supabase
      .from('ratings')
      .select('*')
      .order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setAllRatings(data);
      const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
      setAvgStars(Math.round(avg * 10) / 10);
    }
    setRatingsLoading(false);
  };

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
    if (
      confirm('Clear all diary entries and mood logs? This cannot be undone.')
    ) {
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
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              autoFocus
              placeholder="Your name"
            />
            <button className={styles.saveNameBtn} onClick={saveName}>
              Save
            </button>
          </div>
        ) : (
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{username}</p>
            <button
              className={styles.editBtn}
              onClick={() => setEditingName(true)}
            >
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
              <p className={styles.settingDesc}>
                All data stays on your device
              </p>
            </div>
          </div>
          <span className={styles.badge}>Local</span>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLeft}>
            <span className={styles.settingIcon}>🗑</span>
            <div>
              <p className={styles.settingTitle}>Clear all data</p>
              <p className={styles.settingDesc}>
                Remove diary entries & mood logs
              </p>
            </div>
          </div>
          <button className={styles.dangerBtn} onClick={clearAllData}>
            Clear
          </button>
        </div>
      </div>

      {cleared && <div className={styles.toast}>Data cleared successfully</div>}

      {/* About */}
      <p className="section-label">About</p>
      <div className={styles.aboutCard}>
        <p className={styles.aboutTitle}>Moodify</p>
        <p className={styles.aboutDesc}>
          Your personal emotional companion. Track moods, write diary entries,
          and take care of yourself — all in one place.
        </p>
        <p className={styles.aboutVersion}>Version 1.0.0</p>
      </div>

      {/* ⭐ Ratings Section */}
      <p className="section-label">Ratings</p>
      <div className={styles.ratingsCard}>
        {ratingsLoading ? (
          <p className={styles.ratingsLoading}>Loading ratings...</p>
        ) : (
          <>
            <div className={styles.ratingsTop}>
              <div className={styles.ratingsLeft}>
                <span className={styles.bigAvg}>{avgStars || '—'}</span>
                <div>
                  <div className={styles.avgStarsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        style={{
                          color:
                            s <= Math.round(avgStars) ? '#EF9F27' : '#3a3650',
                          fontSize: '16px',
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className={styles.ratingCount}>
                    {allRatings.length} ratings
                  </p>
                </div>
              </div>
              <button
                className={styles.viewAllBtn}
                onClick={() => setShowRatingsWall(true)}
              >
                View all →
              </button>
            </div>

            {/* Preview — latest 2 ratings */}
            {allRatings.slice(0, 2).map((r) => (
              <div key={r.id} className={styles.miniCard}>
                <div className={styles.miniTop}>
                  <div className={styles.miniAvatar}>
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className={styles.miniName}>{r.name}</p>
                    <div>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          style={{
                            color: s <= r.stars ? '#EF9F27' : '#3a3650',
                            fontSize: '12px',
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={styles.miniDate}>
                    {new Date(r.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                {r.comment && <p className={styles.miniComment}>{r.comment}</p>}
              </div>
            ))}

            {allRatings.length === 0 && (
              <p className={styles.noRatings}>
                No ratings yet. Be the first! 🌟
              </p>
            )}
          </>
        )}
      </div>

      {/* Full Ratings Wall Modal */}
      {showRatingsWall && (
        <div
          className={styles.wallOverlay}
          onClick={() => setShowRatingsWall(false)}
        >
          <div
            className={styles.wallPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowRatingsWall(false)}
            >
              ✕
            </button>
            <p className={styles.wallTitle}>What people say 💬</p>
            <div className={styles.wallAvgRow}>
              <span className={styles.wallAvgNum}>{avgStars || '—'}</span>
              <div>
                <div>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{
                        color:
                          s <= Math.round(avgStars) ? '#EF9F27' : '#3a3650',
                        fontSize: '18px',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className={styles.wallCount}>{allRatings.length} ratings</p>
              </div>
            </div>
            <div className={styles.wallList}>
              {allRatings.length === 0 && (
                <p className={styles.noRatings}>
                  No ratings yet. Be the first! 🌟
                </p>
              )}
              {allRatings.map((r) => (
                <div key={r.id} className={styles.miniCard}>
                  <div className={styles.miniTop}>
                    <div className={styles.miniAvatar}>
                      {r.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className={styles.miniName}>{r.name}</p>
                      <div>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            style={{
                              color: s <= r.stars ? '#EF9F27' : '#3a3650',
                              fontSize: '12px',
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className={styles.miniDate}>
                      {new Date(r.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  {r.comment && (
                    <p className={styles.miniComment}>{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

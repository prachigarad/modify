'use client';
import { useState, useEffect } from 'react';
import { storage } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import styles from './Settings.module.css';

const LABELS = [
  '',
  'Terrible 😢',
  'Not great 😕',
  'Okay 😐',
  'Good 😊',
  'Excellent 🤩',
];

interface Rating {
  id: string;
  name: string;
  stars: number;
  comment: string;
  created_at: string;
}

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();

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

  // Edit rating state
  const [editingRating, setEditingRating] = useState<Rating | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editStars, setEditStars] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [editHovered, setEditHovered] = useState(0);
  const [editLoading, setEditLoading] = useState(false);

  // Rate Us popup state
  const [showRatePopup, setShowRatePopup] = useState(false);
  const [rateStars, setRateStars] = useState(0);
  const [rateHovered, setRateHovered] = useState(0);
  const [rateName, setRateName] = useState('');
  const [rateComment, setRateComment] = useState('');
  const [rateError, setRateError] = useState('');
  const [rateLoading, setRateLoading] = useState(false);
  const [rateSubmitted, setRateSubmitted] = useState(false);

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
    } else {
      setAllRatings([]);
      setAvgStars(0);
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
    const name = user?.name ? user.name : nameInput.trim() || 'User';

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

  // ── Delete rating ──────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Delete your rating? This cannot be undone.')) return;
    await supabase.from('ratings').delete().eq('id', id);
    fetchRatings();
  };

  // ── Open edit popup ────────────────────────────────────
  const handleEdit = (r: Rating) => {
    setShowRatingsWall(false);
    setEditingRating(r);
    setEditStars(r.stars);
    setEditComment(r.comment ?? '');
    setShowEditPopup(true);
  };

  // ── Save edited rating ─────────────────────────────────
  const handleEditSave = async () => {
    if (!editStars || !editingRating) return;
    setEditLoading(true);
    await supabase
      .from('ratings')
      .update({ stars: editStars, comment: editComment.trim() })
      .eq('id', editingRating.id);
    setEditLoading(false);
    setShowEditPopup(false);
    setEditingRating(null);
    fetchRatings();
  };

  // ── Submit new Rate Us rating ──────────────────────────
  const handleRateSubmit = async () => {
    if (!rateStars) {
      setRateError('Please select a star first!');
      return;
    }
    const submitterName = user ? user.name : rateName.trim();
    if (!submitterName) {
      setRateError('Please enter your name!');
      return;
    }
    setRateLoading(true);
    setRateError('');
    const { error: dbError } = await supabase
      .from('ratings')
      .insert([
        { name: submitterName, stars: rateStars, comment: rateComment.trim() },
      ]);
    if (dbError) {
      setRateError('Something went wrong. Try again!');
      setRateLoading(false);
      return;
    }
    setRateSubmitted(true);
    setRateLoading(false);
    fetchRatings();
    setTimeout(() => {
      setShowRatePopup(false);
      setRateSubmitted(false);
      setRateStars(0);
      setRateName('');
      setRateComment('');
    }, 2000);
  };

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className={styles.container}>
      {/* ── Profile ───────────────────────────────────── */}
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

      {/* ── Login / Logout ────────────────────────────── */}
      <div style={{ marginBottom: '8px' }}>
        {user ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '10px 14px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#EDE8FF',
                  color: '#534AB7',
                  fontWeight: 600,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user.initials}
              </span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {user.name}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                  }}
                >
                  Logged in
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.refresh();
              }}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push('/login')}
            style={{
              width: '100%',
              padding: '11px',
              background: 'var(--mood-gradient)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            👤 Log in to rate & manage your reviews
          </button>
        )}
      </div>

      {/* ── Preferences ───────────────────────────────── */}
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

      {/* ── Data & Privacy ────────────────────────────── */}
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

      {/* ── About ─────────────────────────────────────── */}
      <p className="section-label">About</p>
      <div className={styles.aboutCard}>
        <p className={styles.aboutTitle}>Moodify</p>
        <p className={styles.aboutDesc}>
          Your personal emotional companion. Track moods, write diary entries,
          and take care of yourself — all in one place.
        </p>
        <p className={styles.aboutVersion}>Version 1.0.0</p>
      </div>

      {/* ── Ratings Section ───────────────────────────── */}
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
              {/* View all + Rate Us buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={styles.viewAllBtn}
                  onClick={() => setShowRatingsWall(true)}
                >
                  View all →
                </button>
                <button
                  onClick={() => setShowRatePopup(true)}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--mood-gradient)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ⭐ Rate us
                </button>
              </div>
            </div>

            {/* Preview — latest 2 ratings */}
            {allRatings.slice(0, 2).map((r) => (
              <div key={r.id} className={styles.miniCard}>
                <div className={styles.miniTop}>
                  <div className={styles.miniAvatar}>
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className={styles.miniName}>
                      {r.name}
                      {user?.name === r.name && (
                        <span
                          style={{
                            fontSize: '10px',
                            marginLeft: '6px',
                            background: '#EDE8FF',
                            color: '#534AB7',
                            borderRadius: '10px',
                            padding: '1px 7px',
                          }}
                        >
                          You
                        </span>
                      )}
                    </p>
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

      {/* ── Full Ratings Wall Modal ────────────────────── */}
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
                      <p className={styles.miniName}>
                        {r.name}
                        {user?.name === r.name && (
                          <span
                            style={{
                              fontSize: '10px',
                              marginLeft: '6px',
                              background: '#EDE8FF',
                              color: '#534AB7',
                              borderRadius: '10px',
                              padding: '1px 7px',
                            }}
                          >
                            You
                          </span>
                        )}
                      </p>
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span className={styles.miniDate}>
                        {new Date(r.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      {/* Edit/Delete only for own rating */}
                      {user?.name === r.name && (
                        <>
                          <button
                            onClick={() => handleEdit(r)}
                            title="Edit your rating"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px',
                              padding: '2px 4px',
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            title="Delete your rating"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px',
                              padding: '2px 4px',
                            }}
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>
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

      {/* ── Edit Rating Popup ─────────────────────────── */}
      {showEditPopup && editingRating && (
        <div
          className={styles.wallOverlay}
          onClick={() => setShowEditPopup(false)}
        >
          <div
            className={styles.wallPopup}
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '24px', maxHeight: 'unset' }}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowEditPopup(false)}
            >
              ✕
            </button>
            <p className={styles.wallTitle}>Edit your rating ✏️</p>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            >
              Editing as <strong>{editingRating.name}</strong>
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                margin: '8px 0 4px',
              }}
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setEditStars(s)}
                  onMouseEnter={() => setEditHovered(s)}
                  onMouseLeave={() => setEditHovered(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '32px',
                    padding: '0',
                    color:
                      s <= (editHovered || editStars) ? '#EF9F27' : '#D3D1C7',
                    transition: 'transform 0.1s',
                    transform: s === editHovered ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <p
              style={{
                textAlign: 'center',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '14px',
              }}
            >
              {LABELS[editStars] || 'Select stars'}
            </p>
            <textarea
              rows={3}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Update your comment... (optional)"
              style={{
                width: '100%',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '13px',
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none',
                marginBottom: '14px',
                boxSizing: 'border-box' as const,
              }}
            />
            <button
              onClick={handleEditSave}
              disabled={!editStars || editLoading}
              style={{
                width: '100%',
                padding: '13px',
                background: 'var(--mood-gradient)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: 500,
                fontSize: '14px',
                cursor: editStars ? 'pointer' : 'not-allowed',
                opacity: editStars ? 1 : 0.6,
                transition: 'opacity 0.2s',
              }}
            >
              {editLoading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {/* ── Rate Us Popup ─────────────────────────────── */}
      {showRatePopup && (
        <div
          className={styles.wallOverlay}
          onClick={() => setShowRatePopup(false)}
        >
          <div
            className={styles.wallPopup}
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '28px 24px',
              maxHeight: 'unset',
              textAlign: 'center',
            }}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setShowRatePopup(false)}
            >
              ✕
            </button>

            {!rateSubmitted ? (
              <>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎵</div>
                <p className={styles.wallTitle}>Enjoying Moodify?</p>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px',
                  }}
                >
                  Rate your experience!
                </p>

                {/* Show logged-in user name OR name input */}
                {user ? (
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      marginBottom: '12px',
                      fontWeight: 500,
                    }}
                  >
                    Rating as <strong>{user.name}</strong>
                  </p>
                ) : (
                  <input
                    type="text"
                    placeholder="Your name *"
                    value={rateName}
                    onChange={(e) => {
                      setRateName(e.target.value);
                      setRateError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      marginBottom: '10px',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box' as const,
                      fontFamily: 'inherit',
                    }}
                  />
                )}

                {/* Stars */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '6px',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setRateStars(s);
                        setRateError('');
                      }}
                      onMouseEnter={() => setRateHovered(s)}
                      onMouseLeave={() => setRateHovered(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '38px',
                        padding: '0',
                        lineHeight: 1,
                        color:
                          s <= (rateHovered || rateStars)
                            ? '#EF9F27'
                            : '#D3D1C7',
                        transition: 'transform 0.1s',
                        transform:
                          s === rateHovered ? 'scale(1.15)' : 'scale(1)',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    minHeight: '20px',
                    marginBottom: '14px',
                    fontWeight: 500,
                    color: rateError ? '#E24B4A' : 'var(--text-secondary)',
                  }}
                >
                  {rateError ||
                    (rateHovered
                      ? LABELS[rateHovered]
                      : rateStars
                        ? LABELS[rateStars]
                        : 'Tap a star to rate')}
                </p>

                <textarea
                  rows={3}
                  placeholder="Tell us what you think... (optional)"
                  value={rateComment}
                  onChange={(e) => setRateComment(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    resize: 'none',
                    outline: 'none',
                    marginBottom: '14px',
                    boxSizing: 'border-box' as const,
                  }}
                />

                <button
                  onClick={handleRateSubmit}
                  disabled={rateLoading}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: 'var(--mood-gradient)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    opacity: rateLoading ? 0.6 : 1,
                  }}
                >
                  {rateLoading ? 'Submitting...' : 'Submit rating'}
                </button>
                <button
                  onClick={() => setShowRatePopup(false)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  Maybe later
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '44px', marginBottom: '12px' }}>🎉</div>
                <p className={styles.wallTitle}>
                  Thank you, {user ? user.name : rateName}!
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4px',
                    marginBottom: '10px',
                  }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: '24px',
                        color: s <= rateStars ? '#EF9F27' : '#D3D1C7',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Your rating has been saved! 🌟
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

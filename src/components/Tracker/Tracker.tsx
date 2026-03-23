'use client';
import { useState, useEffect } from 'react';
import { storage, MoodLog } from '@/lib/data';
import styles from './Tracker.module.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const LOG_EMOJIS = ['😄', '😢', '😌', '⚡', '🎯', '💕', '😴', '😤'];

export default function Tracker() {
  const [logs, setLogs] = useState<MoodLog>({});
  const [showPicker, setShowPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  useEffect(() => {
    setLogs(storage.getLogs());
  }, []);

  // Build last 7 days
  const today = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return { date: d, key: d.toDateString(), day: DAYS[d.getDay()] };
  });

  const allEntries = Object.values(logs);
  const totalEntries = allEntries.length;

  // Streak
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (logs[d.toDateString()]) streak++;
    else break;
  }

  // Top mood
  const counts: Record<string, number> = {};
  allEntries.forEach(e => { counts[e] = (counts[e] || 0) + 1; });
  const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  const confirmLog = () => {
    if (!selectedEmoji) return;
    const updated = { ...logs, [today.toDateString()]: selectedEmoji };
    setLogs(updated);
    storage.setLogs(updated);
    setShowPicker(false);
    setSelectedEmoji(null);
  };

  return (
    <div className={styles.container}>
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statNum}>{streak}</span>
          <span className={styles.statLabel}>Day streak</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNum}>{totalEntries}</span>
          <span className={styles.statLabel}>Total logs</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statNum}>{topMood ? topMood[0] : '—'}</span>
          <span className={styles.statLabel}>Top mood</span>
        </div>
      </div>

      {/* Weekly View */}
      <p className="section-label">This week</p>
      <div className={styles.weekGrid}>
        {last7.map(({ key, day, date }) => (
          <div
            key={key}
            className={`${styles.dayCell} ${logs[key] ? styles.dayCellFilled : ''}`}
          >
            <span className={styles.dayName}>{day}</span>
            <span className={styles.dayEmoji}>
              {logs[key] || <span className={styles.emptyDot} />}
            </span>
            <span className={styles.dayNum}>{date.getDate()}</span>
          </div>
        ))}
      </div>

      {/* Log Button */}
      <div className={styles.logSection}>
        {!logs[today.toDateString()] ? (
          <>
            <button className="btn-primary" onClick={() => setShowPicker(p => !p)}>
              + Log today's mood
            </button>
            {showPicker && (
              <div className={styles.pickerCard}>
                <p className={styles.pickerLabel}>How are you feeling today?</p>
                <div className={styles.emojiPicker}>
                  {LOG_EMOJIS.map(e => (
                    <button
                      key={e}
                      className={`${styles.emojiBtn} ${selectedEmoji === e ? styles.emojiSelected : ''}`}
                      onClick={() => setSelectedEmoji(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
                <button
                  className="btn-outline"
                  onClick={confirmLog}
                  disabled={!selectedEmoji}
                >
                  Save mood
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.loggedBanner}>
            <span className={styles.loggedEmoji}>{logs[today.toDateString()]}</span>
            <div>
              <p className={styles.loggedTitle}>Mood logged for today!</p>
              <p className={styles.loggedSub}>Come back tomorrow to keep your streak</p>
            </div>
          </div>
        )}
      </div>

      {/* Full History */}
      {totalEntries > 0 && (
        <>
          <p className="section-label">Mood history</p>
          <div className={styles.historyGrid}>
            {Object.entries(logs)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .slice(0, 14)
              .map(([dateStr, emoji]) => (
                <div key={dateStr} className={styles.historyCell}>
                  <span className={styles.historyEmoji}>{emoji}</span>
                  <span className={styles.historyDate}>
                    {new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

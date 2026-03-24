'use client';
import { useState, useEffect } from 'react';
import { storage, DiaryEntry, MOODS } from '@/lib/data';
import styles from './Diary.module.css';

const EMOJIS = ['😊', '😢', '😌', '😤', '🥰', '😴', '🤩', '😰'];
export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setEntries(storage.getEntries());
  }, []);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const saveEntry = () => {
    if (!text.trim()) return;
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      emoji: selectedEmoji,
      mood: selectedEmoji,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    storage.setEntries(updated);
    setText('');
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    storage.setEntries(updated);
  };

  const filtered = entries.filter((e) => {
    const matchFilter = filter === 'all' || e.emoji === filter;
    const matchSearch = e.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className={styles.container}>
      {/* Write Entry */}
      <div className={styles.writeCard}>
        <div className={styles.cardHeader}>
          <span className={styles.dateLabel}>{today}</span>
        </div>
        <div className={styles.emojiRow}>
          {EMOJIS.map((e) => (
            <button
              key={e}
              className={`${styles.emojiBtn} ${selectedEmoji === e ? styles.emojiSelected : ''}`}
              onClick={() => setSelectedEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
        <textarea
          className={styles.textarea}
          placeholder="What's on your mind today?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
        <button
          className="btn-primary"
          onClick={saveEntry}
          disabled={!text.trim()}
        >
          Save Entry
        </button>
      </div>

      {/* Search */}
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search entries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filter by emoji */}
      <div className={styles.filterRow}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {EMOJIS.slice(0, 5).map((e) => (
          <button
            key={e}
            className={`${styles.filterBtn} ${filter === e ? styles.filterActive : ''}`}
            onClick={() => setFilter(e)}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Entries */}
      <p className="section-label">
        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
      </p>
      <div className={styles.entriesList}>
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyEmoji}>📓</p>
            <p className={styles.emptyText}>
              No entries yet. Write your first one!
            </p>
          </div>
        )}
        {filtered.map((entry) => (
          <div key={entry.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <div className={styles.entryMeta}>
                <span className={styles.entryEmoji}>{entry.emoji}</span>
                <span className={styles.entryDate}>{entry.date}</span>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => deleteEntry(entry.id)}
              >
                ✕
              </button>
            </div>
            <p className={styles.entryText}>{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

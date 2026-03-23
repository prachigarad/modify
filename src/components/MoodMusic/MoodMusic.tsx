'use client';
import { useState } from 'react';
import { MOODS, SONGS, QUOTES, Mood } from '@/lib/data';
import styles from './MoodMusic.module.css';

export default function MoodMusic() {
  const [selectedMood, setSelectedMood] = useState<Mood>('happy');
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const currentMoodData = MOODS.find(m => m.id === selectedMood)!;
  const songs = SONGS[selectedMood];
  const quote = QUOTES[selectedMood][Math.floor(Math.random() * 3)];

  const handlePlay = (index: number, query: string) => {
    setPlayingIndex(index);
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={styles.container}>
      {/* Quote Banner */}
      <div
        className={styles.quoteBanner}
        style={{ background: currentMoodData.bg, borderColor: currentMoodData.color + '30' }}
      >
        <span className={styles.quoteEmoji}>{currentMoodData.emoji}</span>
        <p className={styles.quoteText} style={{ color: currentMoodData.color }}>
          {quote}
        </p>
      </div>

      {/* Mood Grid */}
      <p className="section-label">How are you feeling?</p>
      <div className={styles.moodGrid}>
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            className={`${styles.moodCard} ${selectedMood === mood.id ? styles.selected : ''}`}
            style={selectedMood === mood.id
              ? { background: mood.bg, borderColor: mood.color }
              : {}
            }
            onClick={() => { setSelectedMood(mood.id); setPlayingIndex(null); }}
          >
            <span className={styles.moodEmoji}>{mood.emoji}</span>
            <span
              className={styles.moodLabel}
              style={selectedMood === mood.id ? { color: mood.color } : {}}
            >
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Songs */}
      <p className="section-label">Playlist for you</p>
      <div className={styles.songList}>
        {songs.map((song, i) => (
          <div
            key={i}
            className={`${styles.songCard} ${playingIndex === i ? styles.playing : ''}`}
            style={playingIndex === i ? { borderColor: currentMoodData.color } : {}}
          >
            <div
              className={styles.songThumb}
              style={{ background: currentMoodData.bg, color: currentMoodData.color }}
            >
              {song.emoji}
            </div>
            <div className={styles.songInfo}>
              <p className={styles.songTitle}>{song.title}</p>
              <p className={styles.songArtist}>{song.artist}</p>
            </div>
            <button
              className={styles.playBtn}
              style={{ background: currentMoodData.color }}
              onClick={() => handlePlay(i, song.youtubeQuery)}
            >
              ▶
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

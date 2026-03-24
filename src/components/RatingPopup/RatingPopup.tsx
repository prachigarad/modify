'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './RatingPopup.module.css';

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

export default function RatingPopup() {
  const [visible, setVisible] = useState(false);
  const [showWall, setShowWall] = useState(false);
  const [rating, setRatingVal] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [allRatings, setAllRatings] = useState<Rating[]>([]);
  const [avgStars, setAvgStars] = useState(0);

  useEffect(() => {
    const alreadyRated = localStorage.getItem('moodify-rated');
    if (alreadyRated) return;
    const timer = setTimeout(() => setVisible(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showWall) fetchRatings();
  }, [showWall]);

  const fetchRatings = async () => {
    const { data } = await supabase
      .from('ratings')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setAllRatings(data);
      const avg = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
      setAvgStars(Math.round(avg * 10) / 10);
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      setError('Please select a star first!');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name!');
      return;
    }
    setLoading(true);
    setError('');

    const { error: dbError } = await supabase
      .from('ratings')
      .insert([{ name: name.trim(), stars: rating, comment: comment.trim() }]);

    if (dbError) {
      setError('Something went wrong. Try again!');
      setLoading(false);
      return;
    }

    localStorage.setItem('moodify-rated', 'true');
    setSubmitted(true);
    setLoading(false);
    setTimeout(() => {
      setVisible(false);
      setShowWall(true);
    }, 2000);
  };

  const handleSkip = () => setVisible(false);

  if (!visible && !showWall) return null;

  if (showWall) {
    return (
      <div className={styles.overlay} onClick={() => setShowWall(false)}>
        <div className={styles.wallPopup} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.closeBtn}
            onClick={() => setShowWall(false)}
          >
            ✕
          </button>
          <div className={styles.wallHeader}>
            <p className={styles.wallTitle}>What people say 💬</p>
            <div className={styles.avgRow}>
              <span className={styles.avgNum}>{avgStars || '—'}</span>
              <div>
                <div className={styles.avgStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={
                        s <= Math.round(avgStars)
                          ? styles.starLit
                          : styles.starDim
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className={styles.totalCount}>{allRatings.length} ratings</p>
              </div>
            </div>
          </div>
          <div className={styles.ratingsList}>
            {allRatings.length === 0 && (
              <p className={styles.emptyText}>
                No ratings yet. Be the first! 🌟
              </p>
            )}
            {allRatings.map((r) => (
              <div key={r.id} className={styles.ratingCard}>
                <div className={styles.ratingCardTop}>
                  <div className={styles.raterAvatar}>
                    {r.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className={styles.raterInfo}>
                    <p className={styles.raterName}>{r.name}</p>
                    <div className={styles.raterStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          style={{
                            color: s <= r.stars ? '#EF9F27' : '#D3D1C7',
                            fontSize: '14px',
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className={styles.ratingDate}>
                    {new Date(r.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
                {r.comment && (
                  <p className={styles.ratingComment}>{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {!submitted ? (
          <>
            <div className={styles.icon}>🎵</div>
            <h2 className={styles.title}>Enjoying Moodify?</h2>
            <p className={styles.sub}>Rate your experience!</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  className={`${styles.star} ${(hovered || rating) >= s ? styles.lit : ''}`}
                  onClick={() => {
                    setRatingVal(s);
                    setError('');
                  }}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                >
                  ★
                </button>
              ))}
            </div>
            <p
              className={`${styles.starLabel} ${error ? styles.errorLabel : ''}`}
            >
              {error ||
                (hovered
                  ? LABELS[hovered]
                  : rating
                    ? LABELS[rating]
                    : 'Tap a star to rate')}
            </p>
            <input
              className={styles.inputBox}
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
            />
            <textarea
              className={styles.textarea}
              placeholder="Tell us what you think... (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit rating'}
            </button>
            <button className={styles.skipBtn} onClick={handleSkip}>
              Maybe later
            </button>
          </>
        ) : (
          <div className={styles.thankWrap}>
            <div className={styles.thankIcon}>🎉</div>
            <h2 className={styles.thankTitle}>Thank you, {name}!</h2>
            <div className={styles.thankStars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: '24px',
                    color: s <= rating ? '#EF9F27' : '#D3D1C7',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <p className={styles.thankSub}>Loading everyone's ratings...</p>
          </div>
        )}
      </div>
    </div>
  );
}

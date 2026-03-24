'use client';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      {/* Creator Card */}
      <div className={styles.creatorCard}>
        <div className={styles.avatar}>PG</div>
        <h2 className={styles.name}>Prachi Garad</h2>
        <p className={styles.role}>Software Developer</p>
        <p className={styles.sub}>React Frontend Developer</p>
        <div className={styles.badgeRow}>
          <span className={styles.badgePurple}>React.js</span>
          <span className={styles.badgeTeal}>Next.js</span>
          <span className={styles.badgeCoral}>TypeScript</span>
          <span className={styles.badgePurple}>Frontend Dev</span>
        </div>
      </div>

      {/* App Info */}
      <p className={styles.sectionLabel}>About the app</p>
      <div className={styles.appCard}>
        <div className={styles.appHeader}>
          <div className={styles.appIcon}>🎵</div>
          <div>
            <p className={styles.appName}>Moodify</p>
            <p className={styles.appTagline}>
              Your personal emotional companion
            </p>
          </div>
        </div>

        <p className={styles.appDesc}>
          Moodify is a mental wellness web app that combines mood-based music,
          personal diary, breathing exercises and mood tracking — all in one
          place. No login needed. Everything stays private on your device.
        </p>

        <div className={styles.featureGrid}>
          {[
            { icon: '🎵', label: 'Mood music' },
            { icon: '📓', label: 'Personal diary' },
            { icon: '🌿', label: 'Breathing exercise' },
            { icon: '📊', label: 'Mood tracker' },
          ].map((f) => (
            <div key={f.label} className={styles.featureItem}>
              <span className={styles.featIcon}>{f.icon}</span>
              <span className={styles.featLabel}>{f.label}</span>
            </div>
          ))}
        </div>

        <p className={styles.sectionLabel}>Built with</p>
        <div className={styles.techRow}>
          {[
            'Next.js 14',
            'React 18',
            'TypeScript',
            'CSS Modules',
            'localStorage',
          ].map((t) => (
            <span key={t} className={styles.techBadge}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <p className={styles.sectionLabel}>Links</p>
      <div className={styles.linksCard}>
        <a
          href="https://moodify-sigma-rose.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className={styles.linkRow}
        >
          <div className={styles.linkLeft}>
            <div className={`${styles.linkIcon} ${styles.iconPurple}`}>🌐</div>
            <div>
              <p className={styles.linkTitle}>Live app</p>
              <p className={styles.linkUrl}>modify-prachigarad.vercel.app</p>
            </div>
          </div>
          <span className={styles.arrow}>›</span>
        </a>

        <a
          href="https://github.com/prachigarad/modify"
          target="_blank"
          rel="noreferrer"
          className={styles.linkRow}
        >
          <div className={styles.linkLeft}>
            <div className={`${styles.linkIcon} ${styles.iconDark}`}>⌥</div>
            <div>
              <p className={styles.linkTitle}>GitHub</p>
              <p className={styles.linkUrl}>github.com/prachigarad/modify</p>
            </div>
          </div>
          <span className={styles.arrow}>›</span>
        </a>

        <a
          href="https://www.linkedin.com/in/prachi-garad-1b465427a/"
          target="_blank"
          rel="noreferrer"
          className={styles.linkRow}
        >
          <div className={styles.linkLeft}>
            <div className={`${styles.linkIcon} ${styles.iconBlue}`}>in</div>
            <div>
              <p className={styles.linkTitle}>LinkedIn</p>
              <p className={styles.linkUrl}>linkedin.com/in/prachigarad</p>
            </div>
          </div>
          <span className={styles.arrow}>›</span>
        </a>
      </div>

      <p className={styles.version}>
        Moodify v1.0.0 — Made with love by Prachi Garad
      </p>
    </div>
  );
}

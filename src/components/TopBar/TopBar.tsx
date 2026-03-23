'use client';
import { useEffect, useState } from 'react';
import { storage } from '@/lib/data';
import styles from './TopBar.module.css';

interface TopBarProps {
  title?: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [username, setUsername] = useState('Friend');

  useEffect(() => {
    setUsername(storage.getUsername());
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className={styles.topbar}>
      <div>
        {title ? (
          <>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </>
        ) : (
          <>
            <p className={styles.greeting}>Hey {username} 👋</p>
            <h1 className={styles.brand}>Moodify</h1>
          </>
        )}
      </div>
      <div className={styles.avatar}>{initials}</div>
    </div>
  );
}

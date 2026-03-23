'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { href: '/',        label: 'Music',   icon: '♪' },
  { href: '/diary',   label: 'Diary',   icon: '📓' },
  { href: '/relax',   label: 'Relax',   icon: '🌿' },
  { href: '/tracker', label: 'Tracker', icon: '📊' },
  { href: '/settings',label: 'Settings',icon: '⚙️' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {isActive && <span className={styles.activeDot} />}
          </Link>
        );
      })}
    </nav>
  );
}

import Link from 'next/link';
import styles from '../admin/layout.module.css';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <Link href="/organizer" className={styles.logo}>
          <i>STRIDE</i>X <span className={styles.adminBadge} style={{ background: '#7C3AED' }}>Organizer</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/organizer" className={styles.navLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.navIcon}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </Link>
          <Link href="/organizer/events" className={styles.navLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.navIcon}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            My Events
          </Link>
          <Link href="/organizer/registrations" className={styles.navLink}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.navIcon}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Registrations
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backLink}>← Back to Site</Link>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
          <i>STRIDE</i>X
        </Link>
        
        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>

        <div className={`${styles.navWrapper} ${isMenuOpen ? styles.isOpen : ''}`}>
          <nav className={styles.nav}>
            <Link href="/events" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Events</Link>
            <Link href="/blog" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Blog</Link>
            <Link href="/apply-as-organizer" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Host an Event</Link>
          </nav>

          <div className={styles.actions}>
            {user ? (
              <div className={styles.userActions}>
                <span className={styles.userEmail}>
                  {user.email || 'User'}
                </span>
                {user.email === 'bautistajared995@gmail.com' && (
                  <Link href="/admin" className="btn-secondary" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

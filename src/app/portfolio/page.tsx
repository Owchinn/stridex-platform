import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import PublicLayout from '../components/PublicLayout';
import styles from './page.module.css';

export const revalidate = 0;

export default async function PortfolioPage() {
  const { data: pastEvents } = await supabase
    .from('events')
    .select('*, event_categories(*)')
    .eq('status', 'PAST')
    .order('date', { ascending: false });

  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .neq('status', 'PAST')
    .order('date', { ascending: true });

  return (
    <PublicLayout>
    <div className={styles.pageWrapper}>
      <div className={styles.heroSection}>
        <div className="container">
          <h1 className={styles.title}>Our Portfolio</h1>
          <p className={styles.subtitle}>
            A showcase of the races and events we have powered. From ultra trails to city marathons, we bring premium experiences to life.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`container ${styles.statsSection}`}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{(pastEvents?.length || 0) + (upcomingEvents?.length || 0)}</span>
          <span className={styles.statLabel}>Total Events</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{pastEvents?.length || 0}</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{upcomingEvents?.length || 0}</span>
          <span className={styles.statLabel}>Upcoming</span>
        </div>
      </div>

      {/* Past Events Gallery */}
      <div className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Past Editions</h2>
        {pastEvents && pastEvents.length > 0 ? (
          <div className={styles.pastGrid}>
            {pastEvents.map((event: any) => (
              <Link href={`/events/${event.id}`} key={event.id} className={styles.pastCard}>
                <div className={styles.pastImageWrap}>
                  <img src={event.image} alt={event.title} className={styles.pastImage} />
                  <div className={styles.pastOverlay}>
                    <h3>{event.title}</h3>
                    <p>{event.location}</p>
                    <p>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>No past events yet.</p>
        )}
      </div>
    </div>
    </PublicLayout>
  );
}

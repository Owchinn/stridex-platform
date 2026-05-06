import { getEvents } from '../data/events';
import EventCard from '../components/EventCard';
import PublicLayout from '../components/PublicLayout';
import styles from './page.module.css';

export const revalidate = 0;

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <PublicLayout>
    <div className={styles.pageWrapper}>
      <div className={`container ${styles.header}`}>
        <h1 className={styles.title}>All Races</h1>
        <p className={styles.subtitle}>Discover your next challenge. Register now for our premium endurance events.</p>
      </div>

      <div className={`container ${styles.grid}`}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
    </PublicLayout>
  );
}

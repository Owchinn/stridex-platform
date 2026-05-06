import Link from "next/link";
import styles from "./page.module.css";
import { getEvents } from "./data/events";
import EventCard from "./components/EventCard";
import PublicLayout from "./components/PublicLayout";

export const revalidate = 0; // Disable caching for now to always fetch latest

export default async function Home() {
  const events = await getEvents();

  return (
    <PublicLayout>
    <div className={styles.heroWrapper}>
      <div className={styles.bgImage}></div>
      <div className={styles.overlay}></div>
      <div className={`container ${styles.heroContent}`}>
        <p className={`${styles.subtitle} animate-fade-in-up`}>
          OFFICIAL REGISTRATION PLATFORM
        </p>
        <h1 className={`${styles.title} animate-fade-in-up delay-1`}>
          Premium Events.<br />
          <span className={styles.highlight}>Seamless</span> Flow.
        </h1>
        <p className={`${styles.description} animate-fade-in-up delay-2`}>
          We provide the underlying infrastructure for the world's most demanding endurance races.
        </p>
        <div className={`${styles.actions} animate-fade-in-up delay-3`}>
          <Link href="/events" className="btn-primary">
            Explore Races
          </Link>
          <Link href="/portfolio" className="btn-secondary">
            Past Editions
          </Link>
        </div>
      </div>
    </div>
    
    <section className={`container ${styles.featuredSection}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Featured Events</h2>
        <Link href="/events" className={styles.viewAll}>
          View All Races &rarr;
        </Link>
      </div>
      <div className={styles.grid}>
        {events.slice(0, 3).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
    </PublicLayout>
  );
}

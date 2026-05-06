import Link from 'next/link';
import Image from 'next/image';
import styles from './EventCard.module.css';
import { StrideXEvent } from '../data/events';

interface EventCardProps {
  event: StrideXEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const isUpcoming = event.status === 'UPCOMING';

  return (
    <Link href={`/events/${event.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={event.image} 
          alt={event.title} 
          className={styles.image}
        />
        <div className={`${styles.badge} ${isUpcoming ? styles.badgeUpcoming : styles.badgePast}`}>
          {event.status}
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.location}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {event.location}
        </p>
        <p className={styles.date}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {new Date(event.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </Link>
  );
}

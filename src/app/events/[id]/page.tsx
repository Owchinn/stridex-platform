import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEventById } from '../../data/events';
import PublicLayout from '../../components/PublicLayout';
import EventCountdown from '../../components/EventCountdown';
import styles from './page.module.css';

export const revalidate = 0;

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = await getEventById(resolvedParams.id);
  
  if (!event) {
    notFound();
  }

  const isUpcoming = event.status === 'UPCOMING';

  const currentTime = new Date().getTime();
  const earlyBirdDeadlineTime = event.early_bird_deadline ? new Date(event.early_bird_deadline).getTime() : 0;
  const isEarlyBirdActive = currentTime < earlyBirdDeadlineTime;
  const earlyBirdDaysLeft = isEarlyBirdActive ? Math.ceil((earlyBirdDeadlineTime - currentTime) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <PublicLayout>
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <img src={event.image} alt={event.title} className={styles.heroImage} />
        <div className={styles.overlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.badge}>{event.status}</div>
          <h1 className={styles.title}>{event.title}</h1>
          <div className={styles.meta}>
            <span>📍 {event.location}</span>
            <span>📅 {new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
          </div>
        </div>
      </div>

      <div className={`container ${styles.contentLayout}`}>
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2>About The Race</h2>
            <p>{event.description}</p>
          </section>

          {event.map_image && (
            <section className={styles.section}>
              <h2>Route Map & Elevation</h2>
              <img src={event.map_image} alt="Route Map" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
            </section>
          )}

          {event.racekit_image && (
            <section className={styles.section}>
              <h2>Race Inclusions / Racekit</h2>
              <img src={event.racekit_image} alt="Racekit Inclusions" style={{ width: '100%', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.registrationCard}>
            
            {event.registration_deadline && isUpcoming && (
              <div style={{ marginBottom: '1.5rem' }}>
                <EventCountdown registrationDeadline={event.registration_deadline} />
              </div>
            )}

            <h3>Registration Categories</h3>
            
            {isEarlyBirdActive && (
              <div style={{ background: '#FEF3C7', color: '#92400E', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid #FCD34D' }}>
                ⭐ Early Bird price ends in {earlyBirdDaysLeft} day{earlyBirdDaysLeft !== 1 && 's'}!
              </div>
            )}

            <ul className={styles.categoryList}>
              {event.categories.map(cat => (
                <li key={cat.id} className={styles.categoryItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span className={styles.catName}>{cat.name}</span>
                    <span className={styles.catDist}>{cat.distance}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', alignSelf: 'flex-end' }}>
                    {isEarlyBirdActive && cat.early_bird_price ? (
                      <>
                        <span style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                          PHP {cat.base_price.toLocaleString()}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ background: '#DC2626', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                            Limited Time
                          </span>
                          <span className={styles.catPrice} style={{ color: '#DC2626' }}>
                            PHP {cat.early_bird_price.toLocaleString()}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className={styles.catPrice}>PHP {cat.base_price.toLocaleString()}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            
            {isUpcoming ? (
              <Link href={`/events/${event.id}/register`} className={`btn-primary ${styles.registerBtn}`}>
                Register Now
              </Link>
            ) : (
              <button className={`btn-secondary ${styles.registerBtn}`} disabled>
                Registration Closed
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
    </PublicLayout>
  );
}

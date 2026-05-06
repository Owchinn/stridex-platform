import { notFound } from 'next/navigation';
import { getEventById } from '../../../data/events';
import RegistrationForm from './RegistrationForm';
import PublicLayout from '../../../components/PublicLayout';
import styles from './page.module.css';

export const revalidate = 0;

export default async function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = await getEventById(resolvedParams.id);
  
  if (!event || event.status !== 'UPCOMING') {
    notFound();
  }

  return (
    <PublicLayout>
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Registration: {event.title}</h1>
          <p className={styles.subtitle}>Complete the form below to secure your spot.</p>
        </div>
      </div>
      <div className={`container ${styles.formContainer}`}>
        <RegistrationForm event={event} />
      </div>
    </div>
    </PublicLayout>
  );
}

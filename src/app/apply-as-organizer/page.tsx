'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import PublicLayout from '../components/PublicLayout';
import styles from './page.module.css';

export default function ApplyAsOrganizerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    organization_name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setFormData(prev => ({ ...prev, email: user.email || '' }));

      // Check if already applied
      const { data } = await supabase
        .from('organizers')
        .select('id, approved')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setAlreadyApplied(true);
        if (data.approved) {
          router.push('/organizer');
          return;
        }
      }
      setLoading(false);
    });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const { error } = await supabase.from('organizers').insert([{
      user_id: user.id,
      name: formData.name,
      organization_name: formData.organization_name || null,
      email: formData.email,
      phone: formData.phone || null,
      approved: false
    }]);

    if (error) {
      alert('Error submitting application: ' + error.message);
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (loading) return <PublicLayout><div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div></PublicLayout>;

  return (
    <PublicLayout>
      <div className={styles.pageWrapper}>
        <div className={styles.formCard}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconBadge}>🏁</div>
            <h1 className={styles.title}>Become a StrideX Organizer</h1>
            <p className={styles.subtitle}>
              Partner with StrideX to host your running events on our platform. Fill out the form below and our team will review your application.
            </p>
          </div>

          {/* Already Applied */}
          {alreadyApplied && !submitted && (
            <div className={styles.alertWarning}>
              <strong>Application Under Review</strong>
              <p>You've already submitted an organizer application. We'll notify you once it's approved by our team.</p>
            </div>
          )}

          {/* Success State */}
          {submitted && (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✅</div>
              <h2>Application Submitted!</h2>
              <p>Thank you for applying! Our admin team will review your application and reach out within 1–2 business days.</p>
              <button onClick={() => router.push('/')} className="btn-primary" style={{ marginTop: '1.5rem' }}>
                Back to Home
              </button>
            </div>
          )}

          {/* Application Form */}
          {!alreadyApplied && !submitted && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name *</label>
                  <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Juan dela Cruz" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="organization_name">Organization / Club Name</label>
                  <input id="organization_name" type="text" name="organization_name" value={formData.organization_name} onChange={handleChange} placeholder="e.g. Baguio Trail Runners" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required readOnly style={{ opacity: 0.7 }} />
                  <span className={styles.hint}>Linked to your logged-in account</span>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+63 917 000 0000" />
                </div>
              </div>

              <div className={styles.infoBox}>
                <strong>What happens next?</strong>
                <ul>
                  <li>✓ Our admin team reviews your application (1–2 business days)</li>
                  <li>✓ Once approved, log in to access your Organizer Dashboard</li>
                  <li>✓ Create and manage your own events on StrideX</li>
                </ul>
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

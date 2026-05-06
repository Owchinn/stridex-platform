import PublicLayout from '../components/PublicLayout';

export default function TermsOfServicePage() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Terms of Service</h1>
        <div style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
          <p style={{ marginBottom: '1.5rem' }}>
            Welcome to StrideX. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.
          </p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2rem', marginBottom: '1rem' }}>User Responsibilities</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            You must provide accurate information when registering for events. You are responsible for ensuring you are medically fit to participate in endurance races.
          </p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2rem', marginBottom: '1rem' }}>Refunds & Cancellations</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            All refund and cancellation policies are determined by the respective event organizers. StrideX facilitates the platform but does not dictate individual event terms.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

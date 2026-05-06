import PublicLayout from '../components/PublicLayout';

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Privacy Policy</h1>
        <div style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
          <p style={{ marginBottom: '1.5rem' }}>
            At StrideX, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our platform.
          </p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2rem', marginBottom: '1rem' }}>Information We Collect</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We collect information you provide when you register for an account, sign up for events, or contact us. This may include your name, email address, phone number, and payment details.
          </p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2rem', marginBottom: '1rem' }}>How We Use It</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We use your information to facilitate event registrations, communicate important updates, process payments securely, and improve our services.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

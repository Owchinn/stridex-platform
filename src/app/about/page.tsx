import PublicLayout from '../components/PublicLayout';

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>About StrideX</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '800px' }}>
          StrideX is the premier trail and road running event management platform in the Philippines.
          We provide the underlying infrastructure for the world's most demanding endurance races.
        </p>
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '800px' }}>
              To empower race organizers with seamless registration technology and to provide athletes with a frictionless experience from sign-up to the finish line.
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}

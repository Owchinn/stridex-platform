import PublicLayout from '../components/PublicLayout';

export default function AccessibilityPage() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Accessibility Statement</h1>
        <div style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            StrideX is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2rem', marginBottom: '1rem' }}>Conformance Status</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA. These guidelines explain how to make web content more accessible for people with disabilities.
          </p>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2rem', marginBottom: '1rem' }}>Feedback</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We welcome your feedback on the accessibility of StrideX. If you encounter any barriers, please let us know by emailing stridex.fit@gmail.com.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

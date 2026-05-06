import PublicLayout from '../components/PublicLayout';

export default function FAQPage() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Frequently Asked Questions</h1>
        
        <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>How do I register for a race?</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Simply create an account, browse our upcoming events, and click on "Register". You can pay using our secure payment gateways.</p>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Can I get a refund if I cancel?</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Refund policies vary by event and are set by the event organizer. Please check the specific event details for their cancellation policy.</p>
          </div>

          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>How do I host my own event?</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Navigate to "Become an Organizer" from the footer and submit your application. Our team will review and get back to you within 1-2 business days.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

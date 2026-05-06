import PublicLayout from '../components/PublicLayout';

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Contact Us</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px' }}>
          Have a question or need assistance? Send us a message and our support team will get back to you shortly.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Name</label>
              <input type="text" placeholder="Your name" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email</label>
              <input type="email" placeholder="your@email.com" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Message</label>
              <textarea rows={5} placeholder="How can we help?" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical' }}></textarea>
            </div>
            <button type="button" className="btn-primary" style={{ marginTop: '1rem' }}>Send Message</button>
          </form>

          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Direct Contact</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
              <li><strong>Email:</strong> stridex.fit@gmail.com</li>
              <li><strong>Phone:</strong> +63 995 063 6213</li>
              <li><strong>Address:</strong> Laguna, Philippines</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

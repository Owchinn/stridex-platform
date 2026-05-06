import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div className={`container ${styles.ctaInner}`}>
          <div className={styles.ctaText}>
            <h2>Ready to push your limits?</h2>
            <p>Join thousands of Filipino runners who trust StrideX for their next race.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/events" className={styles.ctaBtnPrimary}>Browse Events</Link>
            <Link href="/contact" className={styles.ctaBtnSecondary}>Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className={styles.mainFooter}>
        <div className={`container ${styles.footerGrid}`}>

          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoPace}>Stride</span>
              <span className={styles.logoX}>X</span>
            </Link>
            <p className={styles.tagline}>
              The premier trail and road running event management platform in the Philippines.
            </p>
            <div className={styles.socials}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://strava.com" target="_blank" rel="noreferrer" aria-label="Strava" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/></svg>
              </a>
            </div>
          </div>

          {/* Site Map Column */}
          <div className={styles.navCol}>
            <h4 className={styles.colHeading}>Explore</h4>
            <ul className={styles.linkList}>
              <li><Link href="/events">Upcoming Events</Link></li>
              <li><Link href="/portfolio">Past Races</Link></li>
              <li><Link href="/blog">Blog & News</Link></li>
              <li><Link href="/about">About StrideX</Link></li>
            </ul>
          </div>

          {/* Runners Column */}
          <div className={styles.navCol}>
            <h4 className={styles.colHeading}>For Runners</h4>
            <ul className={styles.linkList}>
              <li><Link href="/events">Register for a Race</Link></li>
              <li><Link href="/blog">Training Tips</Link></li>
              <li><Link href="/blog">Race Day Guide</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/apply-as-organizer">Become an Organizer</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className={styles.navCol}>
            <h4 className={styles.colHeading}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:stridex.fit@gmail.com">stridex.fit@gmail.com</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.18 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:+639950636213">+63 995 063 6213</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Laguna, Philippines</span>
              </li>
            </ul>
            <Link href="/contact" className={styles.contactBtn}>
              Send us a Message →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`}>
          <p className={styles.copyright}>
            © {currentYear} StrideX Events Inc. All rights reserved.
          </p>
          <ul className={styles.legalLinks}>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service">Terms of Service</Link></li>
            <li><Link href="/accessibility">Accessibility Statement</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';
import PublicLayout from '../components/PublicLayout';
import styles from './page.module.css';

const ADMIN_EMAIL = 'bautistajared995@gmail.com';

export default function LoginPage() {
  const router = useRouter();
  
  // Auto-redirect if already logged in (handles Google OAuth return)
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const email = session.user.email;

      // 1. Admin check
      if (email === ADMIN_EMAIL) {
        router.push('/admin');
        return;
      }

      // 2. Organizer check — look up organizers table
      const { data: organizer } = await supabase
        .from('organizers')
        .select('id, approved')
        .eq('user_id', session.user.id)
        .single();

      if (organizer) {
        router.push('/organizer');
        return;
      }

      // 3. Regular user
      router.push('/events');
    });
  }, [router]);

  // View states: 'login' | 'register' | 'confirm'
  const [view, setView] = useState<'login' | 'register' | 'confirm'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (view === 'register' && !agreedToTerms) {
      setError('You must agree to the Terms and Conditions to register.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`, // Returns here to trigger the auto-redirect
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google authentication.');
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'register' && !agreedToTerms) {
      setError('You must agree to the Terms and Conditions to register.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (view === 'register') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // If email confirmation is required, session will be null
        if (!data.session) {
          setView('confirm'); // Show 'check your email' screen
          setLoading(false);
          return;
        }
        // If email confirmation is disabled in Supabase, session exists → redirect
        // (handled by the useEffect above)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // The auto-redirect useEffect handles routing once session is set
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate.');
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className={styles.authWrapper}>
        <div className={styles.authCard}>

          {/* ── Email Confirmation Screen ── */}
          {view === 'confirm' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
              <h1 className={styles.title}>Check Your Email</h1>
              <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>
                We sent a confirmation link to <strong>{email}</strong>.<br />
                Click the link in your email to activate your account, then log in here.
              </p>
              <button
                type="button"
                onClick={() => { setView('login'); setError(null); }}
                className={`btn-primary ${styles.submitBtn}`}
              >
                Back to Login
              </button>
              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>
                Didn't receive it? Check your spam folder or try again.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.authHeader}>
                <h1 className={styles.title}>{view === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                <p className={styles.subtitle}>
                  {view === 'login'
                    ? 'Log in to manage your registrations and events.'
                    : 'Join StrideX to register for premium endurance races.'}
                </p>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <div className={styles.oauthSection}>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className={styles.googleBtn}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className={styles.divider}>
                <span>or</span>
              </div>

              <form onSubmit={handleEmailSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="runner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                    minLength={6}
                  />
                </div>

                {view === 'register' && (
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      required
                    />
                    <label htmlFor="terms">
                      I agree to the <Link href="/terms-of-service" className={styles.link}>Terms and Conditions</Link>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (view === 'register' && !agreedToTerms)}
                  className={`btn-primary ${styles.submitBtn}`}
                >
                  {loading ? 'Processing...' : (view === 'login' ? 'Log In' : 'Create Account')}
                </button>
              </form>

              <div className={styles.authFooter}>
                {view === 'login' ? (
                  <p>Don't have an account? <button type="button" onClick={() => setView('register')} className={styles.toggleBtn}>Sign up</button></p>
                ) : (
                  <p>Already have an account? <button type="button" onClick={() => setView('login')} className={styles.toggleBtn}>Log in</button></p>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </PublicLayout>
  );
}

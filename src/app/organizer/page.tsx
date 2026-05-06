'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';
import styles from '../admin/events/page.module.css';

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [organizerProfile, setOrganizerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get organizer profile
    const { data: profile } = await supabase.from('organizers').select('*').eq('user_id', user.id).single();
    setOrganizerProfile(profile);

    if (!profile) {
      setLoading(false);
      return;
    }

    // Get their events
    const { data: myEvents } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', profile.id)
      .order('date', { ascending: false });

    if (myEvents) {
      setEvents(myEvents);

      // Get registration counts per event
      const counts: Record<string, number> = {};
      for (const ev of myEvents) {
        const { count } = await supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('event_id', ev.id);
        counts[ev.id] = count || 0;
      }
      setRegistrationCounts(counts);
    }

    setLoading(false);
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading your dashboard...</div>;

  if (!organizerProfile) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Organizer Profile Not Found</h2>
        <p style={{ color: '#64748B' }}>Your account has not been linked to an organizer profile yet. Please contact the administrator.</p>
      </div>
    );
  }

  const totalRegistrations = Object.values(registrationCounts).reduce((a, b) => a + b, 0);
  const pendingApproval = events.filter(e => !e.approved).length;
  const publishedEvents = events.filter(e => e.approved).length;

  return (
    <div>
      <div className={styles.headerRow} style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ marginBottom: '0.25rem' }}>Welcome back, {organizerProfile.name}!</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{organizerProfile.organization_name || 'Event Organizer'}</p>
        </div>
        <Link href="/organizer/events/new" className="btn-primary">+ Create Event</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'My Events', value: events.length },
          { label: 'Published', value: publishedEvents },
          { label: 'Pending Approval', value: pendingApproval, warning: pendingApproval > 0 },
          { label: 'Total Registrations', value: totalRegistrations }
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: '12px', padding: '1.5rem',
            border: `1px solid ${stat.warning ? '#FCD34D' : '#E2E8F0'}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: stat.warning ? '#92400E' : '#64748B', marginBottom: '0.5rem' }}>{stat.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.warning ? '#D97706' : '#0F172A' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Event List */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>My Events</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Registrations</th>
              <th>Approval</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? events.map(event => (
              <tr key={event.id}>
                <td><strong>{event.title}</strong><br/><small style={{ color: '#94A3B8' }}>{event.location}</small></td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td><strong>{registrationCounts[event.id] || 0}</strong></td>
                <td>
                  <span style={{
                    display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '99px',
                    fontSize: '0.75rem', fontWeight: 700,
                    background: event.approved ? '#DCFCE7' : '#FEF3C7',
                    color: event.approved ? '#15803D' : '#92400E'
                  }}>
                    {event.approved ? 'APPROVED' : 'PENDING'}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()] || styles.upcoming}`}>
                    {event.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No events yet. Create your first event!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

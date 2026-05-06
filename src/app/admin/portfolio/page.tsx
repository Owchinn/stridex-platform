'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';
import styles from '../events/page.module.css';

export default function AdminPortfolioList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    // Portfolio is driven by PAST events
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'PAST')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleRemoveFromPortfolio = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the Portfolio? This will change its status back to UPCOMING.`)) {
      return;
    }

    const { error } = await supabase
      .from('events')
      .update({ status: 'UPCOMING' })
      .eq('id', id);

    if (error) {
      alert('Error updating event: ' + error.message);
    } else {
      fetchPastEvents();
    }
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>Portfolio Gallery</h1>
        <p style={{ color: 'var(--text-muted)' }}>Events marked as PAST automatically appear in your portfolio.</p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Loading portfolio...</td></tr>
            ) : events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong></td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/events/${event.id}/edit`} className={styles.editBtn}>
                        Edit Event Details
                      </Link>
                      <button 
                        onClick={() => handleRemoveFromPortfolio(event.id, event.title)}
                        className={styles.deleteBtn}
                        style={{ color: '#f59e0b' }} // Amber color for "Archive/Remove from portfolio"
                      >
                        Remove from Portfolio
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No past events in portfolio yet. Change an event's status to PAST to add it here.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

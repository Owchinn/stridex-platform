'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import styles from './page.module.css';

export default function AdminEventsList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    // Because we use RLS, this will only work if the user is an admin.
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      alert('Error deleting event: ' + error.message);
    } else {
      alert('Event deleted successfully.');
      fetchEvents();
    }
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Manage Events</h1>
        <Link href="/admin/events/new" className="btn-primary">
          + New Event
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Loading events...</td></tr>
            ) : events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td><strong>{event.title}</strong><br/><small style={{color: 'var(--text-muted)'}}>{event.location}</small></td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[event.status.toLowerCase()] || styles.upcoming}`}>
                      {event.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/events/${event.id}/edit`} className={styles.editBtn}>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(event.id, event.title)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No events found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

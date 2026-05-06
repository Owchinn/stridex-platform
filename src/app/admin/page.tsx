import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';
import styles from './page.module.css';

export const revalidate = 0;

export default async function AdminDashboard() {
  // Fetch all events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch registrations to compute totals and show recent feed
  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      events (
        title
      )
    `)
    .order('created_at', { ascending: false });
  
  const allRegistrations = registrations || [];
  const allEvents = events || [];

  const totalOrders = allRegistrations.length;
  const totalRevenue = allRegistrations.reduce((sum, r) => r.status === 'PAID' ? sum + Number(r.total_amount) : sum, 0);
  const pendingRevenue = allRegistrations.reduce((sum, r) => r.status === 'PENDING' ? sum + Number(r.total_amount) : sum, 0);
  
  // Show only the 20 most recent orders in the feed
  const recentOrders = allRegistrations.slice(0, 20);

  return (
    <div>
      <h1 className={styles.pageTitle}>All Your Events</h1>
      
      {/* Top Metrics Row */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </span>
          </div>
          <span className={styles.statValue}>{totalOrders}</span>
          <span className={styles.statSubtext}>Total Orders</span>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </span>
          </div>
          <span className={styles.statValue}>PHP {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={styles.statSubtext}>Remittances (Paid Orders)</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
          </div>
          <span className={styles.statValue}>PHP {pendingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={styles.statSubtext}>Pending Revenue</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className={styles.dashboardLayout}>
        
        {/* Left Column: Events List */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Active Events</h2>
            <Link href="/admin/events/new" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              + New Event
            </Link>
          </div>
          <div className={styles.sectionBody}>
            {allEvents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No events found.</div>
            ) : (
              allEvents.map(event => (
                <div key={event.id} className={styles.eventItem}>
                  <img src={event.image} alt={event.title} className={styles.eventImage} />
                  <div className={styles.eventInfo}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <span className={styles.eventDate}>
                      {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    
                    <div className={styles.eventLinks}>
                      <Link href={`/admin/registrations?eventId=${event.id}`} className={styles.eventLink}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        View Registrations
                      </Link>
                      <Link href={`/admin/events/${event.id}/edit`} className={styles.eventLink}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit Event Details
                      </Link>
                      <Link href={`/events/${event.id}`} className={styles.eventLink}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        Public Registration Page
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Orders */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Recent Orders</h2>
            <Link href="/admin/registrations" style={{ fontSize: '0.85rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
              View All →
            </Link>
          </div>
          <div className={styles.sectionBody} style={{ overflowX: 'auto' }}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Origin Event</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center', color: '#94A3B8', padding: '2rem' }}>No recent orders.</td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} className={styles.orderRow}>
                      <td>
                        <span className={styles.orderId}>
                          Order #{order.id.slice(0, 6).toUpperCase()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span className={styles.orderAmount}>PHP {Number(order.total_amount).toLocaleString()}</span>
                          <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>
                            {order.status}
                          </span>
                        </div>
                        <span className={styles.orderDate}>
                          {new Date(order.created_at).toLocaleString('en-US', { 
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </span>
                      </td>
                      <td>
                        <span className={styles.runnerName}>{order.first_name} {order.last_name}</span>
                        <span className={styles.runnerEmail}>{order.email}</span>
                        <span className={styles.originEvent}>{order.events?.title || 'Unknown Event'}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

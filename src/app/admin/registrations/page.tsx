'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import styles from './page.module.css';

type TabKey = 'racer' | 'questions' | 'shipping' | 'logs';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Record<string, TabKey>>({});
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterEvent, setFilterEvent] = useState('ALL');
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const eventIdParam = params.get('eventId');
      if (eventIdParam) {
        setFilterEvent(eventIdParam);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let data = registrations;
    if (filterStatus !== 'ALL') data = data.filter(r => r.status === filterStatus);
    if (filterEvent !== 'ALL') data = data.filter(r => r.event_id === filterEvent);
    setFiltered(data);
  }, [filterStatus, filterEvent, registrations]);

  const fetchData = async () => {
    const [regsRes, eventsRes] = await Promise.all([
      supabase.from('registrations').select('*, events(title), event_categories(name, distance)').order('created_at', { ascending: false }),
      supabase.from('events').select('id, title')
    ]);
    if (regsRes.data) { setRegistrations(regsRes.data); setFiltered(regsRes.data); }
    if (eventsRes.data) setEvents(eventsRes.data);
    setLoading(false);
  };

  const getTab = (id: string): TabKey => activeTab[id] || 'racer';
  const setTab = (id: string, tab: TabKey) => setActiveTab(prev => ({ ...prev, [id]: tab }));

  // Summary stats
  const total = filtered.length;
  const paid = filtered.filter(r => r.status === 'PAID');
  const pending = filtered.filter(r => r.status === 'PENDING');
  const cancelled = filtered.filter(r => r.status === 'CANCELLED');
  const paidTotal = paid.reduce((s, r) => s + Number(r.total_amount), 0);
  const pendingTotal = pending.reduce((s, r) => s + Number(r.total_amount), 0);
  const projectedTotal = paidTotal + pendingTotal;

  const statusColor = (status: string) => {
    if (status === 'PAID') return styles.badgePaid;
    if (status === 'PENDING') return styles.badgePending;
    return styles.badgeCancelled;
  };

  const paymentLabel: Record<string, string> = {
    GCASH: 'GCash', MAYA: 'Maya', BANK_TRANSFER: 'Bank Transfer', CREDIT_CARD: 'Credit Card'
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Registrations</h1>
          <p className={styles.pageSubtitle}>View and manage all participant registrations</p>
        </div>
      </div>

      {/* Summary Bar */}
      <div className={styles.summaryBar}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Registrations</span>
          <span className={styles.summaryValue}>{total}</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryPaid}`}>
          <span className={styles.summaryLabel}>Paid</span>
          <span className={styles.summaryValue}>PHP {paidTotal.toLocaleString()} <em>({paid.length})</em></span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryPending}`}>
          <span className={styles.summaryLabel}>Unpaid / Pending</span>
          <span className={styles.summaryValue}>PHP {pendingTotal.toLocaleString()} <em>({pending.length})</em></span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Projected Total</span>
          <span className={styles.summaryValue}>PHP {projectedTotal.toLocaleString()}</span>
        </div>
        <div className={`${styles.summaryCard} ${styles.summaryCancelled}`}>
          <span className={styles.summaryLabel}>Cancelled</span>
          <span className={styles.summaryValue}>{cancelled.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <select className={styles.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="ALL">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select className={styles.filterSelect} value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
          <option value="ALL">All Events</option>
          {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className={styles.emptyState}>Loading registrations...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>No registrations found.</div>
      ) : (
        <div className={styles.regList}>
          {/* Column Headers */}
          <div className={styles.regHeaderRow}>
            <div className={styles.colPayment}>Payment</div>
            <div className={styles.colRegistration}>Registration</div>
            <div className={styles.colBreakdown}>Breakdown</div>
            <div className={styles.colDetails}>Details</div>
          </div>

          {filtered.map(reg => (
            <div key={reg.id} className={styles.regCard}>
              {/* ── PAYMENT COLUMN ── */}
              <div className={styles.colPayment}>
                <span className={styles.amount}>PHP {Number(reg.total_amount).toLocaleString()}</span>
                <div className={styles.badgeRow}>
                  <span className={styles.orderId}>#{reg.id.slice(0, 6).toUpperCase()}</span>
                  <span className={`${styles.badge} ${statusColor(reg.status)}`}>{reg.status}</span>
                </div>
                <div className={styles.metaLine}>
                  <strong>Via:</strong> {paymentLabel[reg.payment_method] || reg.payment_method}
                </div>
                {reg.payment_date && (
                  <div className={styles.metaLine}>
                    <strong>Paid:</strong> {new Date(reg.payment_date).toLocaleString()}
                  </div>
                )}
                {reg.xendit_reference && (
                  <div className={styles.metaLine}>
                    <strong>Ref:</strong> {reg.xendit_reference}
                  </div>
                )}
                <div className={styles.divider} />
                <div className={styles.metaLine}><strong>Customer</strong></div>
                <div className={styles.metaLine}>{reg.first_name} {reg.last_name}</div>
                <div className={styles.metaLineEmail}>{reg.email}</div>
              </div>

              {/* ── REGISTRATION COLUMN ── */}
              <div className={styles.colRegistration}>
                <div className={styles.badgeRow}>
                  <span className={styles.categoryBadge}>Race Registration</span>
                </div>
                <span className={styles.distanceBadge}>{reg.event_categories?.distance || '—'}</span>
                <div className={styles.runnerName}>{reg.first_name} {reg.last_name}</div>
                <div className={styles.metaLineEmail}>{reg.email}</div>
                <div className={styles.metaLine}><strong>Category:</strong> {reg.event_categories?.name || '—'}</div>
                <div className={styles.metaLine}><strong>Singlet:</strong> {reg.shirt_size}</div>
                {reg.finisher_shirt_size && <div className={styles.metaLine}><strong>Finisher:</strong> {reg.finisher_shirt_size}</div>}
                {reg.date_of_birth && (
                  <div className={styles.metaLine}><strong>Age:</strong> {Math.floor((Date.now() - new Date(reg.date_of_birth).getTime()) / 3.156e10)} yrs ({new Date(reg.date_of_birth).toLocaleDateString()})</div>
                )}
                <div className={styles.metaLine}><strong>Registered:</strong> {new Date(reg.created_at).toLocaleString()}</div>
              </div>

              {/* ── BREAKDOWN COLUMN ── */}
              <div className={styles.colBreakdown}>
                <div className={styles.breakdownTitle}>Items</div>
                <div className={styles.breakdownRow}>
                  <span>{reg.event_categories?.name || 'Race Entry'}</span>
                  <span>PHP {Number(reg.base_price).toLocaleString()}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.breakdownRow}>
                  <span>Registration Fee</span>
                  <span>PHP {Number(reg.base_price).toLocaleString()}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Shop Total</span>
                  <span>PHP {Number(reg.shop_total || 0).toLocaleString()}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Processing Fee</span>
                  <span>PHP {Number(reg.platform_fee).toLocaleString()}</span>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Surcharge</span>
                  <span>PHP {Number(reg.gateway_fee).toLocaleString()}</span>
                </div>
                <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
                  <span>Total</span>
                  <span>PHP {Number(reg.total_amount).toLocaleString()}</span>
                </div>
              </div>

              {/* ── DETAILS COLUMN ── */}
              <div className={styles.colDetails}>
                <div className={styles.tabs}>
                  {(['racer', 'questions', 'shipping', 'logs'] as TabKey[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setTab(reg.id, tab)}
                      className={`${styles.tab} ${getTab(reg.id) === tab ? styles.tabActive : ''}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className={styles.tabContent}>
                  {/* Racer Tab */}
                  {getTab(reg.id) === 'racer' && (
                    <ul className={styles.detailList}>
                      <li><span>Gender</span><strong>{reg.gender || '—'}</strong></li>
                      <li><span>Nationality</span><strong>{reg.nationality || '—'}</strong></li>
                      <li><span>Address</span><strong>{reg.address || '—'}</strong></li>
                      <li><span>City</span><strong>{reg.city || '—'}</strong></li>
                      <li><span>Country</span><strong>{reg.country || '—'}</strong></li>
                      <li><span>Zip</span><strong>{reg.zip_code || '—'}</strong></li>
                      <li><span>Emergency Contact</span><strong>{reg.emergency_contact_name} · {reg.emergency_contact_phone}</strong></li>
                    </ul>
                  )}
                  {/* Questions Tab */}
                  {getTab(reg.id) === 'questions' && (
                    <div>
                      {Array.isArray(reg.custom_answers) && reg.custom_answers.length > 0 ? (
                        <ul className={styles.detailList}>
                          {reg.custom_answers.map((qa: any, i: number) => (
                            <li key={i}><span>{qa.question}</span><strong>{qa.answer}</strong></li>
                          ))}
                        </ul>
                      ) : <p className={styles.emptyTab}>No custom questions for this event.</p>}
                    </div>
                  )}
                  {/* Shipping Tab */}
                  {getTab(reg.id) === 'shipping' && (
                    <ul className={styles.detailList}>
                      <li><span>Address</span><strong>{reg.shipping_address || '—'}</strong></li>
                      <li><span>City</span><strong>{reg.shipping_city || '—'}</strong></li>
                      <li><span>Country</span><strong>{reg.shipping_country || '—'}</strong></li>
                      <li><span>Zip</span><strong>{reg.shipping_zip || '—'}</strong></li>
                    </ul>
                  )}
                  {/* Logs Tab */}
                  {getTab(reg.id) === 'logs' && (
                    <div>
                      {Array.isArray(reg.activity_log) && reg.activity_log.length > 0 ? (
                        <ul className={styles.logList}>
                          {reg.activity_log.map((log: any, i: number) => (
                            <li key={i}>
                              <span className={styles.logTime}>{new Date(log.timestamp).toLocaleString()}</span>
                              <span>{log.action}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className={styles.logList}>
                          <li>
                            <span className={styles.logTime}>{new Date(reg.created_at).toLocaleString()}</span>
                            <span>Registration created — Status: {reg.status}</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

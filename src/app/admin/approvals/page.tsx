'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import styles from '../events/page.module.css';

type Tab = 'events' | 'organizers';

export default function AdminApprovalsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('events');
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingOrganizers, setPendingOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [eventsRes, orgsRes] = await Promise.all([
      supabase
        .from('events')
        .select('*, organizers(name, organization_name, email)')
        .eq('approved', false)
        .order('created_at', { ascending: true }),
      supabase
        .from('organizers')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: true })
    ]);
    if (eventsRes.data) setPendingEvents(eventsRes.data);
    if (orgsRes.data) setPendingOrganizers(orgsRes.data);
    setLoading(false);
  };

  // ── Event Actions ──
  const approveEvent = async (id: string, title: string) => {
    const { error } = await supabase.from('events').update({ approved: true }).eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    alert(`"${title}" approved and published!`);
    fetchAll();
  };

  const rejectEvent = async (id: string, title: string) => {
    if (!confirm(`Reject and delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    fetchAll();
  };

  // ── Organizer Actions ──
  const approveOrganizer = async (id: string, name: string) => {
    const { error } = await supabase.from('organizers').update({ approved: true }).eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    alert(`${name}'s organizer account has been approved! They can now log in to access their dashboard.`);
    fetchAll();
  };

  const rejectOrganizer = async (id: string, name: string) => {
    if (!confirm(`Reject and delete ${name}'s organizer application? This cannot be undone.`)) return;
    const { error } = await supabase.from('organizers').delete().eq('id', id);
    if (error) { alert('Error: ' + error.message); return; }
    fetchAll();
  };

  const totalPending = pendingEvents.length + pendingOrganizers.length;

  return (
    <div>
      {/* Page Header */}
      <div className={styles.headerRow} style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className={styles.pageTitle} style={{ marginBottom: '0.25rem' }}>Approvals</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Review pending events and organizer applications</p>
        </div>
        {totalPending > 0 && (
          <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.4rem 1rem', borderRadius: '99px', fontWeight: 700, fontSize: '0.85rem' }}>
            {totalPending} Pending
          </span>
        )}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '1.5rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.35rem', width: 'fit-content' }}>
        {([
          { key: 'events', label: 'Event Submissions', count: pendingEvents.length },
          { key: 'organizers', label: 'Organizer Applications', count: pendingOrganizers.length }
        ] as { key: Tab; label: string; count: number }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '7px',
              border: 'none',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: activeTab === tab.key ? '#0052FF' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#64748B',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#FEF3C7',
                color: activeTab === tab.key ? 'white' : '#92400E',
                borderRadius: '99px',
                padding: '0.1rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading...</div>
      ) : (
        <>
          {/* ── EVENTS TAB ── */}
          {activeTab === 'events' && (
            pendingEvents.length === 0 ? (
              <EmptyState icon="✅" title="All caught up!" message="No events pending approval." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingEvents.map(event => (
                  <div key={event.id} style={{ background: 'white', border: '1px solid #FCD34D', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      {event.image && <img src={event.image} alt={event.title} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.5rem' }}>PENDING APPROVAL</span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{event.title}</h3>
                        <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.5rem' }}>📍 {event.location} &nbsp;·&nbsp; 📅 {new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                        <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{event.description}</p>
                        {event.organizers && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748B', padding: '0.5rem 0.75rem', background: '#F8FAFC', borderRadius: '6px' }}>
                            👤 <strong>{event.organizers.name}</strong>{event.organizers.organization_name ? ` · ${event.organizers.organization_name}` : ''} · {event.organizers.email}
                          </div>
                        )}
                      </div>
                      <ActionButtons
                        onApprove={() => approveEvent(event.id, event.title)}
                        onReject={() => rejectEvent(event.id, event.title)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── ORGANIZERS TAB ── */}
          {activeTab === 'organizers' && (
            pendingOrganizers.length === 0 ? (
              <EmptyState icon="👥" title="No applications!" message="No organizer applications pending review." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingOrganizers.map(org => (
                  <div key={org.id} style={{ background: 'white', border: '1px solid #C7D7FF', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      {/* Avatar */}
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #0052FF, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.4rem', flexShrink: 0 }}>
                        {org.name.charAt(0).toUpperCase()}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.5rem' }}>ORGANIZER APPLICATION</span>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{org.name}</h3>
                        {org.organization_name && <p style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>🏢 {org.organization_name}</p>}
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <span style={{ color: '#64748B', fontSize: '0.85rem' }}>✉️ {org.email}</span>
                          {org.phone && <span style={{ color: '#64748B', fontSize: '0.85rem' }}>📞 {org.phone}</span>}
                          <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Applied {new Date(org.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                        </div>
                      </div>
                      <ActionButtons
                        onApprove={() => approveOrganizer(org.id, org.name)}
                        onReject={() => rejectOrganizer(org.id, org.name)}
                        approveLabel="✓ Approve Access"
                        rejectLabel="✕ Decline"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

// ── Shared Sub-components ──
function EmptyState({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <div style={{ padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#94A3B8' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '0.5rem', color: '#475569' }}>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

function ActionButtons({
  onApprove, onReject,
  approveLabel = '✓ Approve',
  rejectLabel = '✕ Reject'
}: {
  onApprove: () => void;
  onReject: () => void;
  approveLabel?: string;
  rejectLabel?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
      <button onClick={onApprove} style={{ padding: '0.65rem 1.5rem', background: '#0052FF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
        {approveLabel}
      </button>
      <button onClick={onReject} style={{ padding: '0.65rem 1.5rem', background: 'white', color: '#EF4444', border: '1px solid #FCA5A5', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
        {rejectLabel}
      </button>
    </div>
  );
}

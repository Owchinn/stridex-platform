'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import styles from '../../../admin/events/page.module.css';

interface CategoryInput {
  name: string;
  distance: string;
  base_price: string;
  early_bird_price?: string;
}

export default function OrganizerNewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [organizerId, setOrganizerId] = useState<string | null>(null);

  const [eventData, setEventData] = useState({
    title: '', slug: '', date: '', registration_deadline: '', early_bird_deadline: '', location: '', image: '',
    map_image: '', racekit_image: '', description: ''
  });
  const [categories, setCategories] = useState<CategoryInput[]>([{ name: '', distance: '', base_price: '', early_bird_price: '' }]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('organizers').select('id').eq('user_id', user.id).single().then(({ data }) => {
          if (data) setOrganizerId(data.id);
        });
      }
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev, [name]: value,
      ...(name === 'title' ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {})
    }));
  };

  const handleCatChange = (i: number, field: keyof CategoryInput, val: string) =>
    setCategories(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerId) { alert('Organizer profile not found.'); return; }
    setIsSubmitting(true);
    try {
      const { data: newEvent, error } = await supabase.from('events').insert([{
        ...eventData,
        registration_deadline: eventData.registration_deadline || null,
        early_bird_deadline: eventData.early_bird_deadline || null,
        map_image: eventData.map_image || null,
        racekit_image: eventData.racekit_image || null,
        status: 'UPCOMING',
        approved: false, // Needs admin approval
        organizer_id: organizerId
      }]).select().single();

      if (error) throw error;

      const catInserts = categories.filter(c => c.name && c.distance && c.base_price)
        .map(c => ({ event_id: newEvent.id, name: c.name, distance: c.distance, base_price: Number(c.base_price), early_bird_price: c.early_bird_price ? Number(c.early_bird_price) : null }));

      if (catInserts.length > 0) {
        const { error: catErr } = await supabase.from('event_categories').insert(catInserts);
        if (catErr) throw catErr;
      }

      alert('Event submitted for admin approval! It will be published once reviewed.');
      router.push('/organizer');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Create New Event</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', fontSize: '0.85rem', color: '#92400E' }}>
          ⏳ Events require admin approval before publishing
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formCard}>
          <h2>Event Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}><label>Event Title</label><input type="text" name="title" value={eventData.title} onChange={handleChange} required /></div>
            <div className={styles.inputGroup}><label>Slug (auto-generated)</label><input type="text" name="slug" value={eventData.slug} onChange={handleChange} required /></div>
            <div className={styles.inputGroup}><label>Date & Time</label><input type="datetime-local" name="date" value={eventData.date} onChange={handleChange} required /></div>
            <div className={styles.inputGroup}><label>Registration Deadline (Opt)</label><input type="datetime-local" name="registration_deadline" value={eventData.registration_deadline} onChange={handleChange} /></div>
            <div className={styles.inputGroup}><label>Early Bird Deadline (Opt)</label><input type="datetime-local" name="early_bird_deadline" value={eventData.early_bird_deadline} onChange={handleChange} /></div>
            <div className={styles.inputGroup}><label>Location</label><input type="text" name="location" value={eventData.location} onChange={handleChange} required /></div>
            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}><label>Cover Image URL</label><input type="url" name="image" value={eventData.image} onChange={handleChange} required /></div>
            <div className={styles.inputGroup}><label>Route Map URL (Optional)</label><input type="url" name="map_image" value={eventData.map_image} onChange={handleChange} /></div>
            <div className={styles.inputGroup}><label>Racekit Image URL (Optional)</label><input type="url" name="racekit_image" value={eventData.racekit_image} onChange={handleChange} /></div>
            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}><label>Description</label><textarea name="description" value={eventData.description} onChange={handleChange} required rows={4} /></div>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2>Race Categories</h2>
            <button type="button" className="btn-secondary" onClick={() => setCategories(p => [...p, { name: '', distance: '', base_price: '', early_bird_price: '' }])}>+ Add Category</button>
          </div>
          {categories.map((cat, i) => (
            <div key={i} className={styles.categoryRow}>
              <div className={styles.inputGroup}><label>Name</label><input type="text" value={cat.name} onChange={e => handleCatChange(i, 'name', e.target.value)} required /></div>
              <div className={styles.inputGroup}><label>Distance</label><input type="text" value={cat.distance} onChange={e => handleCatChange(i, 'distance', e.target.value)} required /></div>
              <div className={styles.inputGroup}><label>Base Price (PHP)</label><input type="number" value={cat.base_price} onChange={e => handleCatChange(i, 'base_price', e.target.value)} required /></div>
              <div className={styles.inputGroup}><label>Early Bird Price (PHP - Opt)</label><input type="number" value={cat.early_bird_price || ''} onChange={e => handleCatChange(i, 'early_bird_price', e.target.value)} /></div>
              {categories.length > 1 && <button type="button" className={styles.removeBtn} onClick={() => setCategories(p => p.filter((_, idx) => idx !== i))}>✕</button>}
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  );
}

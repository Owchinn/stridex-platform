'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';
import styles from '../../page.module.css';

interface CategoryInput {
  id?: string;
  name: string;
  distance: string;
  base_price: string;
  early_bird_price?: string;
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [eventData, setEventData] = useState({
    title: '',
    slug: '',
    date: '',
    registration_deadline: '',
    early_bird_deadline: '',
    location: '',
    image: '',
    map_image: '',
    racekit_image: '',
    description: '',
    status: 'UPCOMING'
  });

  const [categories, setCategories] = useState<CategoryInput[]>([]);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    // Fetch event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError) {
      alert('Error fetching event: ' + eventError.message);
      router.push('/admin/events');
      return;
    }

    setEventData({
      title: event.title,
      slug: event.slug,
      date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local
      registration_deadline: event.registration_deadline ? new Date(event.registration_deadline).toISOString().slice(0, 16) : '',
      early_bird_deadline: event.early_bird_deadline ? new Date(event.early_bird_deadline).toISOString().slice(0, 16) : '',
      location: event.location,
      image: event.image,
      map_image: event.map_image || '',
      racekit_image: event.racekit_image || '',
      description: event.description,
      status: event.status
    });

    // Fetch categories
    const { data: cats, error: catError } = await supabase
      .from('event_categories')
      .select('*')
      .eq('event_id', eventId);

    if (cats && !catError) {
      setCategories(cats.map(c => ({
        id: c.id,
        name: c.name,
        distance: c.distance,
        base_price: c.base_price.toString(),
        early_bird_price: c.early_bird_price ? c.early_bird_price.toString() : ''
      })));
    } else {
      setCategories([{ name: '', distance: '', base_price: '', early_bird_price: '' }]);
    }

    setLoading(false);
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {})
    }));
  };

  const handleCategoryChange = (index: number, field: keyof CategoryInput, value: string) => {
    setCategories(prev => prev.map((cat, i) => i === index ? { ...cat, [field]: value } : cat));
  };

  const addCategory = () => {
    setCategories(prev => [...prev, { name: '', distance: '', base_price: '', early_bird_price: '' }]);
  };

  const removeCategory = async (index: number) => {
    const catToRemove = categories[index];
    
    // If it exists in DB, ask before removing
    if (catToRemove.id) {
      if (!confirm('Are you sure you want to delete this category? This will affect existing registrations if any.')) return;
      
      const { error } = await supabase.from('event_categories').delete().eq('id', catToRemove.id);
      if (error) {
        alert('Could not delete category: ' + error.message);
        return;
      }
    }
    
    if (categories.length > 1) {
      setCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Update Event
      const { error: eventError } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          slug: eventData.slug,
          date: eventData.date,
          registration_deadline: eventData.registration_deadline || null,
          early_bird_deadline: eventData.early_bird_deadline || null,
          location: eventData.location,
          image: eventData.image,
          map_image: eventData.map_image || null,
          racekit_image: eventData.racekit_image || null,
          description: eventData.description,
          status: eventData.status
        })
        .eq('id', eventId);

      if (eventError) throw eventError;

      // 2. Update/Insert Categories
      const validCategories = categories.filter(c => c.name && c.distance && c.base_price);
      
      for (const cat of validCategories) {
        if (cat.id) {
          // Update
          await supabase.from('event_categories')
            .update({
              name: cat.name,
              distance: cat.distance,
              base_price: Number(cat.base_price),
              early_bird_price: cat.early_bird_price ? Number(cat.early_bird_price) : null
            })
            .eq('id', cat.id);
        } else {
          // Insert
          await supabase.from('event_categories')
            .insert({
              event_id: eventId,
              name: cat.name,
              distance: cat.distance,
              base_price: Number(cat.base_price),
              early_bird_price: cat.early_bird_price ? Number(cat.early_bird_price) : null
            });
        }
      }

      alert('Event updated successfully!');
      router.push('/admin/events');
    } catch (err: any) {
      console.error(err);
      alert('Error updating event: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading event details...</div>;

  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Edit Event</h1>
        <button type="button" onClick={() => router.push('/admin/events')} className="btn-secondary">
          Cancel
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formCard}>
          <h2>Event Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Event Title</label>
              <input type="text" name="title" value={eventData.title} onChange={handleEventChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Slug</label>
              <input type="text" name="slug" value={eventData.slug} onChange={handleEventChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Date & Time</label>
              <input type="datetime-local" name="date" value={eventData.date} onChange={handleEventChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Registration Deadline (Optional)</label>
              <input type="datetime-local" name="registration_deadline" value={eventData.registration_deadline} onChange={handleEventChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Early Bird Deadline (Optional)</label>
              <input type="datetime-local" name="early_bird_deadline" value={eventData.early_bird_deadline} onChange={handleEventChange} />
            </div>
            <div className={styles.inputGroup}>
              <label>Location</label>
              <input type="text" name="location" value={eventData.location} onChange={handleEventChange} required />
            </div>
            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
              <label>Cover Image URL</label>
              <input type="url" name="image" value={eventData.image} onChange={handleEventChange} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Route Map Image URL (Optional)</label>
              <input type="url" name="map_image" value={eventData.map_image} onChange={handleEventChange} placeholder="Leave empty if none" />
            </div>
            <div className={styles.inputGroup}>
              <label>Racekit Image URL (Optional)</label>
              <input type="url" name="racekit_image" value={eventData.racekit_image} onChange={handleEventChange} placeholder="Leave empty if none" />
            </div>
            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea name="description" value={eventData.description} onChange={handleEventChange} required rows={4} />
            </div>
            <div className={styles.inputGroup}>
              <label>Status</label>
              <select name="status" value={eventData.status} onChange={handleEventChange}>
                <option value="UPCOMING">UPCOMING</option>
                <option value="ONGOING">ONGOING</option>
                <option value="PAST">PAST</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formCard}>
          <div className={styles.cardHeader}>
            <h2>Race Categories</h2>
            <button type="button" className="btn-secondary" onClick={addCategory}>+ Add Category</button>
          </div>
          {categories.map((cat, index) => (
            <div key={index} className={styles.categoryRow}>
              <div className={styles.inputGroup}>
                <label>Name</label>
                <input type="text" value={cat.name} onChange={e => handleCategoryChange(index, 'name', e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Distance</label>
                <input type="text" value={cat.distance} onChange={e => handleCategoryChange(index, 'distance', e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Base Price (PHP)</label>
                <input type="number" value={cat.base_price} onChange={e => handleCategoryChange(index, 'base_price', e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Early Bird Price (PHP - Opt)</label>
                <input type="number" value={cat.early_bird_price || ''} onChange={e => handleCategoryChange(index, 'early_bird_price', e.target.value)} placeholder="2800" />
              </div>
              {categories.length > 1 && (
                <button type="button" className={styles.removeBtn} onClick={() => removeCategory(index)}>✕</button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

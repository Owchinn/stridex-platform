"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import styles from '../page.module.css';

interface CategoryInput {
  name: string;
  distance: string;
  base_price: string;
  early_bird_price?: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [categories, setCategories] = useState<CategoryInput[]>([
    { name: '', distance: '', base_price: '', early_bird_price: '' }
  ]);

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

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      setCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Insert Event
      const { data: newEvent, error: eventError } = await supabase
        .from('events')
        .insert([{
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
        }])
        .select()
        .single();

      if (eventError) throw eventError;

      // 2. Insert Categories linked to the new event
      const categoryInserts = categories
        .filter(c => c.name && c.distance && c.base_price)
        .map(c => ({
          event_id: newEvent.id,
          name: c.name,
          distance: c.distance,
          base_price: Number(c.base_price),
          early_bird_price: c.early_bird_price ? Number(c.early_bird_price) : null
        }));

      if (categoryInserts.length > 0) {
        const { error: catError } = await supabase
          .from('event_categories')
          .insert(categoryInserts);
        if (catError) throw catError;
      }

      alert('Event created successfully!');
      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert('Error creating event: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Create New Event</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formCard}>
          <h2>Event Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Event Title</label>
              <input type="text" name="title" value={eventData.title} onChange={handleEventChange} required placeholder="Mountain Trail Ultra 2026" />
            </div>
            <div className={styles.inputGroup}>
              <label>Slug (auto-generated)</label>
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
              <input type="text" name="location" value={eventData.location} onChange={handleEventChange} required placeholder="Baguio City, Philippines" />
            </div>
            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
              <label>Cover Image URL</label>
              <input type="url" name="image" value={eventData.image} onChange={handleEventChange} required placeholder="https://images.unsplash.com/..." />
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
              <textarea name="description" value={eventData.description} onChange={handleEventChange} required rows={4} placeholder="Describe the race..." />
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
                <input type="text" value={cat.name} onChange={e => handleCategoryChange(index, 'name', e.target.value)} placeholder="50K Solo" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Distance</label>
                <input type="text" value={cat.distance} onChange={e => handleCategoryChange(index, 'distance', e.target.value)} placeholder="50KM" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Base Price (PHP)</label>
                <input type="number" value={cat.base_price} onChange={e => handleCategoryChange(index, 'base_price', e.target.value)} placeholder="3200" required />
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
          {isSubmitting ? 'Publishing...' : 'Publish Event'}
        </button>
      </form>
    </div>
  );
}

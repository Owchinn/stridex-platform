import { supabase } from '../../lib/supabaseClient';

export interface EventCategory {
  id: string;
  name: string;
  distance: string;
  base_price: number; // changed from basePrice to match DB
  early_bird_price?: number;
}

export interface StrideXEvent {
  id: string;
  title: string;
  slug: string;
  date: string;
  registration_deadline?: string;
  early_bird_deadline?: string;
  location: string;
  image: string;
  status: 'UPCOMING' | 'PAST' | 'ONGOING';
  description: string;
  map_image?: string;
  racekit_image?: string;
  categories: EventCategory[];
}

export async function getEvents(): Promise<StrideXEvent[]> {
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      event_categories (*)
    `)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  // Map the DB response to our StrideXEvent type
  return events.map((evt: any) => ({
    id: evt.id,
    title: evt.title,
    slug: evt.slug,
    date: evt.date,
    registration_deadline: evt.registration_deadline,
    early_bird_deadline: evt.early_bird_deadline,
    location: evt.location,
    image: evt.image,
    status: evt.status,
    description: evt.description,
    map_image: evt.map_image,
    racekit_image: evt.racekit_image,
    categories: evt.event_categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      distance: cat.distance,
      base_price: Number(cat.base_price),
      early_bird_price: cat.early_bird_price ? Number(cat.early_bird_price) : undefined
    }))
  }));
}

export async function getEventById(id: string): Promise<StrideXEvent | null> {
  const { data: evt, error } = await supabase
    .from('events')
    .select(`
      *,
      event_categories (*)
    `)
    .eq('id', id)
    .single();

  if (error || !evt) {
    console.error('Error fetching event by ID:', error);
    return null;
  }

  return {
    id: evt.id,
    title: evt.title,
    slug: evt.slug,
    date: evt.date,
    registration_deadline: evt.registration_deadline,
    early_bird_deadline: evt.early_bird_deadline,
    location: evt.location,
    image: evt.image,
    status: evt.status,
    description: evt.description,
    map_image: evt.map_image,
    racekit_image: evt.racekit_image,
    categories: evt.event_categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      distance: cat.distance,
      base_price: Number(cat.base_price),
      early_bird_price: cat.early_bird_price ? Number(cat.early_bird_price) : undefined
    }))
  };
}

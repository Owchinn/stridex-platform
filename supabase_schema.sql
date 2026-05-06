-- ============================================================
-- PACE_X DATABASE SCHEMA — FULL VERSION
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- ==================== CORE TABLES ====================

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    date TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ,
    early_bird_deadline TIMESTAMPTZ,
    location TEXT NOT NULL,
    image TEXT NOT NULL,
    map_image TEXT,
    racekit_image TEXT,
    status TEXT NOT NULL DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'ONGOING', 'PAST')),
    description TEXT NOT NULL,
    organizer_id UUID,
    approved BOOLEAN NOT NULL DEFAULT true,  -- Admin-created events are auto-approved
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Categories
CREATE TABLE IF NOT EXISTS public.event_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    distance TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    early_bird_price NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations (Full Schema)
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.event_categories(id) ON DELETE RESTRICT,

    -- Runner Identity
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    gender TEXT,
    nationality TEXT,
    date_of_birth DATE,

    -- Address
    address TEXT,
    city TEXT,
    country TEXT,
    zip_code TEXT,

    -- Race Items
    shirt_size TEXT NOT NULL,
    finisher_shirt_size TEXT,

    -- Emergency Contact
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    medical_waiver_agreed BOOLEAN NOT NULL DEFAULT FALSE,

    -- Payment
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    base_price NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    gateway_fee NUMERIC(10, 2) NOT NULL,
    shop_total NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    xendit_reference TEXT,
    payment_date TIMESTAMPTZ,

    -- Shipping
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_country TEXT,
    shipping_zip TEXT,

    -- Custom Q&A (stored as JSON: [{"question": "...", "answer": "..."}])
    custom_answers JSONB DEFAULT '[]',

    -- Activity Log (stored as JSON: [{"action": "...", "timestamp": "..."}])
    activity_log JSONB DEFAULT '[]',

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Admin',
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ORGANIZER TABLES ====================

-- Organizers (Event organizer accounts linked to Supabase auth users)
CREATE TABLE IF NOT EXISTS public.organizers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    organization_name TEXT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add organizer_id foreign key to events (if not already there)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_organizer_id_fkey') THEN
    ALTER TABLE public.events ADD CONSTRAINT events_organizer_id_fkey
      FOREIGN KEY (organizer_id) REFERENCES public.organizers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;

-- Public read access (only approved events)
CREATE POLICY "Public read approved events" ON public.events FOR SELECT USING (approved = true);
CREATE POLICY "Public read categories" ON public.event_categories FOR SELECT USING (true);
CREATE POLICY "Public read published blogs" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Public insert registrations" ON public.registrations FOR INSERT WITH CHECK (true);

-- ADMIN policies (full access for admin email)
CREATE POLICY "Admin full access events" ON public.events FOR ALL USING (auth.jwt() ->> 'email' = 'bautistajared995@gmail.com');
CREATE POLICY "Admin full access categories" ON public.event_categories FOR ALL USING (auth.jwt() ->> 'email' = 'bautistajared995@gmail.com');
CREATE POLICY "Admin full access registrations" ON public.registrations FOR ALL USING (auth.jwt() ->> 'email' = 'bautistajared995@gmail.com');
CREATE POLICY "Admin full access blogs" ON public.blog_posts FOR ALL USING (auth.jwt() ->> 'email' = 'bautistajared995@gmail.com');
CREATE POLICY "Admin full access organizers" ON public.organizers FOR ALL USING (auth.jwt() ->> 'email' = 'bautistajared995@gmail.com');

-- ORGANIZER policies (can only see their own events)
CREATE POLICY "Organizer read own events" ON public.events FOR SELECT
  USING (organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()));

CREATE POLICY "Organizer insert own events" ON public.events FOR INSERT
  WITH CHECK (organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()));

CREATE POLICY "Organizer update own events" ON public.events FOR UPDATE
  USING (organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid()));

CREATE POLICY "Organizer read own profile" ON public.organizers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Organizer read registrations for own events" ON public.registrations FOR SELECT
  USING (event_id IN (SELECT id FROM public.events WHERE organizer_id IN (
    SELECT id FROM public.organizers WHERE user_id = auth.uid()
  )));

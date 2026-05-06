-- PACE_X ADDITIONAL SCHEMA: Blog Posts

CREATE TABLE public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'PaceX Team',
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on published blog posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow admin full access on blog posts" ON public.blog_posts FOR ALL USING (true);

-- Sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image, published)
VALUES
('Sierra Madre 100: Race Recap', 'sierra-madre-100-recap', 'Over 500 runners conquered 100 miles of relentless terrain in what experts are calling the toughest race in Southeast Asian history.', 'The Sierra Madre 100 pushed every participant to their absolute limits. Starting at 4AM under a blanket of stars, the elite field set off into the darkness of the jungle. The course featured 12,000 meters of elevation gain, multiple river crossings, and unpredictable weather changes. After 28 hours, our champion crossed the finish line with tears streaming down his face. This is what endurance sport is all about.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop', TRUE),
('How to Train for Your First Ultra Marathon', 'train-first-ultra', 'A comprehensive guide for runners looking to tackle their first ultra distance race with PaceX events.', 'Training for an ultra marathon requires a fundamentally different approach than preparing for a standard marathon. The key principles are: build your weekly mileage gradually, practice nutrition during long runs, train on similar terrain to your target race, and most importantly, respect the distance. We recommend a 24-week training block for first-time ultra runners.', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2000&auto=format&fit=crop', TRUE),
('PaceX Partners with Philippine Trail Running Association', 'pacex-ptra-partnership', 'Exciting news: PaceX is now the official registration platform for all PTRA-sanctioned events nationwide.', 'We are thrilled to announce our partnership with the Philippine Trail Running Association. Starting this season, all PTRA-sanctioned trail running events will use PaceX as their official registration platform. This partnership means more races, better technology, and a seamless experience for the Filipino running community.', 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2000&auto=format&fit=crop', TRUE);

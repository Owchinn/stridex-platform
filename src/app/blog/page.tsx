import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import PublicLayout from '../components/PublicLayout';
import styles from './page.module.css';

export const revalidate = 0;

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <PublicLayout>
    <div className={styles.pageWrapper}>
      <div className={`container ${styles.header}`}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Race recaps, training guides, and the latest news from StrideX.</p>
      </div>

      <div className={`container ${styles.grid}`}>
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <img src={post.cover_image} alt={post.title} className={styles.image} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.date}>
                  {new Date(post.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </span>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <span className={styles.readMore}>Read More →</span>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1', padding: '4rem' }}>No blog posts published yet.</p>
        )}
      </div>
    </div>
    </PublicLayout>
  );
}

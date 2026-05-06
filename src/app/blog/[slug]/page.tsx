import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import PublicLayout from '../../components/PublicLayout';
import styles from './page.module.css';

export const revalidate = 0;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .eq('published', true)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <PublicLayout>
    <article className={styles.article}>
      <div className={styles.hero}>
        <img src={post.cover_image} alt={post.title} className={styles.heroImage} />
        <div className={styles.overlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.date}>
            {new Date(post.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </span>
          <h1 className={styles.title}>{post.title}</h1>
          <span className={styles.author}>By {post.author}</span>
        </div>
      </div>
      <div className={`container ${styles.content}`}>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.body}>
          {post.content.split('\n').map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
    </PublicLayout>
  );
}

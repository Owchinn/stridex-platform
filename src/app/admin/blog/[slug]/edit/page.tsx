'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';
import styles from '../../../events/page.module.css';

export default function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const postSlug = resolvedParams.slug;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState('');

  const [postData, setPostData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    author: 'Admin',
    published: false
  });

  useEffect(() => {
    fetchPost();
  }, [postSlug]);

  const fetchPost = async () => {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', postSlug)
      .single();

    if (error) {
      alert('Error fetching post: ' + error.message);
      router.push('/admin/blog');
      return;
    }

    setPostId(post.id);
    setPostData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image,
      author: post.author,
      published: post.published
    });

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPostData(prev => ({ ...prev, [name]: checked }));
      return;
    }

    setPostData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          excerpt: postData.excerpt,
          image: postData.image,
          author: postData.author,
          published: postData.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      alert('Blog post updated successfully!');
      router.push('/admin/blog');
    } catch (err: any) {
      console.error(err);
      alert('Error updating blog post: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading post details...</div>;

  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Edit Blog Post</h1>
        <button type="button" onClick={() => router.push('/admin/blog')} className="btn-secondary">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formCard}>
          <h2>Post Details</h2>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
              <label>Post Title</label>
              <input type="text" name="title" value={postData.title} onChange={handleChange} required />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Slug</label>
              <input type="text" name="slug" value={postData.slug} onChange={handleChange} required />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Author</label>
              <input type="text" name="author" value={postData.author} onChange={handleChange} required />
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
              <label>Cover Image URL</label>
              <input type="url" name="image" value={postData.image} onChange={handleChange} required />
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
              <label>Excerpt (Short Summary)</label>
              <textarea name="excerpt" value={postData.excerpt} onChange={handleChange} required rows={2} />
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
              <label>Content (Markdown or HTML)</label>
              <textarea name="content" value={postData.content} onChange={handleChange} required rows={10} style={{ fontFamily: 'monospace' }} />
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="published" 
                  checked={postData.published} 
                  onChange={handleChange} 
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                Publish immediately (Visible to public)
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

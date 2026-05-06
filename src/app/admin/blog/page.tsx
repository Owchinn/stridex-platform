'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Link from 'next/link';
import styles from '../events/page.module.css';

export default function AdminBlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      alert('Error deleting post: ' + error.message);
    } else {
      alert('Post deleted successfully.');
      fetchPosts();
    }
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>Blog Posts</h1>
        <Link href="/admin/blog/new" className="btn-primary">
          + New Post
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</td></tr>
            ) : posts.length > 0 ? (
              posts.map((post: any) => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong></td>
                  <td>{post.author}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${post.published ? styles.ongoing : styles.past}`}>
                      {post.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <Link href={`/admin/blog/${post.slug}/edit`} className={styles.editBtn}>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(post.id, post.title)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>No blog posts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

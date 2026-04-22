import { Metadata } from 'next';
import PostDetailClient from '@/components/blog/PostDetailClient';
import api from '@/services/api';
import { Post } from '@/types';
import Link from 'next/link';

// Fetch post data for metadata and page content
async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await api.get(`/posts/${slug}`);
    return res.data;
  } catch (error: any) {
    console.error('SERVER-SIDE FETCH ERROR:', error.message, 'for slug:', slug);
    return null;
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Combine manual keywords with tags and category name
  const keywordsSet = new Set<string>();
  if (post.primaryKeywords) keywordsSet.add(post.primaryKeywords.trim());
  if (post.secondaryKeywords) post.secondaryKeywords.split(',').forEach(k => keywordsSet.add(k.trim()));
  if (post.longTailKeywords) post.longTailKeywords.split(/[,\n]/).forEach(k => keywordsSet.add(k.trim()));
  keywordsSet.add(post.category.name);
  post.tags.forEach(t => keywordsSet.add(t.name));

  return {
    title: `${post.title} | DevBlog`,
    description: post.excerpt || post.content.substring(0, 160),
    keywords: Array.from(keywordsSet),
  };
}

export default async function PostDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Post not found</h2>
        <Link href="/" className="text-indigo-600 hover:underline">Return Home</Link>
      </div>
    );
  }

  return <PostDetailClient post={post} />;
}

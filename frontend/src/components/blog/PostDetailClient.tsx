'use client';

import { format } from 'date-fns';
import { Share2, Heart, MessageSquare, ChevronLeft, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Post, Comment } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import BlogCard from '@/components/blog/BlogCard';
import { estimateReadMinutesFromHtml } from '@/lib/readTime';

interface PostDetailClientProps {
  post: Post;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [likeCount, setLikeCount] = useState(post._count?.likes ?? 0);
  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);
  const [shareHint, setShareHint] = useState<string | null>(null);

  const readMinutes = estimateReadMinutesFromHtml(post.content);

  useEffect(() => {
    setLikeCount(post._count?.likes ?? 0);
  }, [post.id, post._count?.likes]);

  useEffect(() => {
    if (!user?.id) {
      setLiked(false);
      return;
    }
    let cancelled = false;
    api
      .get<{ liked: boolean; likeCount: number }>(`/interactions/likes/${post.id}`)
      .then((res) => {
        if (cancelled) return;
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user?.id, post.id]);

  useEffect(() => {
    if (!shareHint) return;
    const t = window.setTimeout(() => setShareHint(null), 2500);
    return () => window.clearTimeout(t);
  }, [shareHint]);

  useEffect(() => {
    api.post(`/posts/${encodeURIComponent(post.slug)}/view`).catch(() => {});
  }, [post.slug]);

  useEffect(() => {
    const slug = post.category?.slug;
    if (!slug) {
      setRelatedPosts([]);
      return;
    }
    let cancelled = false;
    api
      .get<{ posts: Post[] }>('/posts', { params: { category: slug, limit: 8 } })
      .then((res) => {
        if (cancelled) return;
        const others = res.data.posts.filter((p) => p.id !== post.id);
        setRelatedPosts(others.slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setRelatedPosts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [post.id, post.category?.slug]);

  const handleLike = useCallback(async () => {
    if (!user) {
      const next = encodeURIComponent(pathname || `/blogs/${post.slug}`);
      router.push(`/login?next=${next}`);
      return;
    }
    if (likeBusy) return;
    setLikeBusy(true);
    try {
      const { data } = await api.post<{ liked: boolean; likeCount: number }>('/interactions/likes', {
        postId: post.id,
      });
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      alert('Could not update like. Try again.');
    } finally {
      setLikeBusy(false);
    }
  }, [user, likeBusy, post.id, post.slug, pathname, router]);

  const handleShare = useCallback(async () => {
    const url =
      typeof window !== 'undefined' ? `${window.location.origin}${pathname || `/blogs/${post.slug}`}` : '';
    if (!url) return;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt?.slice(0, 200) || post.title,
          url,
        });
        return;
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareHint('Link copied to clipboard');
    } catch {
      setShareHint('Copy blocked — copy the address from your browser bar');
    }
  }, [post.title, post.excerpt, post.slug, pathname]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/interactions/comments', { postId: post.id, content: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to stories</span>
      </Link>

      <header className="mb-12 space-y-6">
        <div className="space-y-4">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category.name}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
              {post.author.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 dark:text-slate-100">{post.author.name}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-600" aria-hidden>
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5" title="Estimated reading time">
                  <Clock className="w-4 h-4 shrink-0" aria-hidden />
                  <span>{readMinutes} min read</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:ml-auto">
            <button
              type="button"
              onClick={handleLike}
              disabled={likeBusy}
              title={user ? (liked ? 'Unlike' : 'Like') : 'Sign in to like'}
              aria-pressed={liked}
              className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 ${
                liked ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-sm tabular-nums text-slate-500 min-w-[1.25rem]" aria-live="polite">
              {likeCount}
            </span>
            <button
              type="button"
              onClick={handleShare}
              title="Share or copy link"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          {shareHint && (
            <p className="w-full text-right text-xs text-indigo-600 dark:text-indigo-400 sm:col-span-2" role="status">
              {shareHint}
            </p>
          )}
        </div>
      </header>

      {post.coverImage && (
        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
          <img src={post.coverImage} alt={post.title} className="w-full object-cover" />
        </div>
      )}

      <div
        className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-16"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {relatedPosts.length > 0 && (
        <section className="mb-16 pt-4 border-t border-slate-200 dark:border-slate-800" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
            <BookOpen className="w-7 h-7 text-indigo-500 shrink-0" aria-hidden />
            More in {post.category.name}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Related stories from the same category.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 not-prose max-w-5xl mx-auto">
            {relatedPosts.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-bold mb-8 flex items-center space-x-2">
          <MessageSquare className="w-6 h-6" />
          <span>Discussion ({comments.length})</span>
        </h3>

        {user ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] mb-4"
              placeholder="What are your thoughts?"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleCommentSubmit}
              disabled={isSubmitting || !newComment.trim()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-xl mb-8 flex items-center justify-between border border-amber-200 dark:border-amber-800/30">
            <p className="font-medium">Login is required to add your point of view.</p>
            <Link href="/login" className="bg-amber-100 dark:bg-amber-800/50 px-4 py-2 rounded-lg font-bold hover:bg-amber-200 dark:hover:bg-amber-700/50 transition-colors">
              Login
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              {comment.user?.avatar ? (
                <img src={comment.user.avatar} alt={comment.user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
                  {comment.user?.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="font-bold">{comment.user?.name || 'Anonymous'}</p>
                <p className="text-sm text-slate-500 mb-2">{format(new Date(comment.createdAt), 'MMM dd, yyyy')}</p>
                <p className="text-slate-700 dark:text-slate-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

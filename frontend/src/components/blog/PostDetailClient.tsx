'use client';

import { format } from 'date-fns';
import { Share2, Heart, MessageSquare, ChevronLeft, Target, Layers, Hash } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/types';

interface PostDetailClientProps {
  post: Post;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
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

        <div className="flex items-center justify-between pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold">{post.author.name}</p>
              <p className="text-sm text-slate-500">{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Heart className="w-5 h-5 text-slate-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Share2 className="w-5 h-5 text-slate-500" />
            </button>
          </div>
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

      <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>SEO Analysis & Taxonomy</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Primary</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.primaryKeywords || 'None'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider text-ellipsis overflow-hidden whitespace-nowrap">Secondary</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.secondaryKeywords || 'None'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Long Tail</p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
              {post.longTailKeywords || 'None'}
            </p>
          </div>
        </div>
      </div>

      <section className="pt-12 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-bold mb-8 flex items-center space-x-2">
          <MessageSquare className="w-6 h-6" />
          <span>Discussion ({post.comments?.length || 0})</span>
        </h3>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8">
          <textarea 
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] mb-4"
            placeholder="What are your thoughts?"
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            Post Comment
          </button>
        </div>

        <div className="space-y-6">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
              <div>
                <p className="font-bold">{comment.user.name}</p>
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

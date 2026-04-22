'use client';

import { usePosts } from '@/hooks/usePosts';
import BlogCard from '@/components/blog/BlogCard';
import { Post } from '@/types';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePosts({ search });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
          Small steps, <span className="text-indigo-600 italic">giant-leaps</span>.
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore the world of development, design, and cricket through the eyes of our passionate writers.
        </p>
      </section>

      {/* Featured Posts Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <h2 className="text-3xl font-bold">Latest Stories</h2>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Fetching latest stories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.posts?.map((post: Post) => (
            <BlogCard key={post.id} post={post} />
          ))}
          {data?.posts?.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-500 text-lg">No stories found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

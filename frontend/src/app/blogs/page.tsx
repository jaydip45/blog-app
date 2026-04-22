'use client';

import { usePosts } from '@/hooks/usePosts';
import BlogCard from '@/components/blog/BlogCard';
import { Post } from '@/types';
import { Search, Loader2, Filter } from 'lucide-react';
import { useState } from 'react';

export default function BlogsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePosts({ search });

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          All Stories
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Browse our complete collection of insights, tutorials, and stories.
        </p>
      </header>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search all stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-lg"
          />
        </div>

        <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-bold">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading stories...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {data?.posts?.map((post: Post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {data?.posts?.length === 0 && (
            <div className="text-center py-24 bg-white dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">No stories found</h3>
              <p className="text-slate-500">Try adjusting your search terms to find what you're looking for.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

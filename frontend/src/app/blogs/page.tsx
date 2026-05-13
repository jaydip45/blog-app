'use client';

import { usePosts } from '@/hooks/usePosts';
import BlogCard from '@/components/blog/BlogCard';
import { Category, Post, Tag } from '@/types';
import { Search, Loader2, Filter, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function BlogsPage() {
  const [search, setSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [tagSlug, setTagSlug] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const postParams = useMemo(() => {
    const p: Record<string, string> = {};
    const q = search.trim();
    if (q) p.search = q;
    if (categorySlug) p.category = categorySlug;
    if (tagSlug) p.tag = tagSlug;
    return p;
  }, [search, categorySlug, tagSlug]);

  const { data, isLoading } = usePosts(postParams);

  const { data: categories = [] } = useQuery({
    queryKey: ['taxonomy', 'categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/taxonomy/categories');
      return data;
    },
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['taxonomy', 'tags'],
    queryFn: async () => {
      const { data } = await api.get<Tag[]>('/taxonomy/tags');
      return data;
    },
  });

  const hasActiveFilters = Boolean(categorySlug || tagSlug);
  const clearFilters = () => {
    setCategorySlug('');
    setTagSlug('');
  };

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

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
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

        <div className="flex flex-col items-stretch md:items-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={`flex items-center justify-center space-x-2 px-6 py-3 border rounded-2xl font-bold transition-all ${
              filtersOpen || hasActiveFilters
                ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters && <span className="text-xs font-normal opacity-90">(active)</span>}
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="mb-10 p-6 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Narrow results</h2>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear category & tag
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Category</span>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                    {c._count?.posts != null ? ` (${c._count.posts})` : ''}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Tag</span>
              <select
                value={tagSlug}
                onChange={(e) => setTagSlug(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All tags</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name}
                    {t._count?.posts != null ? ` (${t._count.posts})` : ''}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

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
              <p className="text-slate-500">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

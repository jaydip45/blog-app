'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreatePost } from '@/hooks/usePosts';
import api from '@/services/api';
import Editor from '@/components/blog/Editor';
import PreviewModal from '@/components/blog/PreviewModal';
import { Category, Tag, Post } from '@/types';
import { Loader2, Image as ImageIcon, Send, Key, Eye } from 'lucide-react';

export default function CreatePostPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const createPost = useCreatePost();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  // Keyword Categories
  const [primaryKeywords, setPrimaryKeywords] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [longTailKeywords, setLongTailKeywords] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingTaxonomy, setIsLoadingTaxonomy] = useState(true);
  
  // Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'AUTHOR' && user?.role !== 'ADMIN')) {
      router.push('/login');
    }

    const fetchTaxonomy = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          api.get('/taxonomy/categories'),
          api.get('/taxonomy/tags')
        ]);
        setCategories(catRes.data);
        setTags(tagRes.data);
        if (catRes.data.length > 0) setCategoryId(catRes.data[0].id);
      } catch (err) {
        console.error('Failed to fetch taxonomy', err);
      } finally {
        setIsLoadingTaxonomy(false);
      }
    };

    fetchTaxonomy();
  }, [isAuthenticated, user, router]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.includes('google.com/imgres')) {
      try {
        const url = new URL(val);
        const imgurl = url.searchParams.get('imgurl');
        if (imgurl) {
          val = imgurl;
        }
      } catch (err) {
        // ignore invalid url
      }
    }
    setCoverImage(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({
      title,
      content,
      excerpt,
      coverImage,
      primaryKeywords,
      secondaryKeywords,
      longTailKeywords,
      categoryId,
      tags: selectedTags,
      published: true
    });
  };

  // Construct mock post for preview
  const mockPost: Post = {
    id: 'preview',
    title: title || 'Untitled Draft',
    slug: 'preview',
    content: content || '<p>Start writing to see a preview...</p>',
    excerpt,
    coverImage,
    primaryKeywords,
    secondaryKeywords,
    longTailKeywords,
    published: false,
    views: 0,
    createdAt: new Date().toISOString(),
    author: {
      id: user?.id || 'admin',
      name: user?.name || 'Author Name',
    },
    category: categories.find(c => c.id === categoryId) || { id: '1', name: 'General', slug: 'general' },
    tags: tags.filter(t => selectedTags.includes(t.id)),
    comments: [],
    _count: { comments: 0, likes: 0 }
  };

  if (isLoadingTaxonomy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-black mb-8 italic">Draft your masterpiece.</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <input
            type="text"
            placeholder="Title of your story..."
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Editor content={content} onChange={setContent} />

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500">Excerpt (Summary)</label>
              <textarea
                placeholder="What is this story about?"
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Cover Image URL</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none"
                value={coverImage}
                onChange={handleCoverImageChange}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>SEO Keywords</span>
            </h3>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Primary Keyword</label>
              <input
                type="text"
                placeholder="Main focus keyword"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                value={primaryKeywords}
                onChange={(e) => setPrimaryKeywords(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Secondary Keywords</label>
              <input
                type="text"
                placeholder="Related terms (comma separated)"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Long Tail Keywords</label>
              <textarea
                placeholder="Phrases and specific queries"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                rows={2}
                value={longTailKeywords}
                onChange={(e) => setLongTailKeywords(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500">Category</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 outline-none"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      if (selectedTags.includes(tag.id)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag.id));
                      } else {
                        setSelectedTags([...selectedTags, tag.id]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedTags.includes(tag.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                <Eye className="w-5 h-5" />
                <span>Preview</span>
              </button>

              <button
                type="submit"
                disabled={createPost.isPending}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {createPost.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        post={mockPost} 
      />
    </div>
  );
}

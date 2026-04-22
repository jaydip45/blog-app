'use client';

import { X } from 'lucide-react';
import PostDetailClient from './PostDetailClient';
import { Post } from '@/types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export default function PreviewModal({ isOpen, onClose, post }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-4 md:p-8">
      <div className="bg-white dark:bg-slate-900 w-full h-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Preview Mode</span>
            <p className="text-sm font-bold text-slate-500">Unpublished Draft</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <PostDetailClient post={post} />
        </div>

        <footer className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 italic">This is an approximate preview of how your blog will appear once published.</p>
        </footer>
      </div>
    </div>
  );
}

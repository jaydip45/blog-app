import Link from 'next/link';
import { Post } from '@/types';
import { Calendar, Eye, MessageSquare, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogCard({ post }: { post: Post }) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700">
      <Link href={`/blogs/${post.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category.name}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
        </div>

        <Link href={`/blogs/${post.slug}`}>
          <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
          {post.excerpt || 'Read more about this interesting topic and stay updated with the latest trends.'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              {post.author.name.charAt(0)}
            </div>
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xs">{post._count?.likes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

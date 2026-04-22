'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, User, Menu, X, Feather } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Feather className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight">DevBlog</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/blogs" className="hover:text-indigo-600 transition-colors">Blogs</Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {(user?.role === 'AUTHOR' || user?.role === 'ADMIN') && (
                  <Link href="/blogs/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                    Write Post
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-indigo-600 transition-colors">
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">Profile</Link>
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">Admin Panel</Link>
                    )}
                    <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="hover:text-indigo-600 transition-colors">Login</Link>
                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all font-medium">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4">
          <Link href="/" className="block">Home</Link>
          <Link href="/blogs" className="block">Blogs</Link>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="block">Profile</Link>
              {(user?.role === 'AUTHOR' || user?.role === 'ADMIN') && (
                <Link href="/blogs/create" className="block">Write Post</Link>
              )}
              <button onClick={logout} className="block text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block">Login</Link>
              <Link href="/register" className="block text-indigo-600">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

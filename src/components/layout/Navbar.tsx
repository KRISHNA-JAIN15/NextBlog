"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  }; return (
    <nav className="relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 backdrop-blur-xl border-b border-primary-500/20 sticky top-0 z-50 shadow-2xl overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 via-accent-600/5 to-secondary-600/5 animate-pulse-glow"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group relative">
              {/* Logo Icon */}
              <div className="relative mr-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 flex items-center justify-center shadow-2xl group-hover:shadow-primary-500/70 group-hover:scale-110 transition-all duration-500 animate-pulse-glow">
                  <svg 
                    className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-primary-300 transition-all duration-300 relative drop-shadow-lg">
                NextBlog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 group-hover:w-full transition-all duration-500"></span>
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
              <Link
                href="/"
                className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group ${pathname === '/'
                    ? 'bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-primary-500/30 text-white shadow-lg shadow-primary-500/30 border border-primary-500/30'
                    : 'text-neutral-200 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800 hover:to-neutral-700 border border-transparent hover:border-neutral-600'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
                {pathname === '/' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 animate-pulse"></span>}
              </Link>
              <Link
                href="/blogs"
                className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group ${pathname?.startsWith('/blogs')
                    ? 'bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-primary-500/30 text-white shadow-lg shadow-primary-500/30 border border-primary-500/30'
                    : 'text-neutral-200 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800 hover:to-neutral-700 border border-transparent hover:border-neutral-600'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Blogs
                {pathname?.startsWith('/blogs') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 animate-pulse"></span>}
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group ${pathname?.startsWith('/dashboard')
                      ? 'bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-primary-500/30 text-white shadow-lg shadow-primary-500/30 border border-primary-500/30'
                      : 'text-neutral-200 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800 hover:to-neutral-700 border border-transparent hover:border-neutral-600'
                    }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                  {pathname?.startsWith('/dashboard') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 animate-pulse"></span>}
                </Link>
              )}
              <Link
                href="/subscription"
                className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group ${pathname?.startsWith('/subscription')
                    ? 'bg-gradient-to-r from-secondary-500/30 via-accent-500/20 to-secondary-500/30 text-white shadow-lg shadow-secondary-500/30 border border-secondary-500/30'
                    : 'text-neutral-200 hover:text-white hover:bg-gradient-to-r hover:from-secondary-800/50 hover:to-secondary-700/50 border border-transparent hover:border-secondary-600'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Premium
                {pathname?.startsWith('/subscription') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-secondary-400 to-accent-400 animate-pulse"></span>}
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-neutral-800 to-neutral-900 border border-primary-500/30 shadow-xl shadow-primary-500/20 group hover:shadow-primary-500/40 transition-all duration-300">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm shadow-lg animate-pulse-glow">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 blur-md opacity-50"></div>
                  </div>
                  <span className="text-sm font-bold text-white relative">
                    {user.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-400 group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <div className="absolute inset-0 rounded-full border border-primary-400/50 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity"></div>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-200 hover:text-white bg-gradient-to-r from-red-600/10 to-red-500/10 border border-red-500/30 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <svg className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative z-10">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-neutral-200 hover:text-white bg-gradient-to-r from-neutral-800 to-neutral-700 border border-neutral-600 hover:border-neutral-500 hover:shadow-lg hover:shadow-neutral-500/30 transition-all duration-300 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-neutral-700 to-neutral-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative z-10">Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 hover:from-primary-500 hover:via-accent-500 hover:to-secondary-500 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 group overflow-hidden border border-primary-400/30"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <svg className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="relative z-10">Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-200 hover:text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden bg-gradient-to-b from-neutral-900 to-neutral-950 border-t border-primary-500/20`}>
        <div className="pt-2 pb-3 space-y-2 px-4">
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${pathname === '/'
                ? 'bg-gradient-to-r from-primary-500/30 to-accent-500/20 text-white shadow-lg shadow-primary-500/30 border border-primary-500/30'
                : 'text-neutral-200 hover:bg-neutral-800 hover:text-white border border-transparent'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link
            href="/blogs"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${pathname?.startsWith('/blogs')
                ? 'bg-gradient-to-r from-primary-500/30 to-accent-500/20 text-white shadow-lg shadow-primary-500/30 border border-primary-500/30'
                : 'text-neutral-200 hover:bg-neutral-800 hover:text-white border border-transparent'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Blogs
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${pathname?.startsWith('/dashboard')
                  ? 'bg-gradient-to-r from-primary-500/30 to-accent-500/20 text-white shadow-lg shadow-primary-500/30 border border-primary-500/30'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-white border border-transparent'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
          )}
          <Link
            href="/subscription"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${pathname?.startsWith('/subscription')
                ? 'bg-gradient-to-r from-secondary-500/30 to-accent-500/20 text-white shadow-lg shadow-secondary-500/30 border border-secondary-500/30'
                : 'text-neutral-200 hover:bg-secondary-800/50 hover:text-white border border-transparent'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Premium
          </Link>
        </div>

        <div className="pt-4 pb-3 border-t border-primary-500/20 px-4">
          {user ? (
            <div className="space-y-3">
              <div className="relative flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 border border-primary-500/30 shadow-xl shadow-primary-500/20">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse-glow">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 blur-md opacity-50"></div>
                </div>
                <div>
                  <div className="text-base font-bold text-white">{user.name}</div>
                  <div className="text-sm text-neutral-400">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-base font-bold bg-gradient-to-r from-red-600/10 to-red-500/10 text-neutral-200 hover:text-white border border-red-500/30 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                className="flex items-center px-4 py-3 rounded-xl text-base font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
              <Link
                href="/signup"
                className="flex items-center px-4 py-3 rounded-xl text-base font-semibold bg-primary-500/30 text-white hover:bg-primary-500/40 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
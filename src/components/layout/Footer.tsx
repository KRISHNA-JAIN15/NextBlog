import React from 'react';
import Link from 'next/link';
import { Container } from './Container';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-b from-dark-100 to-dark-200 border-t border-white/5 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/5 via-transparent to-transparent"></div>
      
      <Container className="relative z-10">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-block group">
                <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary-400 via-accent-400 to-secondary-400 bg-clip-text text-transparent hover:from-primary-300 hover:to-secondary-300 transition-all duration-300">
                  NextBlog
                </span>
              </Link>
              <p className="mt-5 text-base text-neutral-400/90 leading-relaxed font-light max-w-sm">
                A modern blogging platform built with Next.js, Prisma, and Tailwind CSS. Share your ideas with the world.
              </p>
              {/* Social Links */}
              <div className="mt-8 flex items-center gap-4">
                <a 
                  href="https://github.com" 
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-primary-500/20 border border-white/5 hover:border-primary-500/30 transition-all duration-300" 
                  target="_blank" 
                  rel="noreferrer noopener"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://twitter.com" 
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-accent-500/20 border border-white/5 hover:border-accent-500/30 transition-all duration-300" 
                  target="_blank" 
                  rel="noreferrer noopener"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com" 
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-secondary-500/20 border border-white/5 hover:border-secondary-500/30 transition-all duration-300" 
                  target="_blank" 
                  rel="noreferrer noopener"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-neutral-300 tracking-[0.2em] uppercase mb-5">
                Navigation
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200 inline-flex items-center gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/40 group-hover:bg-primary-400 group-hover:shadow-[0_0_8px_rgba(var(--primary-500),0.5)] transition-all duration-200"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200 inline-flex items-center gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/40 group-hover:bg-primary-400 group-hover:shadow-[0_0_8px_rgba(var(--primary-500),0.5)] transition-all duration-200"></span>
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200 inline-flex items-center gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/40 group-hover:bg-primary-400 group-hover:shadow-[0_0_8px_rgba(var(--primary-500),0.5)] transition-all duration-200"></span>
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Account */}
            <div>
              <h3 className="text-xs font-semibold text-neutral-300 tracking-[0.2em] uppercase mb-5">
                Account
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/login" className="text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200 inline-flex items-center gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500/40 group-hover:bg-accent-400 group-hover:shadow-[0_0_8px_rgba(var(--accent-500),0.5)] transition-all duration-200"></span>
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-neutral-400 hover:text-white text-sm font-medium transition-colors duration-200 inline-flex items-center gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500/40 group-hover:bg-accent-400 group-hover:shadow-[0_0_8px_rgba(var(--accent-500),0.5)] transition-all duration-200"></span>
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-neutral-500 font-light">
                © {currentYear} <span className="text-neutral-400 font-normal">NextBlog</span>. All rights reserved.
              </p>
              <p className="text-sm text-neutral-500 font-light flex items-center gap-1.5">
                Made with <span className="text-red-400 animate-pulse">♥</span> using 
                <span className="text-neutral-400 font-medium">Next.js</span> & 
                <span className="text-neutral-400 font-medium">Tailwind CSS</span>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
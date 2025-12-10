"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './Button';

interface NavbarProps {
  isAuthenticated?: boolean;
  userEmail?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated = false, 
  userEmail = '' 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary-600 text-xl font-bold">
                NextBlog
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Auth buttons / User menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-neutral-700 truncate max-w-[150px]">
                    {userEmail}
                  </span>
                  <Button
                    href="/api/auth/logout"
                    variant="outline"
                    size="sm"
                  >
                    Sign out
                  </Button>
                  <Button
                    href="/dashboard"
                    variant="primary"
                    size="sm"
                  >
                    Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button
                  href="/auth/login"
                  variant="outline"
                  size="sm"
                >
                  Log in
                </Button>
                <Button
                  href="/auth/signup"
                  variant="primary"
                  size="sm"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-primary-600 hover:bg-neutral-100"
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-4 space-y-1 border-t border-neutral-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                pathname === link.href
                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary-600'
              }`}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Mobile auth buttons */}
        <div className="pt-4 pb-3 border-t border-neutral-200">
          <div className="space-y-2 px-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center mb-3">
                  <div>
                    <div className="text-base font-medium text-neutral-800 truncate">
                      {userEmail}
                    </div>
                  </div>
                </div>
                <Button
                  href="/dashboard"
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={closeMenu}
                >
                  Dashboard
                </Button>
                <Button
                  href="/api/auth/logout"
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={closeMenu}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  href="/auth/login"
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={closeMenu}
                >
                  Log in
                </Button>
                <Button
                  href="/auth/signup"
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={closeMenu}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
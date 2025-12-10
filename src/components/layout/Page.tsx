import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Container } from './Container';

interface PageProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  withoutPadding?: boolean;
}

export const Page: React.FC<PageProps> = ({
  children,
  fullWidth = false,
  withoutPadding = false,
}) => {
  const containerSize = fullWidth ? 'full' : 'lg';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className={`flex-grow ${withoutPadding ? '' : 'py-8'}`}>
        {fullWidth ? (
          children
        ) : (
          <Container size={containerSize}>
            {children}
          </Container>
        )}
      </main>
      
      <Footer />
    </div>
  );
};
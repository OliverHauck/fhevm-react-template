import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl ${className}`}>
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

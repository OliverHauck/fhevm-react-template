/**
 * Card Component
 * Reusable card container
 */

'use client';

import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-lg p-6 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-bold text-white mb-2">{title}</h3>}
          {description && <p className="text-gray-400 text-sm">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

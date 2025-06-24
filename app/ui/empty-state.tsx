'use client';

import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

import React, { ComponentType } from 'react';

type EmptyStateProps = {
  message?: string;
  icon?: ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function EmptyState({
  message = 'No results found. Try adjusting your filters or search.',
  icon: Icon = DocumentMagnifyingGlassIcon,
}: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 py-10 text-gray-500">
      <Icon className="h-8 w-8 text-gray-400" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

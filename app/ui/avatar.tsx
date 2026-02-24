'use client';

import Image from 'next/image';
import { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function Avatar({
  src,
  alt,
  width = 28,
  height = 28,
  className = '',
}: {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <UserCircleIcon
        aria-label={alt}
        style={{ width, height }}
        className={`text-gray-400 ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

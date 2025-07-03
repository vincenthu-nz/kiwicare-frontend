import Image from 'next/image';

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
  const fallback = '/default-avatar.png';

  return (
    <Image
      src={src || fallback}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

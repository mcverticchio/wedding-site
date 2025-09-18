interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
  lines?: number; // For text variant
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-warmSand/30';

  const variantClasses = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded-sm',
  };

  const baseStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => {
          const lineStyle = {
            ...baseStyle,
            width: width
              ? typeof width === 'number'
                ? `${width}px`
                : width
              : index === lines - 1
                ? '75%'
                : '100%',
          };

          return (
            <div
              key={index}
              className={`${baseClasses} ${variantClasses.text} h-4`}
              style={lineStyle}
              role="presentation"
              aria-hidden="true"
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={baseStyle}
      role="presentation"
      aria-hidden="true"
    />
  );
}

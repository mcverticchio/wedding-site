export function MapEmbed({
  src,
  title = 'Google Map',
  height = 300,
  className = '',
}: {
  src: string;
  title?: string;
  height?: number;
  className?: string;
}) {
  return (
    <div className={['overflow-hidden rounded-md border border-warmSand/60', className].join(' ')}>
      <iframe
        src={src}
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        aria-label={title}
      />
    </div>
  );
}

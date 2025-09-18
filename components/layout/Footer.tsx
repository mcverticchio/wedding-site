import Link from 'next/link';

export function Footer({ text, email }: { text?: string; email?: string }) {
  return (
    <footer className="border-t border-warmSand/60 bg-cream">
      <div className="container py-8 text-center text-sm text-ink/70">
        {text ? <div>{text}</div> : null}
        {email ? (
          <div className="mt-2">
            <Link
              href={`mailto:${email}`}
              className="text-autumnGreen underline-offset-4 hover:underline"
            >
              {email}
            </Link>
          </div>
        ) : null}
      </div>
    </footer>
  );
}

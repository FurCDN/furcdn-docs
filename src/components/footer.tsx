import { cn } from '@/lib/cn';

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'mt-auto border-t border-fd-border text-fd-muted-foreground',
        className,
      )}
    >
      <div className="mx-auto flex max-w-fd-container flex-col items-center gap-1 px-4 py-6 text-center text-xs">
        <p>
          © 2023-2026{' '}
          <span className="font-medium text-fd-foreground">
            SLOWSPEED NETWORK LLC.
          </span>{' '}
          版權所有
        </p>
        <p>
          由{' '}
          <a
            href="https://langya.io"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-fd-foreground underline-offset-4 hover:underline"
          >
            langya.io
          </a>{' '}
          驅動
        </p>
      </div>
    </footer>
  );
}

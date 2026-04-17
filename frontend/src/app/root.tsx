import { Outlet, Link } from 'react-router';

export function Root() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex h-14 max-w-[var(--layout-max)] items-center justify-between px-4">
          <Link
            to="/"
            className="font-serif text-xl font-semibold tracking-tight text-[var(--color-fg-primary)]"
          >
            Blackyak 100
          </Link>
          <nav className="flex gap-4 text-sm text-[var(--color-fg-secondary)]">
            <Link to="/explore">탐색</Link>
            <Link to="/map">지도</Link>
            <Link to="/collections">모음집</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-fg-muted)]">
        © 2026 Blackyak Mountain Tracker v2 · 베타
      </footer>
    </div>
  );
}

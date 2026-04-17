import { useParams } from 'react-router';

export function CollectionDetailPage() {
  const { theme } = useParams();
  return (
    <section className="mx-auto max-w-[var(--layout-max)] px-4 py-12">
      <h1 className="text-[length:var(--text-display-md)]">모음집 · {theme}</h1>
      <p className="mt-3 text-[var(--color-fg-secondary)]">P4에서 구현 예정.</p>
    </section>
  );
}

import { useParams } from 'react-router';

export function MountainDetailPage() {
  const { slug } = useParams();
  return (
    <section className="mx-auto max-w-[var(--layout-max)] px-4 py-12">
      <h1 className="text-[length:var(--text-display-md)]">산 상세</h1>
      <p className="mt-3 text-[var(--color-fg-secondary)]">
        slug: <code>{slug}</code> · P2에서 구현 예정.
      </p>
    </section>
  );
}

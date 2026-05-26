export default function ProductLoading() {
  return (
    <main className="max-w-4xl mx-auto px-6 pb-8 min-h-screen">
      {/* Top bar skeleton */}
      <div className="flex items-center gap-3 py-3 border-b border-border">
        <div className="w-8 h-8 bg-surface-raised skeleton-pulse rounded" />
        <div className="w-20 h-5 bg-surface-raised skeleton-pulse rounded" />
      </div>

      <div className="pt-6 space-y-6">
        {/* Image + title layout matching ProductCard grid */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <div className="w-full h-48 bg-surface-raised skeleton-pulse rounded-lg" />
          <div className="space-y-2">
            <div className="w-3/4 h-7 bg-surface-raised skeleton-pulse rounded" />
            <div className="w-1/2 h-4 bg-surface-raised skeleton-pulse rounded" />
          </div>
        </div>

        {/* Score badges */}
        <div className="flex gap-3">
          <div className="w-[100px] h-[76px] bg-surface-raised skeleton-pulse rounded-lg" />
          <div className="w-[100px] h-[76px] bg-surface-raised skeleton-pulse rounded-lg" />
          <div className="w-[100px] h-[76px] bg-surface-raised skeleton-pulse rounded-lg" />
        </div>

        {/* Summary card */}
        <div className="w-full h-14 bg-surface-raised skeleton-pulse rounded-lg" />

        {/* Nutrient rows */}
        <div className="space-y-2 pt-6 border-t border-border">
          <div className="w-32 h-5 bg-surface-raised skeleton-pulse rounded" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2">
              <div className="w-24 h-4 bg-surface-raised skeleton-pulse rounded" />
              <div className="w-16 h-4 bg-surface-raised skeleton-pulse rounded" />
              <div className="w-12 h-4 bg-surface-raised skeleton-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { Heading3 } from '@/components/atoms';

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-surface-raised ${className ?? ''}`} />;
}

export default function CompareLoading() {
  return (
    <main className="max-w-4xl mx-auto px-6 pb-8 min-h-screen">
      {/* Top bar */}
      <div className="flex items-center gap-3 py-3 border-b border-border">
        <SkeletonBlock className="w-9 h-9" />
        <Heading3 as="h1">Compare</Heading3>
      </div>

      <div className="pt-6 space-y-6">
        {/* Product headers */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr>
                <th className="p-3 min-w-[120px] border-b border-border">
                  <SkeletonBlock className="h-4 w-12" />
                </th>
                {[1, 2].map((i) => (
                  <th key={i} className="p-3 border-b border-border">
                    <div className="flex flex-col items-center gap-2 min-w-[140px]">
                      <SkeletonBlock className="w-16 h-16 rounded-lg" />
                      <SkeletonBlock className="h-4 w-24" />
                      <SkeletonBlock className="h-3 w-16" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Score rows */}
              {[1, 2, 3, 4].map((row) => (
                <tr key={`score-${row}`} className="border-b border-border">
                  <td className="p-3"><SkeletonBlock className="h-4 w-20" /></td>
                  {[1, 2].map((col) => (
                    <td key={col} className="p-3">
                      <div className="flex justify-center">
                        <SkeletonBlock className="h-7 w-20 rounded-full" />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              {/* Nutrient rows */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                <tr key={`nutrient-${row}`} className={`border-b border-border ${row % 2 === 0 ? 'bg-surface/50' : ''}`}>
                  <td className="p-3">
                    <SkeletonBlock className="h-4 w-24" />
                  </td>
                  {[1, 2].map((col) => (
                    <td key={col} className="p-3">
                      <div className="flex justify-center">
                        <SkeletonBlock className="h-4 w-12" />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

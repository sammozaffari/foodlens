'use client';

import { useRouter } from 'next/navigation';
import { Button, BodySmall, Caption } from '@/components/atoms';
import type { SearchResultProduct } from '@/types/product';

interface CompareBarProps {
  barcodes: string[];
  products: SearchResultProduct[];
  onClear: () => void;
  onRemove: (barcode: string) => void;
}

export function CompareBar({ barcodes, products, onClear, onRemove }: CompareBarProps) {
  const router = useRouter();
  const visible = barcodes.length >= 2;

  const handleCompare = () => {
    router.push(`/compare?barcodes=${barcodes.join(',')}`);
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        bg-surface border-t border-border shadow-lg
        transition-transform duration-300 ease-out
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
      role="region"
      aria-label="Product comparison bar"
      aria-hidden={!visible}
    >
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Product thumbnails */}
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
          {barcodes.map((barcode) => {
            const product = products.find((p) => p.barcode === barcode);
            return (
              <div key={barcode} className="flex items-center gap-1.5 flex-shrink-0">
                {product?.imageSmallUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageSmallUrl}
                    alt={product.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-surface-raised flex items-center justify-center">
                    <Caption className="text-text-subtle">?</Caption>
                  </div>
                )}
                <BodySmall className="text-text-muted truncate max-w-[100px] hidden md:block" as="span">
                  {product?.name ?? barcode}
                </BodySmall>
                <button
                  type="button"
                  onClick={() => onRemove(barcode)}
                  aria-label={`Remove ${product?.name ?? barcode} from comparison`}
                  className="text-text-subtle hover:text-text transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button size="sm" onClick={handleCompare}>
            Compare {barcodes.length}
          </Button>
        </div>
      </div>
    </div>
  );
}

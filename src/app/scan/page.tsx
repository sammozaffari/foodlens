'use client';

import { useRouter } from 'next/navigation';
import { Scanner } from '@/components/organisms';

export default function ScanPage() {
  const router = useRouter();

  return (
    <main>
      <Scanner
        onScan={(barcode) => router.push(`/product/${barcode}`)}
        onClose={() => router.back()}
      />
    </main>
  );
}

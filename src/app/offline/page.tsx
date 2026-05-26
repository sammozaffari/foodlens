import { Heading2, Body } from '@/components/atoms';

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-md">
        <Heading2>You&apos;re offline</Heading2>
        <Body className="text-text-muted">FoodLens needs an internet connection to look up products. Check your connection and try again.</Body>
      </div>
    </main>
  );
}

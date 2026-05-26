export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-bold">You're offline</h1>
        <p className="text-text-muted">FoodLens needs an internet connection to look up products. Check your connection and try again.</p>
      </div>
    </main>
  );
}

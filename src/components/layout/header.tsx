import { Leaf } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="py-4 px-6 shadow-md bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Leaf className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-semibold">
            CalSnap
          </h1>
        </Link>
        {/* Navigation links can be added here if needed */}
      </div>
    </header>
  );
}

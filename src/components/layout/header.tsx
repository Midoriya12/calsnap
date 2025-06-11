
import { Leaf, Archive } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
        <nav>
          <Button asChild variant="ghost">
            <Link href="/saved-meals" className="flex items-center gap-2 text-foreground hover:text-primary">
              <Archive className="h-5 w-5" />
              Saved Meals
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}


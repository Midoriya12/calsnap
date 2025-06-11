
'use client';

import { AppHeader } from '@/components/layout/header';
import { RecipeCatalog } from '@/components/features/recipe-catalog';
import { Utensils } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function RecipesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/recipes');
      } else {
        setIsLoadingPage(false);
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || isLoadingPage) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
     return (
       <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
           <p className="ml-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        <section id="recipe-catalog" aria-labelledby="recipe-catalog-heading">
          <div className="text-center mb-8">
            <h1 id="recipe-catalog-heading" className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
              <Utensils className="h-8 w-8" /> Recipe Catalog
            </h1>
            <p className="text-muted-foreground mt-2">Explore delicious recipes or get inspired for your next meal.</p>
          </div>
          <RecipeCatalog />
        </section>
        <footer className="text-center text-muted-foreground text-sm py-8 border-t mt-auto">
          <p>&copy; {new Date().getFullYear()} CalSnap. Your friendly meal companion.</p>
        </footer>
      </main>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMealStorage } from '@/hooks/use-meal-storage';
import { SavedMealCard } from '@/components/features/saved-meal-card';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/header';
import { AlertCircle, Archive, ChevronLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';

export default function SavedMealsPage() {
  const { user } = useAuth(); // AuthProvider handles initial auth loading state
  const router = useRouter();
  const { savedMeals, deleteMeal, isLocalStorageReady } = useMealStorage();
  const [isLoadingPageData, setIsLoadingPageData] = useState(true); // For loading meal data specifically

  useEffect(() => {
    // AuthProvider handles initial auth state determination.
    // This effect redirects if user is not logged in after AuthProvider is done.
    if (user === null) { // user is explicitly null, meaning auth check is done and no user
      router.push('/login?redirect=/saved-meals');
    } else if (user) { // user exists
      // User is authenticated, proceed to load meal data logic
      if (isLocalStorageReady) {
        setIsLoadingPageData(false);
      }
    }
    // If user is undefined, it means AuthProvider is still determining state.
    // AuthProvider shows a global loader, so this page doesn't need to show another one for auth.
  }, [user, router, isLocalStorageReady]);

  // Secondary effect to handle isLocalStorageReady changing after auth is confirmed and user exists
  useEffect(() => {
    if (user && isLocalStorageReady) {
        setIsLoadingPageData(false);
    }
  }, [user, isLocalStorageReady]);


  const handleDeleteMeal = (mealId: string) => {
    deleteMeal(mealId);
    // Optionally add a toast notification here
  };

  // If user is null, it means the useEffect for redirection should handle it.
  // Show a loader to prevent flash of content before redirect.
  // AuthProvider handles the very initial full-page load.
  if (user === null) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  // If user is undefined, AuthProvider is still loading.
  // This case should ideally be covered by AuthProvider's loader not rendering children.
  // However, to be safe, if we reach here and user is still undefined, show loader.
  if (user === undefined) {
     return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // At this point, user should be authenticated (user object exists)
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Archive className="h-8 w-8" />
            My Saved Meals
          </h1>
          <Button asChild variant="outline">
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>

        <Separator className="mb-8" />

        {isLoadingPageData && (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your saved meals...</p>
          </div>
        )}

        {!isLoadingPageData && savedMeals.length === 0 && (
          <div className="text-center py-10">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Saved Meals Yet</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t saved any meal analyses.
              <br />
              Go ahead and analyze a meal, then click &quot;Save Meal&quot; to see it here!
            </p>
            <Button asChild>
              <Link href="/">Analyze a New Meal</Link>
            </Button>
          </div>
        )}

        {!isLoadingPageData && savedMeals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedMeals.map((meal) => (
              <SavedMealCard
                key={meal.id}
                meal={meal}
                onDelete={handleDeleteMeal}
              />
            ))}
          </div>
        )}
      </main>
      <footer className="text-center text-muted-foreground text-sm py-8 border-t mt-8">
          <p>&copy; {new Date().getFullYear()} CalSnap. Your meal companion.</p>
      </footer>
    </div>
  );
}

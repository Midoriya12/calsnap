
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMealStorage } from '@/hooks/use-meal-storage';
import { SavedMealCard } from '@/components/features/saved-meal-card';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/header';
import { AlertCircle, Archive, ChevronLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function SavedMealsPage() {
  const { savedMeals, deleteMeal, isLocalStorageReady } = useMealStorage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLocalStorageReady) {
      setIsLoading(false);
    }
  }, [isLocalStorageReady]);

  const handleDeleteMeal = (mealId: string) => {
    deleteMeal(mealId);
    // Optionally add a toast notification here
  };

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

        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your saved meals...</p>
          </div>
        )}

        {!isLoading && savedMeals.length === 0 && (
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

        {!isLoading && savedMeals.length > 0 && (
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

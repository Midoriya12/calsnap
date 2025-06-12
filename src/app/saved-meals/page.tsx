
'use client';

import { useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';

export default function SavedMealsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { 
    savedMeals, 
    deleteMeal, 
    isLoading: mealsLoading, 
    error: mealsError,
    getSavedMeals // Exposing this for manual refresh if ever needed
  } = useMealStorage();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/saved-meals');
    }
  }, [user, authLoading, router]);

  // Optionally, show a toast if there's an error loading meals
  useEffect(() => {
    if (mealsError) {
      toast({
        title: "Error Loading Meals",
        description: mealsError,
        variant: "destructive",
      });
    }
  }, [mealsError, toast]);

  const handleDeleteMeal = async (mealId: string) => {
    const success = await deleteMeal(mealId);
    if (success) {
      toast({
        title: 'Meal Deleted',
        description: 'The meal has been removed from your saved list.',
      });
    } else {
      toast({
        title: 'Delete Failed',
        description: 'Could not delete the meal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || (!user && !authLoading)) { // Show loader if auth is loading or redirect is imminent
    return (
      <div className="flex flex-col flex-grow"> {/* Adjusted */}
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col flex-grow"> {/* Adjusted */}
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

        {mealsLoading && (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your saved meals from the cloud...</p>
          </div>
        )}

        {!mealsLoading && !mealsError && savedMeals.length === 0 && (
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

        {!mealsLoading && !mealsError && savedMeals.length > 0 && (
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

         {!mealsLoading && mealsError && (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Could Not Load Meals</AlertTitle>
              <AlertDescription>
                There was an issue fetching your saved meals from the cloud. Please try again later.
                <br />
                Error: {mealsError}
              </AlertDescription>
            </Alert>
        )}
      </main>
      <footer className="text-center text-muted-foreground text-sm py-8 border-t mt-8">
          <p>&copy; {new Date().getFullYear()} CalSnap. Your meal companion.</p>
      </footer>
    </div>
  );
}

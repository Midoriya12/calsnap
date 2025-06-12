
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format, parse } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';
import { useDailyLog } from '@/hooks/use-daily-log';
import { AppHeader } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { LogMealForm } from '@/components/features/log-meal-form';
import { Loader2, CalendarIcon, PlusCircle, Trash2, AlertCircle, Utensils, Zap, Leaf, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { DailyTotals, LoggedMeal } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function DailyLogPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {
    loggedMeals,
    isLoading: logLoading,
    error: logError,
    getLoggedMealsForDate,
    addLoggedMeal,
    deleteLoggedMeal,
  } = useDailyLog();

  const [isLogMealFormOpen, setIsLogMealFormOpen] = useState(false);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/daily-log');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && selectedDate) {
      getLoggedMealsForDate(selectedDate);
    }
  }, [user, selectedDate, getLoggedMealsForDate]);

  const dailyTotals: DailyTotals = useMemo(() => {
    return loggedMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories || 0;
        acc.protein += meal.protein || 0;
        acc.fat += meal.fat || 0;
        acc.carbs += meal.carbs || 0;
        acc.fiber += meal.fiber || 0;
        return acc;
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
    );
  }, [loggedMeals]);

  const handleDeleteMeal = async (mealId: string) => {
    const success = await deleteLoggedMeal(mealId, selectedDate);
    if (success) {
      toast({ title: 'Meal Removed', description: 'The meal has been removed from your log for this day.' });
      // Data re-fetches inside deleteLoggedMeal hook after successful deletion
    } else {
      toast({ title: 'Delete Failed', description: 'Could not remove the meal. Please try again.', variant: 'destructive' });
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');

  if (authLoading || (!user && !authLoading)) {
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
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Utensils className="h-8 w-8" /> Daily Nutrition Log
          </h1>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
            <Button onClick={() => setIsLogMealFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Meal Manually
            </Button>
          </div>
        </div>

        <Separator className="mb-8" />

        {logLoading && (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your meal log for {format(selectedDate, 'PPP')}...</p>
          </div>
        )}
        
        {!logLoading && logError && (
           <Alert variant="destructive" className="my-4">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Error Loading Log</AlertTitle>
            <AlertDescription>
                Could not load meal data for this day. Error: {logError}
            </AlertDescription>
          </Alert>
        )}

        {!logLoading && !logError && (
          <>
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Daily Totals for {format(selectedDate, 'PPP')}</CardTitle>
                <CardDescription>Summary of your logged intake for the selected day.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Calories', value: dailyTotals.calories.toFixed(0), unit: 'kcal', icon: Zap, color: 'text-orange-500' },
                  { label: 'Protein', value: dailyTotals.protein.toFixed(1), unit: 'g', icon: Leaf, color: 'text-green-500' },
                  { label: 'Fat', value: dailyTotals.fat.toFixed(1), unit: 'g', icon: Leaf, color: 'text-yellow-500' },
                  { label: 'Carbs', value: dailyTotals.carbs.toFixed(1), unit: 'g', icon: Leaf, color: 'text-blue-500' },
                  { label: 'Fiber', value: dailyTotals.fiber.toFixed(1), unit: 'g', icon: Leaf, color: 'text-purple-500' },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                    <item.icon className={`h-8 w-8 mb-2 ${item.color}`} />
                    <span className="text-2xl font-bold text-foreground">{item.value}</span>
                    <span className="text-sm text-muted-foreground">{item.unit} {item.label}</span>
                  </div>
                ))}
              </CardContent>
              {/* Optional: Progress bars for goals can be added here later */}
            </Card>

            <h2 className="text-2xl font-semibold text-primary mb-6">Logged Meals</h2>
            {loggedMeals.length === 0 ? (
              <div className="text-center py-10 bg-card rounded-lg shadow-md border border-dashed">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Meals Logged for this Day</h3>
                <p className="text-muted-foreground">
                  Use the button above to add meals to your log.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {loggedMeals.map((meal) => (
                  <Card key={meal.id} className="shadow-md">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{meal.mealName}</CardTitle>
                          <CardDescription>Source: {meal.source} | Logged: {new Date(meal.createdAt).toLocaleTimeString()}</CardDescription>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Logged Meal?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove "{meal.mealName}" from your log for this day? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteMeal(meal.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2 text-sm">
                      <div><strong>Calories:</strong> {meal.calories.toFixed(0)} kcal</div>
                      {meal.protein !== undefined && <div><strong>Protein:</strong> {meal.protein.toFixed(1)} g</div>}
                      {meal.fat !== undefined && <div><strong>Fat:</strong> {meal.fat.toFixed(1)} g</div>}
                      {meal.carbs !== undefined && <div><strong>Carbs:</strong> {meal.carbs.toFixed(1)} g</div>}
                      {meal.fiber !== undefined && <div><strong>Fiber:</strong> {meal.fiber.toFixed(1)} g</div>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <LogMealForm
        isOpen={isLogMealFormOpen}
        setIsOpen={setIsLogMealFormOpen}
        onMealLogged={() => getLoggedMealsForDate(selectedDate)}
        dateToLog={formattedSelectedDate}
        addLoggedMealAction={addLoggedMeal}
        initialData={{ source: 'Manual Entry' }}
      />
      <footer className="text-center text-muted-foreground text-sm py-8 border-t mt-8">
        <p>&copy; {new Date().getFullYear()} CalSnap. Your meal companion.</p>
      </footer>
    </div>
  );
}

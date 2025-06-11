
'use client';

import Image from 'next/image';
import type { SavedMeal } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, CalendarDays, Utensils } from 'lucide-react';
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

interface SavedMealCardProps {
  meal: SavedMeal;
  onDelete: (mealId: string) => void;
}

export function SavedMealCard({ meal, onDelete }: SavedMealCardProps) {
  const savedDate = new Date(meal.savedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const savedTime = new Date(meal.savedAt).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="flex flex-col h-full shadow-lg overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={meal.uploadedImagePreview}
            alt={meal.aiEstimation.dishName || 'Saved meal'}
            layout="fill"
            objectFit="cover"
            className="bg-muted"
            data-ai-hint="food meal"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 text-primary">
          {meal.aiEstimation.dishName || 'Unnamed Meal'}
        </CardTitle>
        <div className="text-xs text-muted-foreground space-y-1 mt-2">
            <div className="flex items-center gap-1.5">
                <Utensils size={14} />
                <span>Estimated Calories: {meal.aiEstimation.estimatedCalories} kcal</span>
            </div>
            <div className="flex items-center gap-1.5">
                <CalendarDays size={14} />
                <span>Saved: {savedDate} at {savedTime}</span>
            </div>
        </div>
        
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Meal
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this saved meal analysis.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(meal.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

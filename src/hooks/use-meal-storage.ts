
'use client';

import type { SavedMeal } from '@/types';
import { useState, useEffect, useCallback } from 'react';

const MEALS_STORAGE_KEY = 'calSnapSavedMeals';

export function useMealStorage() {
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [isLocalStorageReady, setIsLocalStorageReady] = useState(false);

  useEffect(() => {
    // Ensure localStorage is accessed only on the client side
    setIsLocalStorageReady(true);
    if (typeof window !== 'undefined') {
      try {
        const storedMeals = localStorage.getItem(MEALS_STORAGE_KEY);
        if (storedMeals) {
          setSavedMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error("Error reading saved meals from localStorage:", error);
        // Optionally clear corrupted data or handle error
        // localStorage.removeItem(MEALS_STORAGE_KEY);
      }
    }
  }, []);

  const saveMeal = useCallback((newMeal: Omit<SavedMeal, 'id' | 'savedAt'>) => {
    if (!isLocalStorageReady) return false;
    try {
      const mealWithTimestamp: SavedMeal = {
        ...newMeal,
        id: new Date().toISOString() + '-' + Math.random().toString(36).substring(2, 9), // Simple unique enough ID
        savedAt: new Date().toISOString(),
      };
      const updatedMeals = [...savedMeals, mealWithTimestamp];
      localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(updatedMeals));
      setSavedMeals(updatedMeals);
      return true;
    } catch (error) {
      console.error("Error saving meal to localStorage:", error);
      return false;
    }
  }, [savedMeals, isLocalStorageReady]);

  const getSavedMeals = useCallback((): SavedMeal[] => {
    if (!isLocalStorageReady) return [];
    try {
      const storedMeals = localStorage.getItem(MEALS_STORAGE_KEY);
      return storedMeals ? JSON.parse(storedMeals) : [];
    } catch (error) {
      console.error("Error retrieving saved meals from localStorage:", error);
      return [];
    }
  }, [isLocalStorageReady]);
  
  // Placeholder for delete functionality if needed later
  const deleteMeal = useCallback((mealId: string) => {
    if (!isLocalStorageReady) return false;
    try {
      const updatedMeals = savedMeals.filter(meal => meal.id !== mealId);
      localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(updatedMeals));
      setSavedMeals(updatedMeals);
      return true;
    } catch (error) {
      console.error("Error deleting meal from localStorage:", error);
      return false;
    }
  }, [savedMeals, isLocalStorageReady]);


  return { saveMeal, getSavedMeals, savedMeals, deleteMeal, isLocalStorageReady };
}

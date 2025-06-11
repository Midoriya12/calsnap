
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
        // localStorage.removeItem(MEALS_STORAGE_KEY);
      }
    }
  }, []);

  const saveMeal = useCallback((newMeal: Omit<SavedMeal, 'id' | 'savedAt'>) => {
    if (!isLocalStorageReady) return false;
    try {
      const mealWithTimestamp: SavedMeal = {
        ...newMeal,
        id: new Date().toISOString() + '-' + Math.random().toString(36).substring(2, 9),
        savedAt: new Date().toISOString(),
      };
      // Prepend new meal to the list
      const updatedMeals = [mealWithTimestamp, ...savedMeals];
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
      const meals = storedMeals ? JSON.parse(storedMeals) : [];
      // Ensure meals are sorted by savedAt descending (newest first)
      return meals.sort((a: SavedMeal, b: SavedMeal) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    } catch (error) {
      console.error("Error retrieving saved meals from localStorage:", error);
      return [];
    }
  }, [isLocalStorageReady]);
  
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

  // Update savedMeals state when getSavedMeals is called and localStorage might have changed elsewhere
  useEffect(() => {
    if (isLocalStorageReady) {
        const currentMealsFromStorage = getSavedMeals();
        // Simple check to see if arrays are different based on length or first/last ID
        // More sophisticated checks might be needed for complex scenarios
        if (currentMealsFromStorage.length !== savedMeals.length || 
            (currentMealsFromStorage.length > 0 && savedMeals.length > 0 && currentMealsFromStorage[0].id !== savedMeals[0].id)) {
            setSavedMeals(currentMealsFromStorage);
        }
    }
  }, [isLocalStorageReady, getSavedMeals]);


  return { saveMeal, getSavedMeals, savedMeals, deleteMeal, isLocalStorageReady };
}


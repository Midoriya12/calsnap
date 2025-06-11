
'use client';

import type { SavedMeal, NewSavedMealData } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';

export function useMealStorage() {
  const { user } = useAuth();
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSavedMeals = useCallback(async () => {
    if (!user) {
      setSavedMeals([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const mealsCollectionRef = collection(db, `users/${user.uid}/savedMeals`);
      const q = query(mealsCollectionRef, orderBy('savedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const meals = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure savedAt is a string if it's a Firestore Timestamp
          savedAt: data.savedAt instanceof Timestamp ? data.savedAt.toDate().toISOString() : data.savedAt,
        } as SavedMeal;
      });
      setSavedMeals(meals);
    } catch (err) {
      console.error("Error fetching saved meals from Firestore:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch saved meals.");
      setSavedMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Fetch meals when user changes (e.g., on login/logout) or component mounts with a user
    if (user) {
      getSavedMeals();
    } else {
      setSavedMeals([]); // Clear meals if user logs out
    }
  }, [user, getSavedMeals]);

  const saveMeal = async (newMealData: Omit<NewSavedMealData, 'userId' | 'savedAt'>) => {
    if (!user) {
      setError("User not authenticated. Cannot save meal.");
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const mealToSave: NewSavedMealData = {
        ...newMealData,
        userId: user.uid,
        savedAt: new Date().toISOString(), // Or use serverTimestamp()
      };
      const mealsCollectionRef = collection(db, `users/${user.uid}/savedMeals`);
      // @ts-ignore
      const docRef = await addDoc(mealsCollectionRef, {
        ...mealToSave,
        savedAt: serverTimestamp() // Use server timestamp for consistency
      });
      
      // Optimistically add to local state or refetch
      // For simplicity, we'll refetch, but optimistic updates are better for UX
      await getSavedMeals(); 
      return docRef.id;

    } catch (err) {
      console.error("Error saving meal to Firestore:", err);
      setError(err instanceof Error ? err.message : "Failed to save meal.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    if (!user) {
      setError("User not authenticated. Cannot delete meal.");
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const mealDocRef = doc(db, `users/${user.uid}/savedMeals`, mealId);
      await deleteDoc(mealDocRef);
      // Optimistically remove from local state or refetch
      setSavedMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
      return true;
    } catch (err) {
      console.error("Error deleting meal from Firestore:", err);
      setError(err instanceof Error ? err.message : "Failed to delete meal.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    saveMeal, 
    getSavedMeals, // Expose for manual refresh if needed
    savedMeals, 
    deleteMeal, 
    isLoading, 
    error 
  };
}

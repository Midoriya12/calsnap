
'use client';

import type { LoggedMeal, NewLoggedMealData } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { format } from 'date-fns';

export function useDailyLog() {
  const { user } = useAuth();
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLoggedMealsForDate = useCallback(
    async (date: Date) => {
      if (!user) {
        setLoggedMeals([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      const formattedDate = format(date, 'yyyy-MM-dd');
      try {
        const logCollectionRef = collection(db, `users/${user.uid}/loggedMeals`);
        const q = query(
          logCollectionRef,
          where('dateLogged', '==', formattedDate),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const meals = querySnapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
          } as LoggedMeal;
        });
        setLoggedMeals(meals);
      } catch (err) {
        console.error('Error fetching logged meals from Firestore:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch logged meals.');
        setLoggedMeals([]);
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const addLoggedMeal = async (newMealData: NewLoggedMealData) => {
    if (!user) {
      setError('User not authenticated. Cannot log meal.');
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const logCollectionRef = collection(db, `users/${user.uid}/loggedMeals`);
      const mealToSave = {
        ...newMealData,
        userId: user.uid, // ensure userId is set server-side or via context
        // @ts-ignore
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(logCollectionRef, mealToSave);
      // Refetch meals for the date the meal was logged to update UI
      // Or, optimistically add to local state if newMealData.dateLogged is today's viewed date
      // For simplicity, caller can refetch.
      return docRef.id;
    } catch (err) {
      console.error('Error saving logged meal to Firestore:', err);
      setError(err instanceof Error ? err.message : 'Failed to log meal.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLoggedMeal = async (mealId: string, mealDate: Date) => {
    if (!user) {
      setError('User not authenticated. Cannot delete meal.');
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const mealDocRef = doc(db, `users/${user.uid}/loggedMeals`, mealId);
      await deleteDoc(mealDocRef);
      // Refetch meals for the date to update UI
      await getLoggedMealsForDate(mealDate);
      return true;
    } catch (err) {
      console.error('Error deleting logged meal from Firestore:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete logged meal.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loggedMeals,
    isLoading,
    error,
    getLoggedMealsForDate,
    addLoggedMeal,
    deleteLoggedMeal,
  };
}

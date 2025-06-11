
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import type { NewLoggedMealData } from '@/types';

const logMealSchema = z.object({
  mealName: z.string().min(1, { message: 'Meal name is required' }),
  calories: z.coerce.number().min(0, { message: 'Calories must be positive' }),
  protein: z.coerce.number().min(0).optional(),
  fat: z.coerce.number().min(0).optional(),
  carbs: z.coerce.number().min(0).optional(),
  fiber: z.coerce.number().min(0).optional(),
});

type LogMealFormInputs = z.infer<typeof logMealSchema>;

interface LogMealFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onMealLogged: () => void; // Callback to refresh data on parent page
  dateToLog: string; // YYYY-MM-DD
  addLoggedMealAction: (mealData: NewLoggedMealData) => Promise<string | null>;
  initialData?: Partial<LogMealFormInputs & { source: 'AI Estimation' | 'Manual Entry' }>;
}

export function LogMealForm({
  isOpen,
  setIsOpen,
  onMealLogged,
  dateToLog,
  addLoggedMealAction,
  initialData,
}: LogMealFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogMealFormInputs>({
    resolver: zodResolver(logMealSchema),
    defaultValues: {
      mealName: initialData?.mealName || '',
      calories: initialData?.calories || 0,
      protein: initialData?.protein || undefined,
      fat: initialData?.fat || undefined,
      carbs: initialData?.carbs || undefined,
      fiber: initialData?.fiber || undefined,
    },
  });

  // Effect to reset form when initialData changes (e.g. opening dialog for different AI meal)
  React.useEffect(() => {
    reset({
      mealName: initialData?.mealName || '',
      calories: initialData?.calories || 0,
      protein: initialData?.protein || undefined,
      fat: initialData?.fat || undefined,
      carbs: initialData?.carbs || undefined,
      fiber: initialData?.fiber || undefined,
    });
  }, [initialData, reset]);


  const onSubmit: SubmitHandler<LogMealFormInputs> = async (data) => {
    setIsSubmitting(true);
    const mealDataToSave: NewLoggedMealData = {
      ...data,
      dateLogged: dateToLog,
      source: initialData?.source || 'Manual Entry',
    };

    const result = await addLoggedMealAction(mealDataToSave);

    if (result) {
      toast({ title: 'Meal Logged', description: `${data.mealName} has been added to your daily log.` });
      onMealLogged(); // Refresh parent
      setIsOpen(false); // Close dialog
      reset(); // Reset form for next time
    } else {
      toast({
        title: 'Log Failed',
        description: 'Could not log the meal. Please try again.',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Log Meal for {dateToLog}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="mealName">Meal Name</Label>
            <Input id="mealName" {...register('mealName')} />
            {errors.mealName && <p className="text-sm text-destructive mt-1">{errors.mealName.message}</p>}
          </div>
          <div>
            <Label htmlFor="calories">Calories (kcal)</Label>
            <Input id="calories" type="number" {...register('calories')} />
            {errors.calories && <p className="text-sm text-destructive mt-1">{errors.calories.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input id="protein" type="number" step="0.1" {...register('protein')} placeholder="Optional"/>
              {errors.protein && <p className="text-sm text-destructive mt-1">{errors.protein.message}</p>}
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input id="fat" type="number" step="0.1" {...register('fat')} placeholder="Optional"/>
              {errors.fat && <p className="text-sm text-destructive mt-1">{errors.fat.message}</p>}
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input id="carbs" type="number" step="0.1" {...register('carbs')} placeholder="Optional"/>
              {errors.carbs && <p className="text-sm text-destructive mt-1">{errors.carbs.message}</p>}
            </div>
            <div>
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input id="fiber" type="number" step="0.1" {...register('fiber')} placeholder="Optional"/>
              {errors.fiber && <p className="text-sm text-destructive mt-1">{errors.fiber.message}</p>}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <PlusCircle />}
              Log Meal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

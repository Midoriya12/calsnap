
import { mockRecipes } from '@/lib/mock-data';
import type { Recipe } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Flame, Utensils, ListChecks, ChevronLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

async function getRecipe(id: string): Promise<Recipe | null> {
  // In a real app, you'd fetch this from your API or database
  // await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  const recipe = mockRecipes.find(recipe => recipe.id === id);
  return recipe || null;
}

export default async function RecipeDetailsPage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-screen">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Recipe Not Found</AlertTitle>
          <AlertDescription>
            The recipe you are looking for does not exist or may have been removed.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Catalog
          </Link>
        </Button>
      </div>
    );
  }

  // Generate a more specific AI hint from the recipe name
  const aiHint = recipe.name.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-4 px-6 shadow-md bg-card sticky top-0 z-50">
        <div className="container mx-auto">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Recipe Catalog
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <Card className="w-full shadow-lg">
          <CardHeader className="p-0">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                data-ai-hint={aiHint} // Use more specific hint
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{recipe.name}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">{recipe.description}</CardDescription>

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Clock size={20} className="text-accent mb-1" />
                <span className="font-semibold">Prep Time</span>
                <span>{recipe.preparationTime}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Users size={20} className="text-accent mb-1" />
                <span className="font-semibold">Servings</span>
                <span>{recipe.servings}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Utensils size={20} className="text-accent mb-1" />
                <span className="font-semibold">Cuisine</span>
                <span>{recipe.cuisine}</span>
              </div>
              {recipe.calories && (
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                  <Flame size={20} className="text-accent mb-1" />
                  <span className="font-semibold">Calories</span>
                  <span>{recipe.calories} kcal</span>
                </div>
              )}
            </div>

            {recipe.dietaryRestrictions.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Dietary Information</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.dietaryRestrictions.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
                <ListChecks /> Ingredients
              </h3>
              <ul className="list-disc list-inside space-y-1 pl-4 text-foreground/90">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
                <ListChecks /> Instructions
              </h3>
              <ol className="list-decimal list-inside space-y-2 pl-4 text-foreground/90">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </CardContent>
          <CardFooter className="p-6">
             <Button asChild variant="default" className="w-full md:w-auto">
                <Link href="/">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Return to Catalog
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="text-center text-muted-foreground text-sm py-8 mt-8 border-t">
        <p>&copy; {new Date().getFullYear()} CalSnap. Your friendly meal companion.</p>
      </footer>
    </div>
  );
}

// Optional: Add metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }
  return {
    title: `${recipe.name} | CalSnap Recipe`,
    description: recipe.description,
  };
}

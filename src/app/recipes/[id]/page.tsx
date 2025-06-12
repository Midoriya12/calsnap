
import type { Recipe } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Flame, Utensils, ListChecks, ChevronLeft, AlertCircle, Eye, Bookmark, Youtube, Link as LinkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppHeader } from '@/components/layout/header'; // Import AppHeader

async function getRecipe(id: string): Promise<Recipe | null> {
  const fetchUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/recipes?id=${id}`;
  try {
    const response = await fetch(fetchUrl, { cache: 'no-store' }); 
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Recipe with ID ${id} not found (404) when fetching from ${fetchUrl}`);
        return null; 
      }
      // For other errors, try to get more info, but don't assume JSON
      const errorText = await response.text();
      console.error(`Failed to fetch recipe ${id}. Status: ${response.status}. URL: ${fetchUrl}. Response Body: ${errorText.substring(0, 500)}`);
      return null;
    }
    const recipe: Recipe = await response.json();
    return recipe;
  } catch (error: any) {
    // This block catches network errors (e.g., "fetch failed") or errors during response.json()
    let errorMessage = `Error fetching recipe by ID ${id} from URL: ${fetchUrl}.`;
    if (error instanceof Error) {
      errorMessage += ` Message: ${error.message}.`;
      if (error.cause) {
        // @ts-ignore
        errorMessage += ` Cause: ${typeof error.cause === 'string' ? error.cause : JSON.stringify(error.cause)}.`;
      }
    } else {
      errorMessage += ` Unexpected error object: ${String(error)}`;
    }
    console.error(errorMessage, error.stack ? `\nStack: ${error.stack}`: '');
    return null; 
  }
}

export default async function RecipeDetailsPage({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);

  if (!recipe) {
    return (
      <div className="flex flex-col flex-grow">
        <AppHeader />
        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
          <Alert variant="destructive" className="w-full max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Recipe Not Found or Error Loading</AlertTitle>
            <AlertDescription>
              The recipe you are looking for (ID: {params.id}) could not be loaded. It might not exist, or there was an issue fetching its details. Please check the console logs for more information or try again later.
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/recipes">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Recipe Catalog
            </Link>
          </Button>
        </main>
        <footer className="text-center text-muted-foreground text-sm py-8 mt-auto border-t">
          <p>&copy; {new Date().getFullYear()} CalSnap. Your friendly meal companion.</p>
        </footer>
      </div>
    );
  }

  const aiHint = recipe.name.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <div className="flex flex-col flex-grow text-foreground">
      <AppHeader /> {/* Use AppHeader here */}
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
            <Button asChild variant="outline" size="sm">
                <Link href="/recipes">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Recipe Catalog
                </Link>
            </Button>
        </div>
        <Card className="w-full shadow-lg">
          <CardHeader className="p-0">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={recipe.imageUrl || 'https://placehold.co/600x400.png'}
                alt={recipe.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                data-ai-hint={aiHint}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{recipe.name}</CardTitle>
            {recipe.description && (
                <CardDescription className="text-lg text-muted-foreground">{recipe.description}</CardDescription>
            )}

            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Clock size={20} className="text-accent mb-1" />
                <span className="font-semibold">Prep Time</span>
                <span>{recipe.preparationTime || 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Users size={20} className="text-accent mb-1" />
                <span className="font-semibold">Servings</span>
                <span>{recipe.servings || 'N/A'}</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                <Utensils size={20} className="text-accent mb-1" />
                <span className="font-semibold">Cuisine</span>
                <span>{recipe.cuisine || 'N/A'}</span>
              </div>
              {recipe.calories != null && ( // Check for null or undefined explicitly
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                  <Flame size={20} className="text-accent mb-1" />
                  <span className="font-semibold">Calories</span>
                  <span>{recipe.calories} kcal</span>
                </div>
              )}
               {typeof recipe.viewCount === 'number' && (
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                  <Eye size={20} className="text-accent mb-1" />
                  <span className="font-semibold">Views</span>
                  <span>{recipe.viewCount.toLocaleString()}</span>
                </div>
              )}
              {typeof recipe.saveCount === 'number' && (
                <div className="flex flex-col items-center p-3 bg-muted/50 rounded-md">
                  <Bookmark size={20} className="text-accent mb-1" />
                  <span className="font-semibold">Saves</span>
                  <span>{recipe.saveCount.toLocaleString()}</span>
                </div>
              )}
            </div>

            {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
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
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-4 text-foreground/90">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No ingredients listed.</p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-primary">
                <ListChecks /> Instructions
              </h3>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                <ol className="list-decimal list-inside space-y-2 pl-4 text-foreground/90">
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No instructions provided.</p>
              )}
            </div>

            {(recipe.youtubeUrl || recipe.sourceUrl) && <Separator />}

            <div className="space-y-3">
              {recipe.youtubeUrl && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
                    <Youtube /> Watch Video
                  </h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href={recipe.youtubeUrl} target="_blank" rel="noopener noreferrer">
                      View on YouTube
                    </Link>
                  </Button>
                </div>
              )}
              {recipe.sourceUrl && (
                 <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-primary">
                    <LinkIcon /> Original Source
                  </h3>
                  <Button asChild variant="outline" size="sm">
                    <Link href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                      View Original Recipe
                    </Link>
                  </Button>
                </div>
              )}
            </div>

          </CardContent>
          <CardFooter className="p-6">
             <Button asChild variant="default" className="w-full md:w-auto">
                <Link href="/recipes">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Return to Catalog
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <footer className="text-center text-muted-foreground text-sm py-8 mt-auto border-t">
        <p>&copy; {new Date().getFullYear()} CalSnap. Your friendly meal companion.</p>
      </footer>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const recipe = await getRecipe(params.id);
  if (!recipe) {
    return {
      title: 'Recipe Not Found | CalSnap',
      description: 'The recipe you are looking for could not be found.',
    };
  }
  return {
    title: `${recipe.name} | CalSnap Recipe`,
    description: recipe.description || `View the recipe for ${recipe.name} on CalSnap.`,
  };
}

    
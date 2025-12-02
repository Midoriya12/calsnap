import { MetadataRoute } from 'next';

/**
 * Dynamic sitemap generation for CalSnap
 * This file generates sitemap.xml automatically
 *
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://calsnap.app';

  // Static routes (always include)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // TODO: Add dynamic recipe pages when ready
  // Fetch popular recipes and add them to sitemap
  // const recipes = await fetchPopularRecipes();
  // const recipePages = recipes.map((recipe) => ({
  //   url: `${baseUrl}/recipes/${recipe.id}`,
  //   lastModified: recipe.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }));

  return [
    ...staticRoutes,
    // ...recipePages, // Uncomment when ready
  ];
}

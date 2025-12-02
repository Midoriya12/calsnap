import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipe Catalog',
  description:
    'Discover thousands of delicious recipes. Search by ingredients, cuisine, or dietary restrictions. Get step-by-step cooking instructions and video tutorials.',
  openGraph: {
    title: 'Recipe Catalog | CalSnap',
    description:
      'Discover thousands of delicious recipes with CalSnap. Search by ingredients, cuisine, or dietary restrictions.',
  },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

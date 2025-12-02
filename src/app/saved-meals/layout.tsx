import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Meals',
  description:
    'View your collection of saved meals. Access AI-analyzed meals with complete nutritional information and recipes.',
  openGraph: {
    title: 'Saved Meals | CalSnap',
    description: 'Your personal collection of saved meals and nutritional analyses.',
  },
  robots: {
    index: false, // Don't index user-specific pages
    follow: true,
  },
};

export default function SavedMealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

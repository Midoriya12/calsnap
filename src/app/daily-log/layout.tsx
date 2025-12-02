import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Nutrition Log',
  description:
    'Track your daily nutrition intake. Monitor calories, protein, fat, carbs, and fiber. View your meal history and nutritional trends.',
  openGraph: {
    title: 'Daily Nutrition Log | CalSnap',
    description:
      'Track your daily nutrition with CalSnap. Monitor macros and view your meal history.',
  },
  robots: {
    index: false, // Don't index user-specific pages
    follow: true,
  },
};

export default function DailyLogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

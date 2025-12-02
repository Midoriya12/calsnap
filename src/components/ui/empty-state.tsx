import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  /**
   * Icon to display (Lucide React icon component)
   */
  icon: LucideIcon;

  /**
   * Main heading text
   */
  title: string;

  /**
   * Description text
   */
  description: string;

  /**
   * Optional primary action button
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  };

  /**
   * Optional secondary action button
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };

  /**
   * Optional illustration or custom content
   */
  illustration?: React.ReactNode;

  /**
   * Variant for different layouts
   */
  variant?: 'default' | 'minimal' | 'card';
}

/**
 * Empty State Component
 *
 * A reusable component for displaying empty states across the application.
 * Use this when a list, search, or collection has no items.
 *
 * @example
 * <EmptyState
 *   icon={PackageOpen}
 *   title="No saved meals yet"
 *   description="Start by analyzing a meal photo to build your collection"
 *   action={{
 *     label: "Analyze meal",
 *     onClick: () => router.push('/')
 *   }}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  variant = 'default',
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-12 px-4">
      {/* Icon or Illustration */}
      {illustration || (
        <div className="rounded-full bg-muted p-6">
          <Icon className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}

      {/* Text Content */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size="default"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="default"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'card') {
    return <Card className="w-full">{content}</Card>;
  }

  if (variant === 'minimal') {
    return <div className="w-full max-w-lg mx-auto">{content}</div>;
  }

  return <div className="w-full">{content}</div>;
}

/**
 * Empty Search Results Component
 * Pre-configured empty state for search results
 */
export function EmptySearchResults({
  searchTerm,
  onClear,
}: {
  searchTerm: string;
  onClear: () => void;
}) {
  return (
    <EmptyState
      icon={({ className }) => (
        <svg
          className={className}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      )}
      title={`No results for "${searchTerm}"`}
      description="Try adjusting your search terms or filters"
      action={{
        label: 'Clear search',
        onClick: onClear,
        variant: 'outline',
      }}
      variant="minimal"
    />
  );
}

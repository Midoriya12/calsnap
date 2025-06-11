import { Card, CardContent } from "@/components/ui/card";

interface AdPlaceholderProps {
  className?: string;
}

export function AdPlaceholder({ className }: AdPlaceholderProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4 flex items-center justify-center h-32">
        <p className="text-muted-foreground text-sm">Advertisement</p>
      </CardContent>
    </Card>
  );
}


import { SignupForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8">
        <Leaf className="h-10 w-10" />
        <h1 className="text-4xl font-headline font-semibold">
            CalSnap
        </h1>
      </Link>
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join CalSnap to start analyzing your meals.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}

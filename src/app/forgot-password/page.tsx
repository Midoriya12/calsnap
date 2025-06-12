
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Leaf, Mail, Loader2, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!email) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).");
      toast({ title: "Password Reset Email Sent", description: "Check your email for instructions." });
      setEmail(''); // Clear email field after successful submission
    } catch (error: any) {
      console.error("Password reset error:", error);
      // Firebase often throws specific errors like 'auth/user-not-found'
      // but for security, it's common to give a generic message.
      setMessage("If an account exists for this email, a password reset link has been sent. Please check your inbox (and spam folder).");
      // Optionally, you can give more specific feedback for certain errors if desired,
      // but it might reveal if an email is registered or not.
      // toast({ title: "Error Sending Reset Email", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Enter your email address and we&apos;ll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            {message && <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">{message}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Mail className="mr-2" />}
              Send Reset Link
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" asChild>
              <Link href="/login" className="flex items-center justify-center">
                <ChevronLeft className="mr-1 h-4 w-4" /> Back to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

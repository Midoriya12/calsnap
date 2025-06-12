
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, KeyRound, ShieldCheck, ShieldX, Eye, EyeOff, Leaf, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ActionHandlerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const mode = searchParams.get('mode');
  const actionCode = searchParams.get('oobCode');
  // const apiKey = searchParams.get('apiKey'); // apiKey is usually not needed client-side if firebase is initialized

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(true);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);


  useEffect(() => {
    if (mode === 'resetPassword' && actionCode) {
      setIsVerifyingCode(true);
      setError(null);
      verifyPasswordResetCode(auth, actionCode)
        .then((email) => {
          setVerifiedEmail(email);
          setSuccessMessage(`Password reset code verified for ${email}. You can now set a new password.`);
        })
        .catch((err) => {
          console.error("Error verifying password reset code:", err);
          let friendlyMessage = "Invalid or expired password reset link. Please request a new one.";
          if (err.code === 'auth/invalid-action-code') {
            friendlyMessage = "The password reset link is invalid or has expired. This can happen if it has already been used or is too old. Please request a new password reset.";
          }
          setError(friendlyMessage);
          toast({ title: "Verification Failed", description: friendlyMessage, variant: "destructive"});
        })
        .finally(() => {
          setIsVerifyingCode(false);
        });
    } else if (mode === 'verifyEmail' && actionCode) {
      // Handle email verification - coming soon
      // applyActionCode(auth, actionCode)...
      setError("Email verification handling is not yet fully implemented on this custom page.");
      setIsVerifyingCode(false);
    } else if (!mode || !actionCode) {
      setError("Missing action mode or code. This link may be incomplete.");
      setIsVerifyingCode(false);
    }
  }, [mode, actionCode, toast]);

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (!actionCode) {
      setError("Action code is missing.");
      toast({ title: "Error", description: "Action code is missing. Cannot reset password.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccessMessage("Your password has been successfully reset! You can now log in with your new password.");
      toast({ title: "Password Reset Successful", description: "You can now log in." });
      setTimeout(() => router.push('/login'), 3000); // Redirect to login after a delay
    } catch (err: any) {
      console.error("Error confirming password reset:", err);
      let friendlyMessage = "Failed to reset password. The link may have expired or there was an unexpected error.";
      if (err.code === 'auth/invalid-action-code') {
        friendlyMessage = "The password reset link is invalid or has expired. This can happen if it has already been used or is too old. Please request a new password reset.";
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = "The new password is too weak. Please choose a stronger password (at least 6 characters).";
      }
      setError(friendlyMessage);
      toast({ title: "Password Reset Failed", description: friendlyMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isVerifyingCode) {
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying link...</p>
        </div>
      );
    }

    if (error && mode === 'resetPassword' && !verifiedEmail) { // Show error prominently if code verification failed
        return (
             <Alert variant="destructive" className="mb-6">
                <ShieldX className="h-4 w-4" />
                <AlertTitle>Password Reset Link Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button variant="link" asChild className="mt-4">
                  <Link href="/forgot-password">Request a New Reset Link</Link>
                </Button>
            </Alert>
        );
    }
    
    if (successMessage && mode === 'resetPassword' && !verifiedEmail && !isLoading) { // If there's a success message but it's about being able to set password (verifiedEmail)
         // This state is handled by verifiedEmail being set.
    }


    if (mode === 'resetPassword' && verifiedEmail) {
      if (successMessage && !error && !isLoading && successMessage.includes("successfully reset")) { // Final success message
        return (
          <Alert variant="default" className="border-green-500 text-green-700 [&>svg]:text-green-500 mb-6">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Password Reset Successful!</AlertTitle>
            <AlertDescription>
              {successMessage}
              <br />
              Redirecting to login page...
            </AlertDescription>
          </Alert>
        );
      }
      return (
        <>
         {error && (
            <Alert variant="destructive" className="mb-6">
                <ShieldX className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            )}
         {successMessage && successMessage.includes("code verified for") && (
             <Alert variant="default" className="border-primary text-primary [&>svg]:text-primary mb-6">
                <ShieldCheck className="h-4 w-4" />
                <AlertTitle>Link Verified</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
         )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                 <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
              Reset Password
            </Button>
          </form>
        </>
      );
    }

    if (mode === 'verifyEmail') {
      return (
        <Alert variant="default" className="border-primary text-primary [&>svg]:text-primary mb-6">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Email Verification</AlertTitle>
          <AlertDescription>
            Handling email verification... (Functionality to be fully implemented here if needed)
            {error && <p className="text-destructive mt-2">{error}</p>}
            {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}
          </AlertDescription>
        </Alert>
      );
    }
    
    // Fallback for unknown modes or missing parameters after initial verification check
    if (error) {
       return (
            <Alert variant="destructive">
                <ShieldX className="h-4 w-4" />
                <AlertTitle>Invalid Link</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <Alert variant="destructive">
            <ShieldX className="h-4 w-4" />
            <AlertTitle>Invalid Action</AlertTitle>
            <AlertDescription>The link is invalid or the action is not recognized.</AlertDescription>
        </Alert>
    );
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
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {mode === 'resetPassword' ? 'Reset Your Password' : 
             mode === 'verifyEmail' ? 'Verify Your Email' : 
             'Account Action'}
          </CardTitle>
          {mode === 'resetPassword' && !successMessage?.includes("successfully reset") && (
            <CardDescription className="text-center">
              {verifiedEmail ? `Enter a new password for ${verifiedEmail}.` : 'Please follow the instructions to continue.'}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {renderContent()}
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

    
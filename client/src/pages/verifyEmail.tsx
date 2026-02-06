// client/src/pages/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'wouter';
import { verifyEmail } from '../lib/api';
import { Button } from '../components/ui/button';

export default function VerifyEmail() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = new URLSearchParams(searchParams).get('token');
      
      if (!token) {
        setStatus('error');
        setError('No verification token provided');
        return;
      }

      try {
        await verifyEmail(token);
        setStatus('success');
        setTimeout(() => navigate('/login?verified=true'), 3000);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to verify email');
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {status === 'verifying' && 'Verifying your email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          
          <div className="mt-4">
            {status === 'verifying' && (
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            )}
            
            {status === 'success' && (
              <div className="space-y-4">
                <p className="text-green-600">Your email has been successfully verified!</p>
                <p>You will be redirected to the login page shortly.</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <p className="text-red-600">{error}</p>
                <Button 
                  onClick={() => window.location.href = '/signup'}
                  className="w-full"
                >
                  Back to Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
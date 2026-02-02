import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const { signInWithEmail, signInWithPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    if (usePassword && !password) {
      toast({
        title: 'Password required',
        description: 'Please enter your password',
        variant: 'destructive',
      });
      return;
    }

    // Validate password length
    if (usePassword && password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (usePassword) {
        await signInWithPassword(email, password);
        toast({
          title: 'Welcome back!',
          description: 'You have been signed in',
        });
        // Redirect will happen via useEffect when user state updates
      } else {
        await signInWithEmail(email);
        setEmailSent(true);
        toast({
          title: 'Check your email',
          description: 'We sent you a magic link to sign in',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
            <p className="mt-4 text-gray-600">
              We sent a magic link to <span className="font-semibold">{email}</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Click the link in the email to sign in
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to Breathwork</h2>
          <p className="mt-2 text-gray-600">Sign in to start your practice</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1"
              disabled={loading}
              autoFocus
            />
          </div>

          {usePassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                disabled={loading}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (usePassword ? 'Signing in...' : 'Sending...') : (usePassword ? 'Sign in' : 'Send magic link')}
          </Button>

          <button
            type="button"
            onClick={() => setUsePassword(!usePassword)}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
          >
            {usePassword ? 'Use magic link instead' : 'Use password instead'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          {usePassword ? 'Sign in with your password' : "We'll email you a magic link for a password-free sign in"}
        </p>
      </div>
    </div>
  );
};

export default SignIn;

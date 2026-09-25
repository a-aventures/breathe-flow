import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { lovable } from '@/integrations/lovable';

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
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-card-foreground breath-text-glow">Check your email</h2>
            <p className="mt-4 text-card-foreground/90">
              We sent a magic link to <span className="font-semibold text-primary">{email}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Click the link in the email to sign in
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-card-foreground breath-text-glow">Welcome to Breathwork</h2>
          <p className="mt-2 text-muted-foreground">Sign in to start your practice</p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-border bg-secondary text-foreground font-semibold hover:bg-secondary/80"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const result = await lovable.auth.signInWithOAuth('google', {
              redirect_uri: window.location.origin,
            });
            if (result.error) {
              toast({ title: 'Google sign-in failed', description: result.error.message, variant: 'destructive' });
              setLoading(false);
            }
          }}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.64 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.55 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12s4.15 9.25 9.25 9.25c5.34 0 8.88-3.75 8.88-9.04 0-.61-.07-1.07-.15-1.11z"/>
          </svg>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 bg-secondary text-foreground placeholder:text-muted-foreground border-border"

              disabled={loading}
              autoFocus
            />
          </div>

          {usePassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-secondary text-foreground placeholder:text-muted-foreground border-border"
                disabled={loading}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (usePassword ? 'Signing in...' : 'Sending...') : (usePassword ? 'Sign in' : 'Send magic link')}
          </Button>

          <button
            type="button"
            onClick={() => setUsePassword(!usePassword)}
            className="w-full text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {usePassword ? 'Use magic link instead' : 'Use password instead'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {usePassword ? 'Sign in with your password' : "We'll email you a magic link for a password-free sign in"}
        </p>
      </div>
    </div>
  );
};

export default SignIn;

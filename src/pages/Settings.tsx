import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/posthog';
import { ArrowLeft, Crown, LogOut, ExternalLink, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signOut } = useAuth();
  const { subscription, isSubscribed, loading, refreshSubscription } = useSubscription();
  const { toast } = useToast();
  const [portalLoading, setPortalLoading] = useState(false);

  // Handle checkout success/cancel
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      trackEvent('checkout_success');
      toast({
        title: 'Welcome!',
        description: 'Your subscription is now active. Enjoy unlimited sessions!',
      });
      refreshSubscription();
      // Clean up URL
      navigate('/settings', { replace: true });
    } else if (checkoutStatus === 'canceled') {
      trackEvent('checkout_canceled');
      navigate('/settings', { replace: true });
    }
  }, [searchParams, navigate, toast, refreshSubscription]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) return;
    
    setPortalLoading(true);
    trackEvent('customer_portal_opened');
    
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          customerId: subscription.stripe_customer_id,
          returnUrl: `${window.location.origin}/settings`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: 'Error',
        description: 'Failed to open subscription management. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user?.email}</div>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5 text-primary" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading...</div>
            ) : isSubscribed ? (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Active Subscription</span>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Renews on</div>
                  <div className="font-medium">{formatDate(subscription?.current_period_end || null)}</div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {portalLoading ? 'Loading...' : 'Manage Subscription'}
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  You're currently on the free plan with limited sessions.
                </div>
                <Button onClick={() => navigate('/')} className="w-full">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

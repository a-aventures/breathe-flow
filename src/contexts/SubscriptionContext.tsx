import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { STRIPE_PRICE_ID } from '@/lib/stripe';
import { trackEvent } from '@/lib/posthog';

interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'active' | 'canceled' | 'past_due' | 'inactive';
  current_period_end: string | null;
}

interface PriceInfo {
  amount: number;
  currency: string;
  symbol: string;
  interval: string;
  intervalCount: number;
  intervalText: string;
  formattedPrice: string;
  productName: string | null;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isSubscribed: boolean;
  loading: boolean;
  priceInfo: PriceInfo | null;
  priceLoading: boolean;
  startCheckout: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [priceInfo, setPriceInfo] = useState<PriceInfo | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);

  // Fetch price info from Stripe (only once on mount)
  useEffect(() => {
    const fetchPrice = async () => {
      if (!STRIPE_PRICE_ID) {
        setPriceLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('get-price', {
          body: { priceId: STRIPE_PRICE_ID },
        });

        if (error) {
          console.error('Error fetching price:', error);
        } else {
          setPriceInfo(data);
        }
      } catch (err) {
        console.error('Error fetching price:', err);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrice();
  }, []);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is fine for new users
        console.error('Error fetching subscription:', error);
      }

      setSubscription(data || null);
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isSubscribed = subscription?.status === 'active';

  const startCheckout = async () => {
    if (!user) {
      throw new Error('Must be logged in to subscribe');
    }

    trackEvent('checkout_initiated');

    // Create checkout session via Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        priceId: STRIPE_PRICE_ID,
        userId: user.id,
        email: user.email,
        successUrl: `${window.location.origin}/settings?checkout=success`,
        cancelUrl: `${window.location.origin}/settings?checkout=canceled`,
      },
    });

    if (error) {
      trackEvent('checkout_error', { error: error.message });
      throw error;
    }

    // Use the URL directly for redirect (more reliable than redirectToCheckout)
    if (data?.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL returned');
    }
  };

  const refreshSubscription = async () => {
    setLoading(true);
    await fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isSubscribed,
        loading,
        priceInfo,
        priceLoading,
        startCheckout,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

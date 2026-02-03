import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/posthog';
import { Sparkles, Check, Loader2 } from 'lucide-react';

interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueFree?: () => void;
}

export const PaywallModal = ({ open, onOpenChange, onContinueFree }: PaywallModalProps) => {
  const { startCheckout, priceInfo, priceLoading } = useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await startCheckout();
    } catch (error) {
      toast({
        title: 'Checkout failed',
        description: 'Unable to start checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueFree = () => {
    trackEvent('paywall_dismissed');
    onOpenChange(false);
    onContinueFree?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Unlock Unlimited Sessions
          </DialogTitle>
          <DialogDescription className="pt-2">
            You've completed your free sessions. Subscribe to continue your breathwork journey.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <div className="text-2xl font-bold">
              {priceLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : priceInfo ? (
                <>
                  {priceInfo.formattedPrice}
                  <span className="text-sm font-normal text-muted-foreground">/{priceInfo.interval}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Price unavailable</span>
              )}
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Unlimited breathing sessions
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                All breathing patterns
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Session history & stats
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Cancel anytime
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleSubscribe}
            disabled={loading || priceLoading || !priceInfo}
            className="w-full"
            size="lg"
          >
            {loading ? 'Loading...' : 'Subscribe Now'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleContinueFree}
            className="w-full text-muted-foreground"
          >
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

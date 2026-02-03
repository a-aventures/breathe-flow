import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Missing priceId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch price from Stripe
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });

    // Format the price for display
    const amount = price.unit_amount ? price.unit_amount / 100 : 0;
    const currency = price.currency.toUpperCase();
    const interval = price.recurring?.interval || 'one_time';
    const intervalCount = price.recurring?.interval_count || 1;

    // Get currency symbol
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      SEK: 'kr',
      // Add more as needed
    };
    const symbol = currencySymbols[currency] || currency + ' ';

    // Format interval text
    let intervalText = interval;
    if (intervalCount > 1) {
      intervalText = `${intervalCount} ${interval}s`;
    }

    const productName = typeof price.product === 'object' ? price.product.name : null;

    return new Response(
      JSON.stringify({
        amount,
        currency,
        symbol,
        interval,
        intervalCount,
        intervalText,
        formattedPrice: `${symbol}${amount.toFixed(2)}`,
        productName,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching price:', message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch price' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

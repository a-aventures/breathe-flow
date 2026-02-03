import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

export const initPosthog = () => {
  if (POSTHOG_KEY) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
};

export const identifyUser = (userId: string, email?: string) => {
  if (POSTHOG_KEY) {
    posthog.identify(userId, email ? { email } : undefined);
  }
};

export const resetUser = () => {
  if (POSTHOG_KEY) {
    posthog.reset();
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (POSTHOG_KEY) {
    posthog.capture(eventName, properties);
  }
};

export { posthog };

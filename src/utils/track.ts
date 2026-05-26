type TrackingEventProperties = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (eventName: string, eventProperties: TrackingEventProperties = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventProperties,
    });
  }
};

// Função para atualizar o consentimento após o aceite do usuário no banner
export const updateConsent = (acceptedAnalytics: boolean, acceptedMarketing: boolean) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: acceptedAnalytics ? 'granted' : 'denied',
      ad_storage: acceptedMarketing ? 'granted' : 'denied',
      ad_user_data: acceptedMarketing ? 'granted' : 'denied',
      ad_personalization: acceptedMarketing ? 'granted' : 'denied',
    });
  }
};

export interface PromotionFeature extends Record<string, any> {
  is_redirect_enable?: boolean;
  is_redirect_enabled?: boolean;
}

export interface Promotion {
  id: string;
  name: string;
  description?: string | null;
  feature: PromotionFeature;
  qtd: number;
  start: string;
  end: string;
  promotion_url: string;
  is_redirect_enabled?: boolean;
}

export interface PromoTimeLeft {
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

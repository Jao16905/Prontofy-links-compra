import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Promotion, PromoTimeLeft } from "@/types/promotion";
import { calculateTimeLeft, clearActivePromotion } from "@/lib/promo";

interface PromoBannerProps {
  promo: Promotion | null;
  onDismiss?: () => void;
}

export function PromoBanner({ promo, onDismiss }: PromoBannerProps) {
  const [timeLeft, setTimeLeft] = useState<PromoTimeLeft | null>(() =>
    promo ? calculateTimeLeft(promo.end) : null
  );

  useEffect(() => {
    if (!promo) return;

    const updateTimer = () => {
      const remaining = calculateTimeLeft(promo.end);
      setTimeLeft(remaining);

      if (remaining.isExpired) {
        clearActivePromotion(promo.id);
        if (onDismiss) onDismiss();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [promo, onDismiss]);

  if (!promo || !timeLeft || timeLeft.isExpired) {
    return null;
  }

  const isRedirectInFeature = promo.feature?.is_redirect_enable ?? promo.feature?.is_redirect_enabled;
  const isRedirectEnabled = isRedirectInFeature !== undefined
    ? Boolean(isRedirectInFeature)
    : (promo.is_redirect_enabled !== false && Boolean(promo.promotion_url));

  let targetLink = `https://prontofy.com.br/checkout?promo=${promo.id}`;
  if (isRedirectInFeature === undefined && promo.promotion_url) {
    targetLink = promo.promotion_url;
  }

  const isExternalLink = targetLink.startsWith("http://") || targetLink.startsWith("https://");

  const BannerContent = () => (
    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-center relative">
      {/* Texto Promocional */}
      <span className="text-slate-950 font-black tracking-wider text-xs sm:text-sm uppercase select-none group-hover:underline decoration-slate-950 underline-offset-4">
        {promo.name} {promo.description ? `— ${promo.description}` : ""}
      </span>

      {/* Relógio Regressivo (Cartões de Calendário) */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Bloco de Horas */}
        <div className="flex flex-col items-center">
          <div className="bg-background text-foreground font-mono font-black text-base sm:text-xl px-3 py-1 rounded-md shadow-sm border border-zinc-800 flex items-center justify-center min-w-[44px] sm:min-w-[50px] select-none">
            {timeLeft.hours}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-950 mt-0.5">HORAS</span>
        </div>

        <span className="text-slate-950/70 font-mono font-bold text-base sm:text-lg pb-3 select-none">:</span>

        {/* Bloco de Minutos */}
        <div className="flex flex-col items-center">
          <div className="bg-background text-foreground font-mono font-black text-base sm:text-xl px-3 py-1 rounded-md shadow-sm border border-zinc-800 flex items-center justify-center min-w-[44px] sm:min-w-[50px] select-none">
            {timeLeft.minutes}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-950 mt-0.5">MIN</span>
        </div>

        <span className="text-slate-950/70 font-mono font-bold text-base sm:text-lg pb-3 select-none">:</span>

        {/* Bloco de Segundos */}
        <div className="flex flex-col items-center">
          <div className="bg-background text-foreground font-mono font-black text-base sm:text-xl px-3 py-1 rounded-md shadow-sm border border-zinc-800 flex items-center justify-center min-w-[44px] sm:min-w-[50px] select-none">
            {timeLeft.seconds}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-950 mt-0.5">SEG</span>
        </div>
      </div>
    </div>
  );

  if (isRedirectEnabled) {
    if (isExternalLink) {
      return (
        <a
          href={targetLink}
          id="promo-banner"
          className="block w-full bg-primary text-primary-foreground border-b border-emerald-800/20 shadow-md sticky top-0 z-30 py-3.5 px-4 transition-all hover:opacity-95 cursor-pointer no-underline group"
        >
          <BannerContent />
        </a>
      );
    }

    return (
      <Link
        to={targetLink}
        id="promo-banner"
        className="block w-full bg-primary text-primary-foreground border-b border-emerald-800/20 shadow-md sticky top-0 z-30 py-3.5 px-4 transition-all hover:opacity-95 cursor-pointer no-underline group"
      >
        <BannerContent />
      </Link>
    );
  }

  return (
    <div
      id="promo-banner"
      className="w-full bg-primary text-primary-foreground border-b border-emerald-800/20 shadow-md sticky top-0 z-30 py-3.5 px-4 transition-all"
    >
      <BannerContent />
    </div>
  );
}

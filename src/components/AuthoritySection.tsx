import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import cardClinic from "@/assets/card-clinic.jpg";
import cardDashboard from "@/assets/card-dashboard.jpg";
import cardPatients from "@/assets/card-patients.jpg";
import cardAi from "@/assets/card-ai.jpg";
import mapaBrasil from "@/assets/mapa-brasil.jpg";

const metrics = [
  { photo: cardClinic, number: "+18 mil", desc: "Consultas / ano em São Paulo", count: { end: 18, prefix: "+", suffix: " mil" } },
  { photo: cardDashboard, number: "+6,5 mil", desc: "Atendimentos na Bahia", count: { end: 6.5, prefix: "+", suffix: " mil", decimals: 1 } },
  { photo: cardPatients, number: "98%", desc: "NPS no Rio de Janeiro", count: { end: 98, suffix: "%" } },
  { photo: cardAi, number: "↓ 42%", desc: "Menos no-shows em Balneário Camboriú", count: { end: 42, prefix: "↓ ", suffix: "%" } },
  { photo: cardClinic, number: "+3,2 mil", desc: "Pacientes ativos no Acre", count: { end: 3.2, prefix: "+", suffix: " mil", decimals: 1 } },
  { photo: cardDashboard, number: "24/7", desc: "Gestão acompanhada em tempo real" },
];

const highlightedStates = {
  SP: { clinic: "Clínica São Paulo", patients: "+18 mil consultas/ano" },
  BA: { clinic: "Rede médica Bahia", patients: "+6,5 mil atendimentos" },
  RJ: { clinic: "Clínica Rio de Janeiro", patients: "98% de NPS" },
  SC: { clinic: "Balneário Camboriú", patients: "42% menos no-shows" },
  AC: { clinic: "Clínica Acre", patients: "+3,2 mil pacientes ativos" },
};

const locationPoints = [
  { uf: "AC", label: "AC", x: "15.3%", y: "37.5%" },
  { uf: "BA", label: "BA", x: "76.9%", y: "45.6%" },
  { uf: "SP", label: "SP", x: "60.1%", y: "67.2%" },
  { uf: "RJ", label: "RJ", x: "69.4%", y: "66.3%" },
  { uf: "SC", label: "SC", x: "57.4%", y: "75.8%" },
] as const;

type HighlightedState = keyof typeof highlightedStates;
type Metric = (typeof metrics)[number];

const AuthoritySection = () => {
  return (
    <section className="relative overflow-hidden bg-[#050709] px-5 pb-20 pt-12 text-white sm:px-8 lg:px-10 lg:pb-28 lg:pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(25,200,121,0.13),transparent_30%),radial-gradient(circle_at_82%_52%,rgba(30,136,229,0.16),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl">
        <h2 className="text-center text-[clamp(32px,3.8vw,40px)] font-semibold leading-tight text-white">
          Quem já confia na{" "}
          <span className="inline-block font-light uppercase tracking-[0.28em]">Prontofy</span>
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <AuthorityTimeline />
          <div>
            <BrazilMap />
          </div>
        </div>
        <div className="mt-12 flex w-full justify-center">
          <a href="https://wa.me/message/YO6R73FVJZHTC1" target="_blank" rel="noreferrer" className="btn-primary mx-auto w-[88%] sm:w-auto">
            Quero evoluir meus atendimentos
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

const AuthorityTimeline = () => {
  return (
    <div className="authority-scroll relative lg:overflow-visible">
      <svg className="authority-lines pointer-events-none absolute inset-0 z-20 hidden h-full w-full lg:block" viewBox="0 0 720 420" fill="none" aria-hidden="true">
        <defs>
          <marker id="authorityArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0L8 4L0 8Z" fill="hsl(var(--accent))" />
          </marker>
        </defs>
        <path className="authority-line" markerEnd="url(#authorityArrow)" d="M224 86H268" />
        <path className="authority-line authority-line-delay-1" markerEnd="url(#authorityArrow)" d="M478 86H522" />
        <path className="authority-line authority-line-delay-2" markerEnd="url(#authorityArrow)" d="M608 150V204" />
        <path className="authority-line authority-line-delay-3" markerEnd="url(#authorityArrow)" d="M522 270H478" />
        <path className="authority-line authority-line-delay-4" markerEnd="url(#authorityArrow)" d="M268 270H224" />
      </svg>

      <div className="grid snap-y snap-mandatory gap-5 overflow-y-auto pr-1 lg:grid-cols-3 lg:grid-rows-2 lg:overflow-visible lg:pr-0">
        {metrics.map((metric, index) => (
          <div key={metric.desc} className="snap-start">
            <MetricCard {...metric} />
            {index < metrics.length - 1 && (
              <div className="flex justify-center py-3 lg:hidden" aria-hidden="true">
                <ArrowDown className="authority-mobile-arrow h-7 w-7 text-[hsl(var(--accent))]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({ photo, number, desc, count }: Metric) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const card = cardRef.current;

    if (!card || !count) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (!hasEntered || !count) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setAnimatedValue(count.end);
      return;
    }

    const duration = 1100;
    const startTime = performance.now();
    let animationFrame = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(count.end * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [count, hasEntered]);

  const displayNumber = count ? formatMetricNumber(animatedValue, count) : number;

  return (
    <article ref={cardRef} className="relative z-10 flex min-h-[132px] items-center gap-4 rounded-lg border border-white/10 bg-white/[0.075] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur">
      <img src={photo} alt="" className="h-[72px] w-[72px] shrink-0 rounded-lg object-cover" />
      <div>
        <p className="text-2xl font-extrabold text-white">{displayNumber}</p>
        <p className="mt-1 text-sm leading-6 text-white/68">{desc}</p>
      </div>
    </article>
  );
};

const formatMetricNumber = (value: number, count: NonNullable<Metric["count"]>) => {
  const decimals = count.decimals ?? 0;
  const formattedValue = value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${count.prefix ?? ""}${formattedValue}${count.suffix ?? ""}`;
};

const BrazilMap = () => {
  const [activeState, setActiveState] = useState<HighlightedState | null>(null);
  const activeTooltip = activeState ? highlightedStates[activeState] : null;

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.2)] backdrop-blur">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(30,136,229,0.16),transparent_48%)]" />
      <div className="relative mx-auto max-h-[280px] w-full overflow-hidden lg:max-h-[520px]">
        <img
          src={mapaBrasil}
          alt="Mapa do Brasil com presença da Prontofy nos estados AC, BA, SP, RJ e SC"
          className="h-auto w-full select-none rounded-md object-contain"
          draggable={false}
        />
        {locationPoints.map((point) => {
          const isActive = activeState === point.uf;
          return (
            <button
              key={point.uf}
              type="button"
              aria-label={`${point.label}: ${highlightedStates[point.uf].clinic}`}
              className="map-point group absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08131f]"
              style={{ left: point.x, top: point.y }}
              onMouseEnter={() => setActiveState(point.uf)}
              onMouseLeave={() => setActiveState(null)}
              onFocus={() => setActiveState(point.uf)}
              onBlur={() => setActiveState(null)}
              onClick={() => setActiveState(point.uf)}
            >
              <span className="map-halo absolute inset-0 rounded-full bg-[hsl(var(--accent))]" />
              <span
                className={`absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--accent))] shadow-[0_0_18px_hsl(var(--accent)/0.85)] transition-transform duration-200 ${
                  isActive ? "scale-125" : "scale-100"
                }`}
              />
            </button>
          );
        })}
      </div>

      {activeTooltip && (
        <div className="absolute bottom-5 left-1/2 w-[min(88%,320px)] -translate-x-1/2 rounded-lg border border-white/12 bg-[#08131f]/95 p-4 text-center shadow-xl">
          <p className="text-sm font-bold text-white">{activeTooltip.clinic}</p>
          <p className="mt-1 text-xs text-white/64">{activeTooltip.patients}</p>
        </div>
      )}
    </div>
  );
};

export default AuthoritySection;

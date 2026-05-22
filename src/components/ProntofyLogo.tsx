const ProntofyLogo = () => {
  return (
    <div className="flex items-center gap-4" aria-label="Prontofy">
      <svg className="h-14 w-14 shrink-0 text-white sm:h-16 sm:w-16" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <path
          d="M13 50V14h20c10.5 0 18 6.8 18 17s-7.5 17-18 17H22v2c0 2.5-2 4.5-4.5 4.5S13 52.5 13 50Zm9-11h11c5.5 0 9-3.2 9-8s-3.5-8-9-8H22v16Z"
          fill="currentColor"
        />
        <path d="M7 38h19v9H7c-2.5 0-4.5-2-4.5-4.5S4.5 38 7 38Z" fill="currentColor" />
      </svg>
      <span className="text-[clamp(1.7rem,7vw,3.7rem)] font-light uppercase tracking-[0.34em] text-white">
        Prontofy
      </span>
    </div>
  );
};

export default ProntofyLogo;

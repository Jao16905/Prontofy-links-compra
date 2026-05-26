import logoIcon from "@/assets/Imagem-title.png";

const ProntofyLogo = () => {
  return (
    <div className="flex items-center gap-4" aria-label="Prontofy">
      <img src={logoIcon} alt="" className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16" aria-hidden="true" />
      <span className="text-[clamp(1.7rem,7vw,3.7rem)] font-light uppercase tracking-[0.34em] text-white">
        Prontofy
      </span>
    </div>
  );
};

export default ProntofyLogo;

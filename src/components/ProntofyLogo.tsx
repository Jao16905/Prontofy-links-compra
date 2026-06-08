import logoIcon from "@/assets/Imagem-title.png";

type ProntofyLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showIcon?: boolean;
};

const ProntofyLogo = ({
  className = "",
  iconClassName = "",
  textClassName = "",
  showIcon = true,
}: ProntofyLogoProps) => {
  const iconClasses = iconClassName || "h-14 w-14 sm:h-16 sm:w-16";
  const textClasses = textClassName || "text-[clamp(1.7rem,7vw,3.7rem)] font-light";

  return (
    <div className={`flex items-center gap-4 ${className}`} aria-label="Prontofy">
      {showIcon && (
        <img
          src={logoIcon}
          alt=""
          className={`shrink-0 object-contain ${iconClasses}`}
          aria-hidden="true"
        />
      )}
      <span
        className={`uppercase tracking-[0.34em] text-white ${textClasses}`}
      >
        Prontofy
      </span>
    </div>
  );
};

export default ProntofyLogo;

import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

const FeatureCard = ({ image, title, description, buttonText, link }: FeatureCardProps) => {
  return (
    <a
      href={link}
      className="group relative block overflow-hidden rounded-lg shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[16/8] lg:aspect-[16/9] lg:min-h-[280px]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-y-0 left-0 flex w-3/5 flex-col justify-center gap-3 p-6 sm:p-8 lg:w-1/2">
        <h3 className="text-xl font-bold leading-tight text-primary-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
          {description}
        </p>
        <span className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 group-hover:bg-secondary">
          {buttonText}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  );
};

export default FeatureCard;

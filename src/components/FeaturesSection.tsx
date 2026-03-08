import FeatureCard from "./FeatureCard";
import cardClinic from "@/assets/card-clinic.jpg";
import cardAi from "@/assets/card-ai.jpg";
import cardDashboard from "@/assets/card-dashboard.jpg";
import cardPatients from "@/assets/card-patients.jpg";

const cards = [
  {
    image: cardClinic,
    title: "Gestão inteligente para clínicas",
    description: "Automatize consultas, prontuários e relatórios com inteligência artificial.",
    buttonText: "Explorar Plataforma",
    link: "#plataforma",
  },
  {
    image: cardAi,
    title: "IA que auxilia o médico",
    description: "Use inteligência artificial para gerar relatórios, diagnósticos auxiliares e insights clínicos.",
    buttonText: "Conhecer a IA",
    link: "#ia",
  },
  {
    image: cardDashboard,
    title: "Dados que geram decisões",
    description: "Dashboards avançados para acompanhar desempenho da clínica em tempo real.",
    buttonText: "Ver Recursos",
    link: "#recursos",
  },
  {
    image: cardPatients,
    title: "Experiência moderna para pacientes",
    description: "Telemedicina, integração com WhatsApp e gestão completa do atendimento.",
    buttonText: "Saiba Mais",
    link: "#pacientes",
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full bg-background py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Conheça o <span className="text-primary">Prontofy</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Tecnologia que transforma a gestão em saúde.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {cards.map((card) => (
            <FeatureCard key={card.link} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

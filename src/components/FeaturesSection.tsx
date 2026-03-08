import FeatureCard from "./FeatureCard";
import cardClinic from "@/assets/card-clinic.jpg";
import cardAi from "@/assets/card-ai.jpg";
import cardDashboard from "@/assets/card-dashboard.jpg";
import cardPatients from "@/assets/card-patients.jpg";

const cards = [
  {
    image: cardClinic,
    title: "Prontuário Eletrônico com IA",
    description: "Você atende e a IA escreve, treinada para acertar.",
    buttonText: "Explorar Plataforma",
    link: "#plataforma",
    accent: "from-emerald-900/90 via-emerald-900/60",
  },
  {
    image: cardAi,
    title: "Agendamento com IA pelo WhatsApp",
    description: "Tenha uma secretária de IA que entende seu consultório e traga uma experiência humanizada e profissional automática.",
    buttonText: "Conhecer a IA",
    link: "#ia",
    accent: "from-blue-900/90 via-blue-900/60",
  },
  {
    image: cardDashboard,
    title: "Dados que geram decisões",
    description: "Dashboards avançados para acompanhar desempenho da clínica em tempo real.",
    buttonText: "Ver Recursos",
    link: "#recursos",
    accent: "from-slate-900/90 via-slate-900/60",
  },
  {
    image: cardPatients,
    title: "Telemedicina com IA",
    description: "Proteja sua carreira médica protegendo os dados do seu paciente, telemedicina com criptografia dos dados.",
    buttonText: "Saiba Mais",
    link: "#pacientes",
    accent: "from-teal-900/90 via-teal-900/60",
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative w-full py-16 sm:py-24 lg:py-28">
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

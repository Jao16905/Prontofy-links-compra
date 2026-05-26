import { ArrowRight, Bot, ClipboardPenLine, Droplets, Stethoscope } from "lucide-react";
import agendaIa from "@/assets/agenda-ia.png";

const WHATSAPP_LINK = "https://wa.me/message/YO6R73FVJZHTC1";

const productFeatures = [
  {
    icon: ClipboardPenLine,
    title: "Crie seu próprio prontuário",
    text: "Arraste campos, salve modelos e padronize atendimentos em minutos.",
  },
  {
    icon: Droplets,
    title: "Módulo UTI completo",
    text: "Escalas de Glasgow, balanço hídrico, antibióticos em dose-guia e evolução em um fluxo único.",
  },
  {
    icon: Stethoscope,
    title: "Atendimento ambulatorial sem fricção",
    text: "Histórico, exame físico, receitas e pedidos de exame em um layout limpo para consultas rápidas.",
  },
  {
    icon: Bot,
    title: "IA integrada ao WhatsApp",
    text: "Responda dúvidas, confirme consultas e gere evoluções por voz ou texto com apoio da IA.",
  },
];

const ProductSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#0b2339] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#050709_0%,#071522_12%,#0b2339_28%,#0b2339_78%,#082034_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(25,200,121,0.12),transparent_30%),radial-gradient(circle_at_84%_44%,rgba(30,136,229,0.18),transparent_34%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,#050709_0%,rgba(5,7,9,0)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(11,35,57,0)_0%,#082034_100%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(32px,3.8vw,40px)] font-semibold leading-tight text-white">
            O Prontuário Eletrônico que se adapta à sua rotina
          </h2>
          <p className="mx-auto mt-3 max-w-[720px] text-base leading-7 text-white/80 sm:text-lg">
            Personalize templates, atenda UTI ou ambulatório e conte com IA no WhatsApp.
          </p>
        </div>

        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:pb-0 lg:gap-12">
          {productFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="min-h-[260px] flex-[0_0_82vw] snap-center rounded-lg border border-white/10 bg-white/[0.06] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] sm:min-h-[280px] sm:flex-auto sm:p-10"
              >
                <div className="grid h-14 w-14 place-items-center rounded-md border border-emerald-300/20 bg-emerald-300/12 text-emerald-300">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-[22px] font-semibold leading-tight text-white">{feature.title}</h3>
                <p className="mt-3 text-base leading-7 text-white/76">{feature.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-14 max-w-[900px] overflow-hidden rounded-xl border border-white/12 bg-[#061524] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.25)] lg:mt-[72px]">
          <div className="overflow-hidden rounded-lg bg-black">
            <img
              src={agendaIa}
              alt="Demonstração do prontuário eletrônico Prontofy com IA"
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="grid gap-4 border-t border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">IA no atendimento</p>
              <p className="mt-2 text-lg font-semibold text-white">Sugestões, evolução e histórico clínico no mesmo lugar.</p>
            </div>
            <span className="rounded-md border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white/78">
              Prontuário + WhatsApp
            </span>
          </div>
        </div>

        <div className="mt-10 flex justify-center lg:mt-14">
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-primary w-[88%] sm:w-auto">
            Quero evoluir meus atendimentos
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;

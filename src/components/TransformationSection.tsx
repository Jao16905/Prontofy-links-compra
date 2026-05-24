import { ArrowRight, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import cardAi from "@/assets/card-ai.jpg";
import cardDashboard from "@/assets/card-dashboard.jpg";
import cardPatients from "@/assets/card-patients.jpg";

const gains = [
  {
    icon: Clock3,
    label: "Menos tempo perdido",
    text: "Agenda, prontuario e atendimentos conectados em um fluxo mais leve.",
  },
  {
    icon: TrendingUp,
    label: "Mais clareza para decidir",
    text: "Indicadores organizados para enxergar gargalos e oportunidades.",
  },
  {
    icon: CheckCircle2,
    label: "Rotina mais previsivel",
    text: "Processos simples para sua equipe executar melhor todos os dias.",
  },
];

const TransformationSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#050709] px-5 pb-20 pt-10 text-white sm:px-8 lg:px-10 lg:pb-28 lg:pt-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_24%,rgba(25,200,121,0.11),transparent_30%),radial-gradient(circle_at_76%_62%,rgba(30,136,229,0.14),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="lead-enter">
          <p className="mb-4 inline-flex rounded-full border border-white/12 bg-white/7 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300 backdrop-blur">
            Transformacao na gestao
          </p>
          <h2 className="max-w-3xl text-[clamp(34px,4vw,56px)] font-extrabold leading-[1.02] text-white">
            Saia da rotina reativa para uma clinica mais previsivel.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            A Prontofy ajuda sua equipe a trocar controles soltos por uma operacao centralizada, clara e pronta para crescer.
          </p>

          <div className="mt-8 grid gap-4">
            {gains.map((gain) => {
              const Icon = gain.icon;
              return (
                <article key={gain.label} className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-emerald-400/12 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">{gain.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/64">{gain.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(25,200,121,0.15),transparent_62%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.055] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#071016] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">Antes</p>
                <img src={cardPatients} alt="" className="mt-4 aspect-[4/3] w-full rounded-md object-cover opacity-72" />
                <p className="mt-4 text-xl font-extrabold text-white">Dados espalhados</p>
                <p className="mt-2 text-sm leading-6 text-white/58">Decisoes dependem de planilhas, memoria da equipe e retrabalho.</p>
              </div>

              <div className="rounded-lg border border-emerald-300/24 bg-emerald-400/[0.08] p-4 shadow-[0_18px_54px_rgba(25,200,121,0.12)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Depois</p>
                <img src={cardDashboard} alt="" className="mt-4 aspect-[4/3] w-full rounded-md object-cover" />
                <p className="mt-4 text-xl font-extrabold text-white">Gestao visivel</p>
                <p className="mt-2 text-sm leading-6 text-white/68">Indicadores, rotina e atendimento alinhados para agir com clareza.</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/28 p-4">
              <img src={cardAi} alt="" className="h-14 w-14 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">Automacoes e IA trabalhando junto com a equipe</p>
                <p className="mt-1 text-xs text-white/55">Menos tarefas manuais, mais tempo para cuidar do paciente.</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-emerald-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationSection;

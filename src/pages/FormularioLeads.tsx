import { FormEvent, ReactNode, useMemo, useState, useEffect, useRef, useCallback } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Bot,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  ClipboardList,
  HeartPulse,
  LineChart,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import ProntofyLogo from "@/components/ProntofyLogo";
import agendaIa from "@/assets/agenda-ia.png";
import cardAi from "@/assets/card-ai.jpg";
import cardClinic from "@/assets/card-clinic.jpg";
import cardDashboard from "@/assets/card-dashboard.jpg";
import cardPatients from "@/assets/card-patients.jpg";
import solucaoDeGestao from "@/assets/solucao-de-gestao.png";

const ESTADOS = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins",
];

const DORES = [
  "Falta de tempo",
  "Dificuldade para organizar a rotina",
  "Medo de não conseguir alcançar meus objetivos",
  "Falta de clareza sobre o próximo passo",
  "Dificuldade financeira",
  "Outra",
];

const painStats = [
  { icon: Clock3, value: "12h+", text: "perdidas por semana com tarefas administrativas" },
  { icon: CalendarCheck, value: "37%", text: "mais risco de faltas quando a agenda não é automatizada" },
  { icon: Users, value: "2x", text: "mais retrabalho quando equipe e atendimento não conversam" },
  { icon: HeartPulse, value: "Alta carga", text: "mental para médicos que levam a clínica para casa" },
];

const benefits = [
  { icon: Wallet, title: "Mais previsibilidade financeira" },
  { icon: Clock3, title: "Menos tempo perdido com tarefas operacionais" },
  { icon: CalendarCheck, title: "Agenda organizada automaticamente" },
  { icon: Users, title: "Mais produtividade para sua equipe" },
  { icon: Stethoscope, title: "Atendimento mais moderno e eficiente" },
  { icon: TrendingUp, title: "Redução de faltas e atrasos" },
];

const floatingCards = [
  "IA organizando prontuários automaticamente",
  "WhatsApp automatizado",
  "Controle financeiro inteligente",
  "Agenda sincronizada em tempo real",
];

const steps = [
  {
    icon: ClipboardList,
    title: "Diagnóstico da operação clínica",
    text: "Entendemos como sua equipe atende, registra, agenda e acompanha pacientes.",
  },
  {
    icon: Sparkles,
    title: "Implementação inteligente",
    text: "Configuramos fluxos, templates e módulos para a realidade da sua clínica.",
  },
  {
    icon: Bot,
    title: "Automação da rotina",
    text: "WhatsApp, agenda, prontuário e gestão passam a trabalhar em conjunto.",
  },
  {
    icon: LineChart,
    title: "Acompanhamento estratégico",
    text: "Você acompanha indicadores e toma decisões com muito mais clareza.",
  },
];

type FormState = {
  nome: string;
  email: string;
  numero: string;
  estado: string;
  maior_dor: string;
  outro_txt: string;
  ofertas_ex: boolean;
  website: string;
};

type FormErrors = Partial<Record<keyof Omit<FormState, "website">, string>>;

const initialFormState: FormState = {
  nome: "",
  email: "",
  numero: "",
  estado: "",
  maior_dor: "",
  outro_txt: "",
  ofertas_ex: false,
  website: "",
};

const sanitizeText = (value: string, maxLength: number) => value.trim().replace(/\s+/g, " ").slice(0, maxLength);

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);

const FormularioLeads = () => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSuccess = status === "success";
  const maiorDorIndex = DORES.indexOf(formData.maior_dor);
  const maiorDorValue = maiorDorIndex >= 0 ? maiorDorIndex + 1 : null;
  const outroText = formData.maior_dor === "Outra" ? sanitizeText(formData.outro_txt, 240) : null;

  const payload = useMemo(
    () => ({
      nome: sanitizeText(formData.nome, 120),
      email: sanitizeText(formData.email, 160).toLowerCase(),
      numero: sanitizeText(formData.numero, 32),
      estado: sanitizeText(formData.estado, 40),
      maior_dor: maiorDorValue,
      outro_txt: outroText,
      ofertas_ex: formData.ofertas_ex,
      data_envio: new Date().toISOString(),
    }),
    [formData, maiorDorValue, outroText],
  );

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!payload.nome) nextErrors.nome = "Informe seu nome completo.";
    if (!payload.email) {
      nextErrors.email = "Informe seu email.";
    } else if (!isValidEmail(payload.email)) {
      nextErrors.email = "Informe um email válido.";
    }
    if (!payload.numero) nextErrors.numero = "Informe seu telefone ou WhatsApp.";
    if (!payload.estado || !ESTADOS.includes(payload.estado)) nextErrors.estado = "Selecione seu estado.";
    if (!payload.maior_dor) nextErrors.maior_dor = "Selecione sua maior dor.";
    if (formData.maior_dor === "Outra" && !outroText) nextErrors.outro_txt = "Descreva o motivo.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");

    if (formData.website) return;
    if (!validate()) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      setIsSubmitting(true);
      const response = await fetch("/webhook/relacionamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Webhook request failed");
      }

      setStatus("success");
      setFormData(initialFormState);
      setErrors({});
    } catch {
      setStatus("error");
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <main className="min-h-screen bg-[#050709] text-white">
      <section className="relative min-h-screen overflow-hidden px-5 py-6 sm:px-8 lg:px-10 lg:py-0">
        <div className="absolute inset-0 bg-[#050709]" />
        <img src={solucaoDeGestao} alt="" className="absolute inset-0 h-full w-full object-cover object-[48%_0%] opacity-[0.78] md:object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.60)_0%,rgba(5,7,9,0.36)_43%,rgba(5,7,9,0.60)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.08)_0%,rgba(5,7,9,0.24)_50%,rgba(5,7,9,0.70)_100%)] md:bg-[linear-gradient(90deg,rgba(5,7,9,0.44)_0%,rgba(5,7,9,0.18)_44%,rgba(5,7,9,0.60)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_54%,rgba(28,200,138,0.14),transparent_28%),radial-gradient(circle_at_80%_24%,rgba(30,136,229,0.10),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,rgba(5,7,9,0)_0%,#050709_100%)]" />

        <div className="relative z-10 mx-auto flex max-w-[1540px] justify-center pt-2 md:absolute md:left-1/2 md:top-8 md:-translate-x-1/2 md:pt-0">
          <ProntofyLogo />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1540px] flex-col justify-center gap-10 pt-8 md:min-h-screen md:flex-row md:items-center md:justify-between md:gap-12 md:pt-24 lg:gap-20">
          <div className="lead-enter w-full max-w-[720px] py-8 md:w-[45%] md:max-w-none md:py-0">
            <div className="max-w-[680px] md:ml-0">
              <h1 className="text-4xl font-extrabold leading-[1.03] sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem]">
                Solução de gestão para clínicas{" "}
                <span className="text-[#1CC88A]">modernas e inteligentes</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                Entenda como a Prontofy pode organizar sua operação, automatizar rotinas e devolver mais tempo para sua equipe cuidar dos pacientes.
              </p>
              <a href="#dor-clinica" className="mt-8 inline-flex items-center gap-3 text-base font-semibold text-white/88 transition hover:text-[#1CC88A]">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/8 backdrop-blur">
                  <ArrowDown className="h-5 w-5" />
                </span>
                Quero saber mais
              </a>
            </div>
          </div>

          <div className="relative z-20 w-full px-2 sm:px-4 md:px-0 max-w-full sm:max-w-[520px] md:w-[52%] md:max-w-[680px] lg:w-[45%]">
            <LeadForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              isSuccess={isSuccess}
              status={status}
              onSubmit={handleSubmit}
              updateField={updateField}
            />
          </div>
        </div>
      </section>

      <PainSection />
      <LifestyleSection />
      <BenefitsSection />
      <DevicesSection />
      <DifferentialsSection />
      <HowItWorksSection />
      <BeforeAfterSection />
      <FinalCTASection />
    </main>
  );
};

const LeadForm = ({
  formData,
  errors,
  isSubmitting,
  isSuccess,
  status,
  onSubmit,
  updateField,
}: {
  formData: FormState;
  errors: FormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  status: "idle" | "success" | "error";
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  updateField: (field: keyof FormState, value: string) => void;
}) => (
  <form
    id="form-contato"
    onSubmit={onSubmit}
    noValidate
    className="lead-enter lead-enter-delay-2 mx-auto max-w-full sm:max-w-[520px] md:max-w-[680px] lg:max-w-[560px] rounded-[1.75rem] border border-white/10 bg-[#252525]/76 p-4 text-white shadow-[0_30px_90px_rgba(0,0,0,0.44)] backdrop-blur-xl sm:p-8 lg:p-10"
  >
    <div className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1CC88A] sm:text-sm">Diagnóstico Prontofy</p>
      <h2 className="mt-2 text-xl font-extrabold leading-tight text-white sm:text-[1.5rem] lg:text-[1.35rem]">
        Fale com um especialista
      </h2>
      <p className="mt-2 text-sm leading-6 text-white/62">
        Preencha os dados para receber uma análise da operação da sua clínica.
      </p>
    </div>

    <div className="grid gap-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(event) => updateField("website", event.target.value)} />
      </div>

      <Field label="Qual o seu nome completo?" error={errors.nome}>
        <input
          id="nome"
          name="nome"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          value={formData.nome}
          onChange={(event) => updateField("nome", event.target.value)}
          className={inputClassName(errors.nome)}
          placeholder=""
        />
      </Field>

      <Field label="Qual o seu e-mail?" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={160}
          autoComplete="email"
          value={formData.email}
          onChange={(event) => updateField("email", event.target.value)}
          className={inputClassName(errors.email)}
          placeholder=""
        />
      </Field>

      <Field label="Qual o seu telefone?" error={errors.numero}>
        <input
          id="numero"
          name="numero"
          type="tel"
          required
          maxLength={32}
          autoComplete="tel"
          inputMode="tel"
          value={formData.numero}
          onChange={(event) => updateField("numero", event.target.value)}
          className={inputClassName(errors.numero)}
          placeholder=""
        />
      </Field>

      <Field label="Qual é o seu estado?" error={errors.estado}>
        <CustomSelect
          id="estado"
          value={formData.estado}
          placeholder="Selecione"
          options={ESTADOS}
          error={errors.estado}
          onChange={(value) => updateField("estado", value)}
        />
      </Field>

      <Field label="Qual sua maior dor hoje?" error={errors.maior_dor}>
        <CustomSelect
          id="maior_dor"
          value={formData.maior_dor}
          placeholder="Selecione"
          options={DORES}
          error={errors.maior_dor}
          openUp
          onChange={(value) => {
            updateField("maior_dor", value);
            if (value !== "Outra") updateField("outro_txt", "");
          }}
        />
      </Field>

      {formData.maior_dor === "Outra" && (
        <Field label="Qual o motivo?" error={errors.outro_txt}>
          <input
            id="outro_txt"
            name="outro_txt"
            type="text"
            required
            maxLength={240}
            value={formData.outro_txt}
            onChange={(event) => updateField("outro_txt", event.target.value)}
            className={inputClassName(errors.outro_txt)}
            placeholder="Descreva em poucas palavras"
          />
        </Field>
      )}

      <label className="mt-1 flex items-center gap-3 text-sm font-semibold text-white/82">
        <input
          id="ofertas_ex"
          name="ofertas_ex"
          type="checkbox"
          checked={formData.ofertas_ex}
          onChange={(event) => updateField("ofertas_ex", event.target.checked)}
          className="h-4 w-4 rounded border border-white/30 bg-transparent text-[#1CC88A] focus:ring-2 focus:ring-[#1CC88A]/60"
        />
        Quero receber ofertas e promocoes
      </label>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1CC88A] px-5 py-3 text-sm font-extrabold text-[#04110b] shadow-[0_18px_44px_rgba(28,200,138,0.32)] transition hover:bg-[#35df91] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
      Falar com um especialista
    </button>

    <p className="mt-7 text-xs leading-5 text-white/58">
      Ao enviar, você concorda em receber contato da Prontofy para entender sua operação clínica e apresentar uma solução adequada.
    </p>

    {isSuccess && (
      <p className="mt-5 flex items-start gap-2 rounded-xl border border-[#1CC88A]/30 bg-[#1CC88A]/12 p-4 text-sm font-semibold text-white">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1CC88A]" />
        Obrigado! Suas informações foram enviadas com sucesso.
      </p>
    )}

    {status === "error" && (
      <p className="mt-5 rounded-xl border border-red-300/30 bg-red-500/12 p-4 text-sm font-semibold text-red-100">
        Não foi possível enviar suas informações. Tente novamente.
      </p>
    )}
  </form>
);

const PainSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let intervalId = window.setInterval(() => {
      if (!scrollRef.current || isHovered) return;
      
      const container = scrollRef.current;
      const child = container.firstElementChild as HTMLElement;
      if (!child) return;
      
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: child.clientWidth + 16, behavior: "smooth" });
      }
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [isHovered]);

  const scrollBack = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const child = container.firstElementChild as HTMLElement;
    if (child) container.scrollBy({ left: -(child.clientWidth + 16), behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const child = container.firstElementChild as HTMLElement;
    if (child) container.scrollBy({ left: child.clientWidth + 16, behavior: "smooth" });
  };

  return (
    <section id="dor-clinica" className="relative overflow-hidden bg-[#050709] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(25,200,121,0.12),transparent_30%),radial-gradient(circle_at_82%_74%,rgba(30,136,229,0.12),transparent_34%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Consciência operacional</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(34px,4vw,54px)] font-extrabold leading-[1.04]">
            A desorganização clínica custa tempo, dinheiro e qualidade de vida.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Clínicas sem processos organizados enfrentam atrasos, faltas, retrabalho, sobrecarga da equipe e desgaste mental constante.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {painStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.text} className="min-h-[190px] flex-[0_0_82vw] sm:flex-[0_0_45%] lg:flex-[0_0_47%] snap-center rounded-2xl border border-emerald-300/14 bg-white/[0.055] p-6 shadow-[0_0_54px_rgba(28,200,138,0.08)] backdrop-blur">
                  <Icon className="h-6 w-6 text-emerald-300" />
                  <p className="mt-6 text-3xl font-extrabold text-white">{stat.value}</p>
                  <p className="mt-3 text-sm leading-6 text-white/66">{stat.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-end gap-3 lg:justify-start">
            <button 
              onClick={scrollBack}
              aria-label="Card anterior"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 hover:text-emerald-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={scrollNext}
              aria-label="Próximo card"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 hover:text-emerald-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const LifestyleSection = () => (
  <section className="relative overflow-hidden bg-[#071725] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#050709_0%,#0b2339_55%,#071725_100%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(28,200,138,0.14),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(30,136,229,0.14),transparent_34%)]" />
    <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="order-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-[0_28px_80px_rgba(0,0,0,0.28)] lg:order-none">
        <img src={cardClinic} alt="Médico usando tecnologia em consultório moderno" className="aspect-[4/3] w-full rounded-xl object-cover" />
      </div>
      <div className="order-2">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Qualidade de vida</p>
        <h2 className="mt-4 max-w-2xl text-[clamp(34px,4vw,54px)] font-extrabold leading-[1.04]">
          Sua clínica não precisa acompanhar você até em casa.
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
          Mensagens até tarde, prontuários pendentes e decisões no improviso drenam energia. A Prontofy devolve controle, tranquilidade e organização para uma rotina mais leve.
        </p>
      </div>
    </div>
  </section>
);

const BenefitsSection = () => (
  <section className="relative overflow-hidden bg-[#050709] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(30,136,229,0.14),transparent_34%)]" />
    <div className="relative mx-auto max-w-7xl">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Benefícios reais</p>
        <h2 className="mt-4 text-[clamp(32px,3.8vw,46px)] font-extrabold leading-tight">
          Tecnologia que aparece na rotina, no caixa e no atendimento.
        </h2>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <article key={benefit.title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur">
              <Icon className="h-6 w-6 text-emerald-300" />
              <h3 className="mt-6 text-xl font-bold leading-tight">{benefit.title}</h3>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

const DevicesSection = () => (
  <section className="relative overflow-hidden bg-[#050709] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(28,200,138,0.18),transparent_32%)]" />
    <div className="relative mx-auto max-w-7xl text-center">
      <h2 className="mx-auto max-w-3xl text-[clamp(32px,3.8vw,46px)] font-extrabold leading-tight">
        Um ecossistema visual para administrar sua clínica em tempo real.
      </h2>
      <div className="relative mx-auto mt-12 max-w-5xl">
        <div className="rounded-2xl border border-white/12 bg-white/[0.055] p-4 shadow-[0_34px_100px_rgba(0,0,0,0.4)] backdrop-blur">
          <img src={agendaIa} alt="Dashboard Prontofy em notebook, tablet e celular" className="w-full rounded-xl object-cover" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:absolute lg:inset-x-0 lg:top-8 lg:mt-0 lg:grid-cols-4">
          {floatingCards.map((card) => (
            <span key={card} className="rounded-xl border border-white/12 bg-[#071725]/80 px-4 py-3 text-sm font-semibold text-white/82 shadow-lg backdrop-blur">
              {card}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const DifferentialsSection = () => (
  <section className="relative overflow-hidden bg-[#050709] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(28,200,138,0.14),transparent_30%),radial-gradient(circle_at_78%_58%,rgba(30,136,229,0.16),transparent_34%)]" />
    <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Diferencial Prontofy</p>
        <h2 className="mt-4 text-[clamp(34px,4vw,54px)] font-extrabold leading-tight">
          Mais que um software médico. Um fluxo inteligente para a clínica.
        </h2>
        <p className="mt-6 text-lg leading-8 text-white/70">
          Atendimento, gestão, automações e inteligência artificial conectados em uma operação moderna, segura e escalável.
        </p>
      </div>
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.055] p-8 backdrop-blur">
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { icon: Bot, text: "IA no prontuário" },
            { icon: MessageCircle, text: "WhatsApp integrado" },
            { icon: Activity, text: "Dashboards operacionais" },
            { icon: ShieldCheck, text: "Dados protegidos" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="rounded-xl border border-white/10 bg-black/20 p-5">
                <Icon className="h-6 w-6 text-emerald-300" />
                <p className="mt-4 font-bold">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="relative overflow-hidden bg-[#071725] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#050709_0%,#071725_22%,#0b2339_100%)]" />
    <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.055] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.32)]">
        <img src={cardDashboard} alt="Dispositivos com dashboard clínico" className="aspect-[4/3] w-full rounded-xl object-cover" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Como funciona</p>
        <h2 className="mt-4 text-[clamp(32px,3.8vw,46px)] font-extrabold leading-tight">Uma implementação clara, acompanhada e progressiva.</h2>
        <div className="mt-8 grid gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-emerald-300/12 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/64">{step.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

const BeforeAfterSection = () => (
  <section className="relative overflow-hidden bg-[#050709] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(28,200,138,0.12),transparent_40%)]" />
    <div className="relative mx-auto max-w-7xl">
      <h2 className="mx-auto max-w-3xl text-center text-[clamp(32px,3.8vw,46px)] font-extrabold leading-tight">
        Do operacional pesado para uma rotina inteligente.
      </h2>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <CompareCard image={cardPatients} label="Antes" title="Sobrecarga e desorganização" items={["Atrasos e mensagens acumuladas", "Retrabalho administrativo", "Estresse operacional constante"]} />
        <CompareCard image={cardAi} label="Depois" title="Controle, produtividade e qualidade de vida" items={["Dashboards inteligentes", "Automações e IA na rotina", "Equipe com clareza para executar"]} highlight />
      </div>
    </div>
  </section>
);

const FinalCTASection = () => (
  <section className="relative overflow-hidden bg-[#050709] px-5 py-20 text-center sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(28,200,138,0.18),transparent_34%)]" />
    <div className="relative mx-auto max-w-3xl">
      <h2 className="text-[clamp(34px,4vw,54px)] font-extrabold leading-tight">Está na hora da sua clínica operar em outro nível.</h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/72">
        Modernize sua operação, ganhe qualidade de vida e crie uma base mais organizada para crescer.
      </p>
      <a href="#form-contato" className="mt-9 inline-flex w-[88%] items-center justify-center gap-3 rounded-xl bg-[#1CC88A] px-8 py-5 text-base font-extrabold uppercase tracking-wide text-[#04110b] shadow-[0_18px_52px_rgba(28,200,138,0.34)] transition hover:bg-[#35df91] sm:w-auto">
        Quero minha análise estratégica
        <ArrowRight className="h-5 w-5" />
      </a>
    </div>
  </section>
);

const CompareCard = ({ image, label, title, items, highlight = false }: { image: string; label: string; title: string; items: string[]; highlight?: boolean }) => (
  <article className={`overflow-hidden rounded-2xl border p-4 ${highlight ? "border-emerald-300/24 bg-emerald-300/[0.07]" : "border-white/10 bg-white/[0.045]"}`}>
    <img src={image} alt="" className="aspect-[16/9] w-full rounded-xl object-cover opacity-86" />
    <div className="p-4">
      <p className={`text-sm font-bold uppercase tracking-[0.2em] ${highlight ? "text-emerald-300" : "text-white/45"}`}>{label}</p>
      <h3 className="mt-3 text-2xl font-extrabold">{title}</h3>
      <ul className="mt-5 grid gap-3 text-sm leading-6 text-white/68">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  </article>
);

const inputClassName = (error?: string) =>
  [
    "mt-2 h-10 w-full rounded-none border-0 border-b bg-transparent px-0 text-sm font-medium text-white outline-none transition placeholder:text-white/48 sm:h-11 lg:h-10",
    "focus:border-[#1CC88A] focus:ring-0",
    error ? "border-red-300" : "border-white/22",
  ].join(" ");

const CustomSelect = ({
  id,
  value,
  placeholder,
  options,
  error,
  openUp = false,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  options: string[];
  error?: string;
  openUp?: boolean;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mt-2">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        className={[
          "flex h-11 w-full items-center justify-between rounded-none border-0 border-b bg-transparent px-0 text-left text-sm font-semibold outline-none transition sm:h-12",
          "focus:border-[#1CC88A] focus:ring-0",
          value ? "text-white" : "text-white/48",
          error ? "border-red-300" : "border-white/22",
        ].join(" ")}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`ml-3 h-4 w-4 shrink-0 text-[#1CC88A] transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={[
            "absolute left-0 right-0 z-40 overflow-hidden rounded-xl border border-white/10 bg-[#202020]/95 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl",
            openUp ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
          ].join(" ")}
        >
          <div className="max-h-52 overflow-y-auto p-2 sm:max-h-60" role="listbox" aria-labelledby={id}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={value === option}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={[
                  "w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition",
                  value === option ? "bg-[#1CC88A]/18 text-white" : "text-white/76 hover:bg-white/8 hover:text-white",
                ].join(" ")}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => {
  return (
    <div className="block text-sm font-semibold text-white/86">
      <span>{label}</span>
      {children}
      {error && <span className="mt-2 block text-xs font-semibold text-red-200">{error}</span>}
    </div>
  );
};

export default FormularioLeads;

import { FormEvent, ReactNode, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { z } from "zod";
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
import antesImage from "@/assets/antes.png";
import medicaRotinaImage from "@/assets/medica-rotina.png";
import implementacaoImage from "@/assets/implementação.png";
import depoisImage from "@/assets/depois.png";
import madrugadaTristeImage from "@/assets/madrugada-triste.png";
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
  { icon: Wallet, title: "Mais previsibilidade financeira", text: "Entradas, faltas e gargalos visíveis para decidir com clareza." },
  { icon: Clock3, title: "Menos tarefas operacionais", text: "Rotinas repetitivas deixam de depender de cobrança manual." },
  { icon: CalendarCheck, title: "Agenda organizada", text: "Confirmações e encaixes ficam mais simples para a equipe." },
  { icon: Users, title: "Equipe mais produtiva", text: "Cada pessoa entende prioridades, pendências e próximos passos." },
  { icon: Stethoscope, title: "Atendimento moderno", text: "O paciente percebe mais fluidez antes, durante e depois da consulta." },
  { icon: TrendingUp, title: "Menos faltas e atrasos", text: "Comunicação e automações reduzem perdas na agenda." },
];

const lifestyleHighlights = [
  { value: "Menos pendências", text: "Prontuários, retornos e mensagens passam a ter fluxo claro." },
  { value: "Mais previsibilidade", text: "A operação deixa de depender de improviso no fim do dia." },
];

const floatingCards = [
  "IA organizando prontuários automaticamente",
  "WhatsApp automatizado",
  "Controle financeiro inteligente",
  "Agenda sincronizada em tempo real",
];

const floatingCardPositions = [
  { text: "IA organizando prontuários automaticamente", className: "lg:-left-6 lg:top-6 xl:-left-10" },
  { text: "WhatsApp automatizado", className: "lg:-right-7 lg:top-14 xl:-right-10" },
  { text: "Controle financeiro inteligente", className: "lg:-left-2 lg:bottom-14 xl:-left-8" },
  { text: "Agenda sincronizada em tempo real", className: "lg:-right-2 lg:bottom-6 xl:-right-8" },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Diagnóstico da operação clínica",
    text: "Entendemos como sua equipe atende, registra e acompanha pacientes.",
  },
  {
    icon: Sparkles,
    title: "Implementação inteligente",
    text: "Configuramos fluxos, templates e módulos para a sua realidade.",
  },
  {
    icon: Bot,
    title: "Automação da rotina",
    text: "WhatsApp, agenda e prontuário passam a operar em conjunto.",
  },
  {
    icon: LineChart,
    title: "Acompanhamento estratégico",
    text: "Indicadores claros para decidir com mais rapidez e segurança.",
  },
];
const platformModules = [
  { icon: Users, title: "Gestão de pacientes", text: "Pacientes, atendimentos e histórico centralizados." },
  { icon: Stethoscope, title: "Atendimento e consultas", text: "Consultas, procedimentos, evolução e documentos." },
  { icon: CalendarCheck, title: "Gestão de agenda", text: "Consultas, horários, sala de espera e lembretes." },
  { icon: Wallet, title: "Financeiro", text: "Contas, faturamento, previsão e controle do caixa." },
  { icon: MessageCircle, title: "CRM e relacionamento", text: "Comunicação com pacientes e automações de contato." },
  { icon: Activity, title: "Ambulâncias", text: "Gestão de ambulâncias e operação assistencial." },
  { icon: LineChart, title: "Relatórios", text: "Analytics, KPIs e indicadores para decisão." },
  { icon: ShieldCheck, title: "Administração", text: "Configurações internas, usuários, segurança e permissões." },
  { icon: Sparkles, title: "Recursos extras", text: "Integrações, ferramentas e funcionalidades avançadas." },
];

const includedFeatures = [
  "Transcrição inteligente com IA",
  "Easy GPT com AutoPrompt",
  "Identificação de deficiências nutricionais",
  "Analisador de dosagens",
  "Assistente de diagnóstico",
  "Resumo do histórico do paciente",
  "Agente de recomendação de prescrição",
  "Agente de recomendação de pedido de exames",
  "Agente de recomendação de planos alimentares",
  "Assinatura com certificado digital",
  "Exames laboratoriais com extração automática e gráficos evolutivos",
  "Extração automática de bioimpedância",
  "Relatórios e lista de tarefas",
  "Agenda PRO com salas, histórico e sala de espera",
  "Link para agendamentos",
  "Envio rápido de documentos via WhatsApp",
  "Easy Patient, aplicativo do paciente",
  "Módulo financeiro",
  "Lâminas educativas",
  "Plano alimentar com modelos exclusivos",
];

const pricingPlans = [
  {
    name: "Single",
    price: "R$ 200,00",
    period: "/mês",
    audience: "Médicos individuais",
    button: "Escolher plano",
    featured: false,
    features: ["1 clínica", "Até 2 usuários", "Até 8.000 pacientes", "Oswald AI com 10 créditos", "Suporte completo incluso na assinatura"],
  },
  {
    name: "Pro Max",
    price: "R$ 597,00",
    period: "/mês",
    audience: "Clínicas em crescimento",
    button: "Escolher plano",
    featured: true,
    features: [
      "Até 2 clínicas",
      "Até 3 usuários",
      "Até 15.000 pacientes",
      "Oswald AI com 50 créditos",
      "Secretária IA inclusa com configuração grátis",
      "Suporte completo incluso na assinatura",
      "Importação de dados antigos inclusa",
    ],
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    audience: "Operações maiores e clínicas estruturadas",
    button: "Falar com vendas",
    featured: false,
    features: [
      "Mais clínicas sob demanda",
      "Mais usuários sob demanda",
      "Mais pacientes por clínica",
      "Mais créditos do Oswald AI",
      "Suporte completo prioritário",
      "Importação de dados antigos inclusa",
    ],
  },
];

const pricingComparisonGroups = [
  {
    title: "Capacidade do plano",
    rows: [
      { label: "Clínicas", values: ["1 clínica", "Até 2 clínicas", "Sob demanda"] },
      { label: "Usuários", values: ["Até 2", "Até 3", "Sob demanda"] },
      { label: "Pacientes", values: ["Até 8.000", "Até 15.000", "Por clínica"] },
      { label: "Oswald AI", values: ["10 créditos", "50 créditos", "Mais créditos"] },
      { label: "Secretaria IA", values: [false, "Inclusa", "Personalizada"] },
      { label: "Suporte completo", values: [true, true, "Prioritário"] },
      { label: "Importação de dados antigos", values: [false, true, true] },
    ],
  },
  {
    title: "Módulos da plataforma",
    rows: platformModules.map((module) => ({ label: module.title, description: module.text, values: [true, true, true] })),
  },

];
const faqs = [
  {
    question: "A Prontofy serve para médico individual e para clínicas?",
    answer: "Sim. O plano Single atende médicos individuais, enquanto Pro Max e Enterprise foram pensados para clínicas, equipes e operações com mais volume.",
  },
  {
    question: "A Secretária IA está inclusa?",
    answer: "No Pro Max ela já aparece inclusa com configuração grátis. Para operações maiores, a configuração pode ser ajustada conforme o fluxo da clínica.",
  },
  {
    question: "Consigo importar dados antigos?",
    answer: "Sim. A importação de dados antigos está prevista nos planos Pro Max e Enterprise para facilitar a transição sem perder histórico.",
  },
  {
    question: "O que o Oswald AI faz na rotina?",
    answer: "Ele apoia transcrição, resumo de histórico, diagnóstico, prescrições, pedidos de exames, planos alimentares e análises clínicas com IA.",
  },
  {
    question: "Preciso contratar suporte separado?",
    answer: "Não. O suporte completo está incluso na assinatura, com atendimento prioritário para operações Enterprise.",
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

const LeadsSchema = z.object({
  nome: z.string().trim().min(1, "Informe seu nome completo.").max(120, "Nome muito longo."),
  email: z.string().trim().min(1, "Informe seu email.").email("Informe um email válido.").max(160, "Email muito longo."),
  numero: z.string().trim().min(1, "Informe seu telefone ou WhatsApp.").max(32, "Número muito longo."),
  estado: z.string().min(1, "Selecione seu estado.").refine(val => ESTADOS.includes(val), "Selecione seu estado."),
  maior_dor: z.string().min(1, "Selecione sua maior dor."),
  outro_txt: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.maior_dor === "Outra" && (!data.outro_txt || !data.outro_txt.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Descreva o motivo.",
      path: ["outro_txt"],
    });
  }
});

const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, top - 12), behavior: "smooth" });
};

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
    const result = LeadsSchema.safeParse(formData);
    if (!result.success) {
      const nextErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof Omit<FormState, "website">;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return false;
    }
    setErrors({});
    return true;
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
      const webhookBase = (import.meta.env.VITE_N8N_WEBHOOK_URL || "/webhook").replace(/\/$/, "");
      const response = await fetch(`${webhookBase}/relacionamento`, {
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
      <section className="relative isolate min-h-screen overflow-hidden px-5 pb-14 pt-5 sm:px-8 md:pb-0 lg:px-10">
        <div className="absolute inset-0 bg-[#050709]" />
        <div className="absolute inset-x-0 top-0 md:inset-0 overflow-hidden">
          <img
            src={solucaoDeGestao}
            alt=""
            className="z-10 relative left-1/2 top-0 h-auto w-[150%] max-w-none -translate-x-1/2 object-contain opacity-76 sm:w-[126%] sm:opacity-78 md:absolute md:inset-0 md:left-0 md:h-full md:w-full md:translate-x-0 md:object-cover md:object-[48%_50%] md:opacity-80 xl:object-center"
          />
          <div className="z-10 absolute bottom-0 inset-x-0 h-24 md:h-36 bg-gradient-to-t from-[#050709] to-transparent" />
          <div className="z-10 absolute bottom-0 inset-x-0 h-full bg-gradient-to-t from-[#050709] to-transparent md:hidden" />
        </div>
        <div className="absolute z-10 left-1/2 top-[26%] h-[40vh] w-[calc(100%+140px)] -translate-x-1/2 bg-[#050709]/88 blur-[56px] md:hidden" />
        <div className="absolute z-10 inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.2)_0%,rgba(5,7,9,0.16)_28%,rgba(5,7,9,0.5)_62%,rgba(5,7,9,0.88)_100%)] md:hidden" />
        <div className="absolute z-10 inset-0 bg-[radial-gradient(circle_at_22%_42%,rgba(28,200,138,0.15),transparent_30%),radial-gradient(circle_at_78%_24%,rgba(30,136,229,0.12),transparent_34%)]" />


        <div className="relative z-10 mx-auto flex max-w-7xl justify-center pt-1 md:absolute md:left-1/2 md:top-10 md:-translate-x-1/2 md:pt-0">
          <ProntofyLogo />
        </div>
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl grid-cols-1 items-start gap-7 pt-14 sm:pt-20 md:min-h-screen md:grid-cols-[minmax(0,0.96fr)_minmax(420px,0.78fr)] md:items-center md:gap-10 md:pt-24 lg:gap-16 xl:max-w-[1280px]">
          <div className="lead-enter w-full max-w-[680px] md:max-w-none">
            <div className="max-w-[640px] md:ml-0">
              <h1 className="text-[2.1rem] font-extrabold leading-[1.02] sm:text-5xl lg:text-[3.2rem] xl:text-[3.55rem]">
                Solução de gestão para clínicas{" "}
                <span className="text-[#1CC88A]">modernas e inteligentes</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-white/82 sm:text-lg lg:text-xl lg:leading-8">
                Nossos Consultores Executivos vão ajudar você a ter mais faturamento e qualidade de vida com o seu consultório, solicite sua consultoria.
              </p>
              <button
                type="button"
                onClick={() => scrollToElement("dor-clinica")}
                className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-white/88 transition hover:text-[#1CC88A] sm:text-base"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/8 backdrop-blur">
                  <ArrowDown className="h-5 w-5" />
                </span>
                Quero saber mais
              </button>
            </div>
          </div>

          <div className="relative z-20 w-full max-w-full justify-self-center sm:max-w-[500px] md:max-w-[500px] md:justify-self-end lg:max-w-[540px] xl:max-w-[560px]">
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
      <PricingSection />
      <FAQSection />
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
    className="lead-enter lead-enter-delay-2 mx-auto w-full max-w-full rounded-[1.125rem] border border-white/10 bg-[#252525]/76 p-5 text-white shadow-[0_30px_90px_rgba(0,0,0,0.44)] backdrop-blur-xl sm:max-w-[500px] sm:rounded-[1.35rem] sm:p-6 md:max-w-[500px] lg:max-w-[540px] lg:p-7 xl:max-w-[560px]"
  >
    <div className="mb-5">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#1CC88A] sm:text-xs">Diagnóstico Prontofy</p>
      <h2 className="mt-1.5 text-lg font-extrabold leading-tight text-white sm:text-[1.35rem] lg:text-[1.3rem]">
        Fale com um especialista
      </h2>
      <p className="mt-1.5 text-xs leading-5 text-white/62 sm:text-sm">
        Preencha os dados para receber uma análise da operação da sua clínica.
      </p>
    </div>

    <div className="grid gap-4 lg:gap-3.5">
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

      <label className="mt-0.5 flex items-center gap-3 text-xs font-semibold leading-5 text-white/82 sm:text-sm">
        <input
          id="ofertas_ex"
          name="ofertas_ex"
          type="checkbox"
          checked={formData.ofertas_ex}
          onChange={(event) => updateField("ofertas_ex", `${event.target.checked}`)}
          className="h-4 w-4 rounded border border-white/30 bg-transparent text-[#1CC88A] focus:ring-2 focus:ring-[#1CC88A]/60"
        />
        Quero receber ofertas e promoções
      </label>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-full bg-[#1CC88A] px-5 py-2.5 text-sm font-extrabold text-[#04110b] shadow-[0_18px_44px_rgba(28,200,138,0.32)] transition hover:bg-[#35df91] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
      Falar com um especialista
    </button>

    <p className="mt-5 text-[0.7rem] leading-5 text-white/58 sm:text-xs">
      Ao enviar, você concorda em receber contato da Prontofy para entender sua operação clínica e apresentar uma solução adequada.
    </p>

    {isSuccess && (
      <p className="mt-4 flex items-start gap-2 rounded-xl border border-[#1CC88A]/30 bg-[#1CC88A]/12 p-3 text-sm font-semibold text-white">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1CC88A]" />
        Obrigado! Suas informações foram enviadas com sucesso.
      </p>
    )}

    {status === "error" && (
      <p className="mt-4 rounded-xl border border-red-300/30 bg-red-500/12 p-3 text-sm font-semibold text-red-100">
        Não foi possível enviar suas informações. Tente novamente.
      </p>
    )}
  </form>
);

const PainSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const moveCarousel = useCallback((direction: 1 | -1) => {
    const container = scrollRef.current;
    const child = container?.firstElementChild as HTMLElement | null;
    if (!container || !child) return;

    const gap = 16;
    const step = child.clientWidth + gap;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const isAtStart = container.scrollLeft <= 5;
    const isAtEnd = container.scrollLeft >= maxScroll - 5;

    if (direction > 0 && isAtEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction < 0 && isAtStart) {
      container.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    container.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let intervalId = window.setInterval(() => {
      if (isCarouselPaused) return;
      moveCarousel(1);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [isCarouselPaused, moveCarousel]);

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

        <div
          className="relative overflow-hidden px-1 py-3 sm:px-4"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          onFocus={() => setIsCarouselPaused(true)}
          onBlur={() => setIsCarouselPaused(false)}
          onTouchStart={() => setIsCarouselPaused(true)}
          onTouchEnd={() => setIsCarouselPaused(false)}
        >
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {painStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.text} className="min-h-[190px] flex-[0_0_84vw] snap-center rounded-2xl border border-emerald-300/14 bg-white/[0.055] p-6 shadow-[0_0_54px_rgba(28,200,138,0.08)] backdrop-blur sm:flex-[0_0_46%] lg:flex-[0_0_47%]">
                  <Icon className="h-6 w-6 text-[#b8b8b8]" />
                  <p className="mt-6 text-3xl font-extrabold text-[#ff4d4d]">{stat.value}</p>
                  <p className="mt-3 text-sm leading-6 text-white/66">{stat.text}</p>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => moveCarousel(-1)}
            aria-label="Card anterior"
            className="absolute left-1 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-[#050709]/72 text-white shadow-[0_16px_38px_rgba(0,0,0,0.28)] backdrop-blur transition hover:border-emerald-300/36 hover:bg-white/10 hover:text-emerald-300 sm:left-3"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => moveCarousel(1)}
            aria-label="Próximo card"
            className="absolute right-1 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-[#050709]/72 text-white shadow-[0_16px_38px_rgba(0,0,0,0.28)] backdrop-blur transition hover:border-emerald-300/36 hover:bg-white/10 hover:text-emerald-300 sm:right-3"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

const LifestyleSection = () => (
  <section className="relative min-h-[720px] overflow-hidden bg-[#050709] text-white sm:min-h-[760px] lg:min-h-[820px]">
    <img
      src={madrugadaTristeImage}
      alt="Médico trabalhando até tarde em um consultório"
      className="absolute inset-0 h-full w-full object-cover object-[58%_50%] sm:object-center"
    />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.9)_0%,rgba(5,7,9,0.64)_44%,rgba(5,7,9,0.14)_100%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.22)_0%,rgba(5,7,9,0.12)_45%,rgba(5,7,9,0.82)_100%)]" />
    <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,#050709_0%,rgba(5,7,9,0)_100%)]" />
    <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(5,7,9,0)_0%,#050709_100%)]" />

    <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-end px-5 py-14 sm:min-h-[760px] sm:px-8 sm:py-16 lg:min-h-[820px] lg:px-10 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">Qualidade de vida</p>
        <h2 className="mt-4 text-[clamp(36px,4.6vw,64px)] font-extrabold leading-[0.98] text-white drop-shadow-[0_14px_40px_rgba(0,0,0,0.62)]">
          Sua clínica não precisa acompanhar você até em casa.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/78 drop-shadow-[0_10px_26px_rgba(0,0,0,0.62)] sm:text-lg sm:leading-8">
          Mensagens até tarde, prontuários pendentes e decisões no improviso drenam energia. A Prontofy devolve controle, tranquilidade e organização para uma rotina mais leve.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {lifestyleHighlights.map((item) => (
            <div key={item.value} className="border-l-2 border-emerald-300/80 pl-4">
              <h3 className="text-base font-extrabold text-white">{item.value}</h3>
              <p className="mt-1 text-sm leading-6 text-white/68">{item.text}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToElement("form-contato")}
          className="scroll-smooth mt-9 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1CC88A] px-6 py-3.5 text-sm font-extrabold text-[#04110b] shadow-[0_18px_44px_rgba(28,200,138,0.28)] transition hover:bg-[#35df91] sm:w-auto"
        >
          Recuperar controle da rotina
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  </section>
);

const BenefitsSection = () => (
  <section className="relative overflow-hidden bg-[#050709] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(30,136,229,0.14),transparent_32%),radial-gradient(circle_at_78%_78%,rgba(28,200,138,0.12),transparent_30%)]" />
    <div className="relative mx-auto max-w-7xl">
      <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-[680px] pb-2 pt-2 lg:max-w-none lg:py-12">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur">
              <img src={medicaRotinaImage} alt="Médica organizando a rotina clínica com tecnologia" className="aspect-[4/3] w-full rounded-xl object-cover sm:aspect-[16/11] lg:aspect-[4/3]" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article key={benefit.title} className="rounded-xl border border-white/10 bg-[#0b1622]/86 p-4 shadow-[0_18px_54px_rgba(0,0,0,0.24)] backdrop-blur">
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-300/12 text-emerald-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3 text-sm font-extrabold leading-tight text-white">{benefit.title}</h3>
                    <p className="mt-1.5 text-xs font-medium leading-5 text-white/58">{benefit.text}</p>
                  </article>
                );
              })}
            </div>

            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const positions = [
                  "-left-5 top-3 xl:-left-10",
                  "right-4 top-0 xl:-right-4",
                  "-left-8 top-1/2 -translate-y-1/2 xl:-left-14",
                  "-right-7 top-[43%] xl:-right-12",
                  "left-8 bottom-0 xl:left-3",
                  "right-8 bottom-3 xl:right-2",
                ];
                return (
                  <article
                    key={benefit.title}
                    className={`absolute w-[230px] rounded-xl border border-white/12 bg-[#071725]/88 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.36)] backdrop-blur-xl ${positions[index]}`}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-300/12 text-emerald-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-3 text-sm font-extrabold leading-tight text-white">{benefit.title}</h3>
                    <p className="mt-1.5 text-xs font-medium leading-5 text-white/58">{benefit.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Benefícios reais</p>
          <h2 className="mt-4 text-[clamp(32px,3.8vw,46px)] font-extrabold leading-tight">
            Tecnologia que aparece na rotina, no caixa e no atendimento.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            A operação fica mais previsível quando agenda, atendimento, equipe e indicadores trabalham no mesmo fluxo.
          </p>
          <button
            type="button"
            onClick={() => scrollToElement("form-contato")}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1CC88A] px-5 py-3.5 text-sm font-extrabold text-[#04110b] shadow-[0_18px_44px_rgba(28,200,138,0.28)] transition hover:bg-[#35df91] sm:w-auto"
          >
            Ver como aplicar na minha clínica
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </section>
);

const DevicesSection = () => (
  <section className="relative overflow-hidden bg-[#050709] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(28,200,138,0.18),transparent_32%)]" />
    <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">Ecossistema visual</p>
        <h2 className="mt-4 max-w-2xl text-[clamp(32px,3.8vw,46px)] font-extrabold leading-tight">
          Um ecossistema visual para administrar sua clínica em tempo real.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
          Dashboards, agenda e finanças com visão integrada para decidir mais rápido, sem perder o controle do atendimento.
        </p>
      </div>

      <div className="relative flex flex-col-reverse gap-10 lg:gap-12">
        <div className="rounded-2xl border border-white/12 bg-white/[0.055] p-4 shadow-[0_34px_100px_rgba(0,0,0,0.4)] backdrop-blur lg:ml-auto lg:max-w-[560px]">
          <img src={agendaIa} alt="Dashboard Prontofy em notebook, tablet e celular" className="w-full rounded-xl object-cover" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:hidden">
          {floatingCards.map((card) => (
            <span key={card} className="rounded-xl border border-white/10 bg-[#071725]/70 px-4 py-6 text-base font-semibold text-white/82 shadow-lg backdrop-blur ">
              {card}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {floatingCardPositions.map((card) => (
            <span
              key={card.text}
              className={`absolute rounded-xl border border-white/12 bg-[#071725]/70 px-4 py-3 text-sm font-semibold text-white/82 shadow-lg backdrop-blur  ${card.className}`}
            >
              {card.text}
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
    <div className="relative mx-auto max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-14">
        <div className="lg:sticky lg:top-10">
          <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-emerald-300">
            Diferencial Prontofy
          </span>
          <h2 className="mt-4 text-[clamp(34px,4vw,54px)] font-extrabold leading-tight">
            Tudo que a clínica precisa em uma operação conectada.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/70">
            Pacientes, agenda, financeiro, CRM, relatórios, administração e recursos de IA trabalhando no mesmo ambiente para reduzir retrabalho e acelerar decisões.
          </p>
          <button
            type="button"
            onClick={() => scrollToElement("form-contato")}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1CC88A] px-6 py-3.5 text-sm font-extrabold text-[#04110b] shadow-[0_18px_44px_rgba(28,200,138,0.28)] transition hover:bg-[#35df91] sm:w-auto"
          >
            Quero ver na minha clínica
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {platformModules.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="min-h-[154px] rounded-xl border border-white/10 bg-[#0b1622]/86 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur transition hover:border-emerald-300/28 hover:bg-white/[0.075]">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-300/12 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/62">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

const PRICING_CHECKOUT_URL = "https://prontofy.com.br/pricing";

const PricingSection = () => (
  <section id="planos" className="relative overflow-hidden bg-[#050709] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#050709_0%,#071725_42%,#050709_100%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(28,200,138,0.16),transparent_30%),radial-gradient(circle_at_84%_28%,rgba(30,136,229,0.15),transparent_34%),radial-gradient(circle_at_48%_92%,rgba(28,200,138,0.10),transparent_34%)]" />
    <div className="relative mx-auto max-w-7xl">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-300">
          Comparativo de planos
        </span>
        <h2 className="mt-5 text-[clamp(34px,4vw,54px)] font-extrabold leading-tight text-white">
          Compare recursos, limites e inteligência em cada plano.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
          Uma visão direta para entender o que cada plano entrega em gestão, atendimento, agenda, financeiro e IA.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#07111a]/78 shadow-[0_34px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl">
        <div className="overflow-x-auto [scrollbar-width:thin] [scrollbar-color:#1CC88A_rgba(255,255,255,0.08)]">
          <div className="min-w-[760px] lg:min-w-[980px]">
            <div className="grid grid-cols-[minmax(210px,0.95fr)_repeat(3,minmax(150px,0.72fr))] lg:grid-cols-[minmax(290px,1.1fr)_repeat(3,minmax(190px,0.75fr))] border-b border-white/10 bg-white/[0.035]">
              <div className="flex min-h-[160px] flex-col justify-center p-4 sm:min-h-[190px] sm:p-5 lg:min-h-[230px] lg:justify-end lg:p-6">
                <p className="text-[0.64rem] font-black uppercase tracking-[0.16em] text-emerald-300 sm:text-xs sm:tracking-[0.18em]">Recursos Prontofy</p>
                <p className="mt-2 max-w-[170px] text-xs font-semibold leading-5 text-white/58 sm:max-w-none sm:text-sm sm:leading-6">Clique em qualquer plano para ir ao checkout.</p>
              </div>
              {pricingPlans.map((plan) => (
                <a
                  key={plan.name}
                  href={PRICING_CHECKOUT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={`group relative flex min-h-[160px] flex-col justify-between border-l border-white/10 p-4 text-center transition hover:bg-white/[0.075] sm:min-h-[190px] sm:p-5 lg:min-h-[230px] lg:p-6 ${plan.featured ? "bg-emerald-300/[0.075]" : "bg-black/10"}`}
                >
                  {plan.featured && (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl bg-[#1CC88A] px-4 py-1.5 text-[0.68rem] font-black uppercase tracking-wide text-[#04110b] shadow-[0_16px_38px_rgba(28,200,138,0.24)]">
                      Mais popular
                    </span>
                  )}
                  <div className="pt-4 lg:pt-5">
                    <h3 className="text-base font-black uppercase text-white sm:text-lg lg:text-xl">{plan.name}</h3>
                    <p className="mt-3 text-[1.45rem] font-black leading-none text-white sm:text-[1.7rem] lg:mt-4 lg:text-[2rem]">{plan.price}</p>
                    {plan.period && <p className="mt-1 text-[0.68rem] font-black uppercase tracking-wide text-white/50">{plan.period}</p>}
                    <p className="mx-auto mt-3 max-w-[140px] text-[0.68rem] font-semibold leading-4 text-white/58 sm:max-w-[160px] sm:text-xs sm:leading-5 lg:mt-4">{plan.audience}</p>
                  </div>
                  <span className={`mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-[0.65rem] font-black uppercase tracking-wide transition sm:min-h-11 sm:rounded-xl sm:px-4 sm:text-xs lg:mt-5 ${plan.featured ? "bg-[#1CC88A] text-[#04110b] group-hover:bg-[#35df91]" : "border border-white/12 bg-white/[0.06] text-white group-hover:border-emerald-300/30"}`}>
                    {plan.button}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              ))}
            </div>

            {pricingComparisonGroups.map((group) => (
              <div key={group.title}>
                <div className="border-b border-white/10 bg-[#1CC88A]/10 px-5 py-3">
                  <p className="text-[0.64rem] font-black uppercase tracking-[0.16em] text-emerald-300 sm:text-xs sm:tracking-[0.18em]">{group.title}</p>
                </div>
                {group.rows.map((row) => (
                  <div key={row.label} className="grid min-h-[58px] grid-cols-[minmax(290px,1.1fr)_repeat(3,minmax(190px,0.75fr))] border-b border-white/10 transition hover:bg-white/[0.035]">
                    <div className="flex flex-col justify-center px-5 py-3">
                      <p className="text-sm font-extrabold leading-5 text-white">{row.label}</p>
                      {row.description && <p className="mt-1 text-xs font-medium leading-5 text-white/42">{row.description}</p>}
                    </div>
                    {row.values.map((value, index) => (
                      <div key={`${row.label}-${pricingPlans[index].name}`} className={`grid place-items-center border-l border-white/10 px-4 py-3 text-center ${pricingPlans[index].featured ? "bg-emerald-300/[0.045]" : ""}`}>
                        {value === true ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                        ) : value === false ? (
                          <span className="h-1.5 w-6 rounded-full bg-white/18" aria-label="Não incluso" />
                        ) : (
                          <span className="text-xs font-extrabold leading-5 text-white/78">{value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
const FAQSection = () => (
  <section className="relative overflow-hidden bg-[#071725] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#071725_0%,#050709_100%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(28,200,138,0.12),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(30,136,229,0.13),transparent_34%)]" />
    <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">FAQ</p>
        <h2 className="mt-4 text-[clamp(32px,3.8vw,46px)] font-extrabold leading-tight">Perguntas frequentes antes de escolher a Prontofy.</h2>
        <p className="mt-5 text-lg leading-8 text-white/68">Tire as principais dúvidas sobre planos, IA, suporte e implantação antes de conversar com um especialista.</p>
      </div>
      <div className="grid gap-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="group rounded-xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur open:border-emerald-300/28 open:bg-white/[0.075]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold text-white">
              <span>{faq.question}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-emerald-300 transition group-open:rotate-180" />
            </summary>
            <p className="mt-4 text-sm leading-7 text-white/64">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
const HowItWorksSection = () => (
  <section className="relative min-h-[860px] overflow-hidden bg-[#050709] text-white sm:min-h-[900px] lg:min-h-[820px]">
    <img
      src={implementacaoImage}
      alt="Implementação acompanhada da Prontofy na rotina clínica"
      className="absolute inset-0 h-full w-full object-cover object-[42%_50%] lg:object-center"
    />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.9)_0%,rgba(5,7,9,0.58)_46%,rgba(5,7,9,0.18)_100%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,9,0.42)_0%,rgba(5,7,9,0.08)_42%,rgba(5,7,9,0.88)_100%)]" />
    <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,#050709_0%,rgba(5,7,9,0)_100%)]" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(5,7,9,0)_0%,#050709_100%)]" />

    <div className="relative z-10 mx-auto grid min-h-[860px] max-w-7xl gap-10 px-5 py-16 sm:min-h-[900px] sm:px-8 sm:py-20 lg:min-h-[820px] lg:grid-cols-[0.92fr_1.08fr] lg:items-end lg:px-10 lg:py-20">
      <div className="max-w-2xl self-start lg:self-end">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">Como funciona</p>
        <h2 className="mt-4 text-[clamp(38px,5vw,68px)] font-extrabold leading-[0.98] text-white drop-shadow-[0_16px_44px_rgba(0,0,0,0.64)]">
          Uma implementação clara, acompanhada e progressiva.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/76 drop-shadow-[0_10px_26px_rgba(0,0,0,0.62)] sm:text-lg sm:leading-8">
          A Prontofy entra na rotina da clínica com diagnóstico, configuração guiada e acompanhamento para sua equipe evoluir sem perder o controle.
        </p>
        <button
          type="button"
          onClick={() => scrollToElement("form-contato")}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1CC88A] px-6 py-3.5 text-sm font-extrabold text-[#04110b] shadow-[0_18px_44px_rgba(28,200,138,0.28)] transition hover:bg-[#35df91] sm:w-auto"
        >
          Quero implementar com a Prontofy
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-4 self-end lg:justify-self-end">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article
              key={step.title}
              className="relative flex gap-4 rounded-xl border border-white/12 bg-[#050709]/52 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.34)] backdrop-blur-md sm:p-5 lg:w-[520px]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-emerald-300/22 bg-emerald-300/12 text-emerald-300">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/42">Passo {index + 1}</p>
                <h3 className="mt-1 text-sm font-extrabold text-emerald-300 sm:text-base">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-white/66">{step.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
const BeforeAfterSection = () => {
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = mobileCarouselRef.current;
    if (!carousel) return;

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mediaQuery.matches || prefersReducedMotion.matches) return;

    let currentIndex = 0;
    const intervalId = window.setInterval(() => {
      const cards = Array.from(carousel.children) as HTMLElement[];
      if (cards.length < 2) return;

      currentIndex = (currentIndex + 1) % cards.length;
      carousel.scrollTo({ left: cards[currentIndex].offsetLeft, behavior: "smooth" });
    }, 2800);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#050709] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(28,200,138,0.12),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl">
        <h2 className="mx-auto max-w-3xl text-center text-[clamp(32px,3.8vw,46px)] font-extrabold leading-tight">
          Do operacional pesado para uma rotina inteligente.
        </h2>
        <div className="mt-12 hidden gap-5 lg:grid lg:grid-cols-2">
          <CompareCard image={antesImage} label="Antes" title="Sobrecarga e desorganização" items={["Atrasos e mensagens acumuladas", "Retrabalho administrativo", "Estresse operacional constante"]} />
          <CompareCard image={depoisImage} label="Depois" title="Controle, produtividade e qualidade de vida" items={["Dashboards inteligentes", "Automações e IA na rotina", "Equipe com clareza para executar"]} highlight />
        </div>
        <div
          ref={mobileCarouselRef}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 lg:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex min-w-[84vw] snap-center">
            <CompareCard image={antesImage} label="Antes" title="Sobrecarga e desorganização" items={["Atrasos e mensagens acumuladas", "Retrabalho administrativo", "Estresse operacional constante"]} />
          </div>
          <div className="flex min-w-[84vw] snap-center">
            <CompareCard image={depoisImage} label="Depois" title="Controle, produtividade e qualidade de vida" items={["Dashboards inteligentes", "Automações e IA na rotina", "Equipe com clareza para executar"]} highlight />
          </div>
        </div>
      </div>
    </section>
  );
};
const FinalCTASection = () => (
  <section className="relative overflow-hidden bg-[#050709] px-5 py-20 text-center sm:px-8 lg:px-10 lg:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(28,200,138,0.18),transparent_34%)]" />
    <div className="relative mx-auto max-w-3xl">
      <h2 className="text-[clamp(34px,4vw,54px)] font-extrabold leading-tight">Está na hora da sua clínica operar em outro nível.</h2>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
        Um diagnóstico direto para organizar agenda, equipe e finanças com clareza.
      </p>
      <button
        type="button"
        onClick={() => scrollToElement("form-contato")}
        className="mt-9 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#1CC88A] px-8 py-5 text-base font-extrabold uppercase tracking-wide text-[#04110b] shadow-[0_18px_52px_rgba(28,200,138,0.34)] transition hover:bg-[#35df91] sm:w-auto"
      >
        Quero minha análise estratégica
        <ArrowRight className="h-5 w-5" />
      </button>
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
    "mt-1.5 h-9 w-full rounded-none border-0 border-b bg-transparent px-0 text-sm font-medium text-white outline-none transition placeholder:text-white/48 sm:h-10",
    "focus:border-[#1CC88A] focus:ring-0",
    error ? "border-red-300" : "border-white/30",
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
    <div className="relative mt-1.5">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        className={[
          "flex h-10 w-full items-center justify-between rounded-none border-0 border-b bg-transparent px-0 text-left text-sm font-semibold outline-none transition",
          "focus:border-[#1CC88A] focus:ring-0",
          value ? "text-white" : "text-white/48",
          error ? "border-red-300" : "border-white/30",
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
          <div className="max-h-48 overflow-y-auto p-2 sm:max-h-56" role="listbox" aria-labelledby={id}>
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
                  "w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
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
    <div className="block text-[0.83rem] font-semibold text-white/86 sm:text-sm">
      <span>{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-red-200">{error}</span>}
    </div>
  );
};

export default FormularioLeads;

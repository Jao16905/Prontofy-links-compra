import { FormEvent, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Building2,
  Check,
  Clock3,
  CreditCard,
  MapPin,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import ProntofyLogo from "@/components/ProntofyLogo";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
const ESTABELECIMENTOS = ["Consultório individual", "Clínica", "Coworking"];
const TONS = ["Acolhedor", "Formal", "Premium", "Descontraído", "Técnico"];
const PAGAMENTOS = ["Pix", "Cartão", "Dinheiro", "Boleto", "Transferência"];
const ESPECIALIDADES = ["Clínica médica", "Cardiologia", "Dermatologia", "Pediatria", "Psiquiatria", "Ortopedia", "Outra"];
const DEFAULT_WELCOME_MESSAGE = "Olá, aqui é a secretária virtual da clínica X.";
const DEFAULT_PATIENT_QUESTIONS = "Nome, idade, motivo da consulta e queixa principal.";
const WHATSAPP_URL = "https://wa.me/message/YO6R73FVJZHTC1";
const N8N_WEBHOOK_URL = "https://teste-n8n-editor.6esqeg.easypanel.host/webhook-test/sec-de-ia";
const STEP_PROGRESS = [0, 40, 90];

type FlowStep = "inicio" | "formulario" | "sucesso";

type FormData = {
  nomeClinica: string;
  tipoEstabelecimento: string;
  endereco: string;
  referencia: string;
  diasFuncionamento: string[];
  horaInicio: string;
  horaFim: string;
  medicos: string;
  especialidades: string[];
  horariosProfissionais: string;
  tiposConsulta: string;
  duracaoConsulta: string;
  intervaloAtendimentos: string;
  permiteEncaixe: string;
  regrasEncaixe: string;
  valoresConsultas: string;
  formasPagamento: string[];
  convenios: string;
  tomComunicacao: string;
  boasVindas: string;
  confirmacaoConsulta: string;
  lembreteConsulta: string;
  observacoesComunicacao: string;
  perguntasIniciais: string;
  direcionamentoEspecialidade: string;
  regrasUrgencia: string;
  podeRemarcar: string;
  podeCancelar: string;
  tempoResposta: string;
  googleMaps: string;
  funcionalidadesExtras: string;
  cnpj: string;
  observacoesAdicionais: string;
};

const initialData: FormData = {
  nomeClinica: "",
  tipoEstabelecimento: "Clínica",
  endereco: "",
  referencia: "",
  diasFuncionamento: ["Seg", "Ter", "Qua", "Qui", "Sex"],
  horaInicio: "08:00",
  horaFim: "18:00",
  medicos: "",
  especialidades: [],
  horariosProfissionais: "",
  tiposConsulta: "",
  duracaoConsulta: "40 min",
  intervaloAtendimentos: "10 min",
  permiteEncaixe: "Sim",
  regrasEncaixe: "",
  valoresConsultas: "",
  formasPagamento: ["Pix", "Cartão"],
  convenios: "",
  tomComunicacao: "Acolhedor",
  boasVindas: DEFAULT_WELCOME_MESSAGE,
  confirmacaoConsulta: "",
  lembreteConsulta: "",
  observacoesComunicacao: "",
  perguntasIniciais: DEFAULT_PATIENT_QUESTIONS,
  direcionamentoEspecialidade: "",
  regrasUrgencia: "",
  podeRemarcar: "Sim",
  podeCancelar: "Sim",
  tempoResposta: "Até 2 minutos",
  googleMaps: "",
  funcionalidadesExtras: "",
  cnpj: "",
  observacoesAdicionais: "",
};

const stepMeta = [
  { title: "Consultório", icon: Building2, fields: ["nomeClinica", "tipoEstabelecimento", "endereco", "googleMaps", "diasFuncionamento", "horaInicio", "horaFim"] },
  { title: "Pagamentos", icon: CreditCard, fields: ["valoresConsultas", "formasPagamento", "convenios"] },
  { title: "Atendimento IA", icon: Bot, fields: ["tomComunicacao", "boasVindas", "perguntasIniciais", "podeRemarcar", "podeCancelar", "tempoResposta"] },
] as const;

const requiredFieldLabels: Partial<Record<keyof FormData, string>> = {
  nomeClinica: "nome da clínica ou consultório",
  endereco: "endereço completo ou link do Google Maps",
  googleMaps: "endereço completo ou link do Google Maps",
  valoresConsultas: "valores das consultas",
};

const ConfiguracaoSecretariaIA = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [flowStep, setFlowStep] = useState<FlowStep>("inicio");
  const [form, setForm] = useState<FormData>(initialData);
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(() => new Set());
  const [invalidFields, setInvalidFields] = useState<Set<keyof FormData>>(() => new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [progress, setProgress] = useState(0);
  const formStartRef = useRef<HTMLFormElement>(null);
  const StepIcon = stepMeta[currentStep].icon;

  const update = (field: keyof FormData, value: string | string[]) => {
    setTouchedFields((previous) => new Set(previous).add(field));
    setSubmitError("");
    setInvalidFields((previous) => {
      const next = new Set(previous);
      if (isFilled(value)) {
        next.delete(field);
        if (field === "endereco") next.delete("googleMaps");
        if (field === "googleMaps") next.delete("endereco");
      }
      return next;
    });

    setForm((previous) => {
      if (field === "nomeClinica" && typeof value === "string" && isDefaultWelcomeMessage(previous.boasVindas, previous.nomeClinica)) {
        return { ...previous, nomeClinica: value, boasVindas: getDefaultWelcomeMessage(value) };
      }

      return { ...previous, [field]: value };
    });
  };

  const toggleArray = (field: keyof FormData, value: string) => {
    const current = form[field];
    if (!Array.isArray(current)) return;
    update(field, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError("");

    const firstInvalidStep = getFirstInvalidStep(form);
    if (firstInvalidStep) {
      setCurrentStep(firstInvalidStep.index);
      setSubmitError(firstInvalidStep.message);
      setInvalidFields(new Set(firstInvalidStep.fields));
      scrollToQuestionsStart();
      return;
    }

    setInvalidFields(new Set());
    setIsSubmitting(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          formasPagamento: form.formasPagamento.join(", "),
          atendimentoIA: {
            tomComunicacao: form.tomComunicacao || initialData.tomComunicacao,
            boasVindas: form.boasVindas || getDefaultWelcomeMessage(form.nomeClinica),
            perguntasIniciais: form.perguntasIniciais || DEFAULT_PATIENT_QUESTIONS,
            podeRemarcar: form.podeRemarcar || initialData.podeRemarcar,
            podeCancelar: form.podeCancelar || initialData.podeCancelar,
            tempoResposta: form.tempoResposta || initialData.tempoResposta,
          },
          data_envio: new Date().toISOString(),
          origem: "configuracao-secretaria-ia",
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar configuração");
      }

      setProgress(100);
      setFlowStep("sucesso");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setProgress(90);
      setSubmitError("Não foi possível enviar sua configuração. Tente novamente.");
      scrollToQuestionsStart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToQuestionsStart = () => {
    window.requestAnimationFrame(() => {
      if (!formStartRef.current) return;
      const fixedHeaderOffset = 92;
      const top = formStartRef.current.getBoundingClientRect().top + window.scrollY - fixedHeaderOffset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  const goToStep = (step: number, shouldScroll = true) => {
    setSubmitError("");
    setInvalidFields(new Set());
    const nextStep = Math.max(0, Math.min(stepMeta.length - 1, step));
    setCurrentStep(nextStep);
    if (shouldScroll) {
      scrollToQuestionsStart();
    }
  };

  const goToNextStep = () => {
    const currentStepValidation = validateStep(currentStep, form);
    if (!currentStepValidation.isValid) {
      setSubmitError(currentStepValidation.message);
      setInvalidFields(new Set(currentStepValidation.fields));
      scrollToQuestionsStart();
      return;
    }

    setSubmitError("");
    setInvalidFields(new Set());
    if (currentStep === 0) {
      setProgress((currentProgress) => Math.max(currentProgress, 40));
    }
    if (currentStep === 1) {
      setProgress((currentProgress) => Math.max(currentProgress, 90));
    }
    goToStep(currentStep + 1);
  };

  const startConfiguration = () => {
    setFlowStep("formulario");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (flowStep === "inicio") {
    return <IntroScreen onStart={startConfiguration} />;
  }

  if (flowStep === "sucesso") {
    return <SuccessScreen clinicName={form.nomeClinica} />;
  }

  return (
    <main className="min-h-screen bg-[#06131f] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#06131f]/92 px-5 py-3 shadow-[0_16px_38px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <ProntofyLogo
            className="gap-2 sm:gap-2.5"
            iconClassName="h-7 w-7 sm:h-5 sm:w-5"
            textClassName="text-base sm:text-[0.85rem] font-light"
          />
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-10 pt-16 sm:px-8 lg:px-10 sm:pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(28,200,138,0.16),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(30,136,229,0.18),transparent_30%),linear-gradient(135deg,#071725_0%,#0b2339_48%,#06131f_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

        <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center">
          <form ref={formStartRef} onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl rounded-[2rem] border border-white/12 bg-[#111820]/88 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-6 lg:p-8">
              <div className="border-b border-white/10 pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1CC88A]">Checklist de configuração</p>
                <h2 className="mt-2 text-2xl font-extrabold">Dados da Secretária IA</h2>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold text-white/58">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#1CC88A] transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                {stepMeta.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === index;
                  const isDone = isStepComplete(index, form, touchedFields);
                  return (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => goToStep(index)}
                      className={`flex min-h-16 items-center justify-center gap-1.5 rounded-2xl border px-2 text-center text-[0.68rem] font-extrabold transition sm:gap-2 sm:px-3 sm:text-xs ${
                        isActive
                          ? "border-[#1CC88A] bg-[#1CC88A] text-[#06131f]"
                          : isDone
                            ? "border-[#1CC88A]/35 bg-[#1CC88A]/10 text-[#86f3c8]"
                            : "border-white/10 bg-white/[0.045] text-white/58 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      <span>{step.title}</span>
                    </button>
                  );
                })}
              </div>

              {submitError && (
                <div className="mt-4 rounded-2xl border border-red-400/35 bg-red-500/12 p-4 text-sm font-semibold text-white">
                  {submitError}
                </div>
              )}

              <div className="mt-7 rounded-[1.5rem] border border-white/10 bg-[#07111a]/72 p-5 sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1CC88A]/12 text-[#1CC88A]">
                    <StepIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white/45">Etapa {currentStep + 1} de {stepMeta.length}</p>
                    <h3 className="text-xl font-extrabold">{stepMeta[currentStep].title}</h3>
                  </div>
                </div>

                {currentStep === 0 && <ClinicStep form={form} update={update} toggleArray={toggleArray} invalidFields={invalidFields} />}
                {currentStep === 1 && <FinanceStep form={form} update={update} toggleArray={toggleArray} invalidFields={invalidFields} />}
                {currentStep === 2 && <ServiceStyleStep form={form} update={update} toggleArray={toggleArray} invalidFields={invalidFields} />}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => goToStep(currentStep - 1, false)}
                  disabled={currentStep === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 px-5 py-3 text-sm font-bold text-white/76 transition hover:border-white/24 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>

                {currentStep < stepMeta.length - 1 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1CC88A] px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-[#06131f] shadow-[0_16px_44px_rgba(28,200,138,0.28)] transition hover:bg-[#35df91]"
                  >
                    Proxima parte
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1CC88A] px-6 py-3 text-sm font-extrabold uppercase tracking-wide text-[#06131f] shadow-[0_16px_44px_rgba(28,200,138,0.28)] transition hover:bg-[#35df91]"
                  >
                    {isSubmitting ? "Enviando..." : "Salvar configuração"}
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
          </form>
        </div>
      </section>
    </main>
  );
};

const IntroScreen = ({ onStart }: { onStart: () => void }) => (
  <main className="min-h-screen overflow-hidden bg-[#06131f] text-white">
    <style>{`
      @keyframes prontofyFlow {
        0% { transform: translate3d(-18%, 10%, 0) rotate(0deg) scale(1); opacity: .58; }
        45% { transform: translate3d(12%, -8%, 0) rotate(12deg) scale(1.06); opacity: .82; }
        100% { transform: translate3d(-18%, 10%, 0) rotate(0deg) scale(1); opacity: .58; }
      }
      @keyframes prontofyGrid {
        0% { background-position: 0 0; }
        100% { background-position: 90px 90px; }
      }
    `}</style>
    <section className="relative grid min-h-screen place-items-center px-6 py-8">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#06131f_0%,#0b2339_48%,#071725_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:90px_90px] animate-[prontofyGrid_14s_linear_infinite]" />
      <div className="absolute left-[-18%] top-[10%] h-[72vh] w-[78vw] rounded-[45%] bg-[radial-gradient(circle_at_42%_48%,rgba(111,240,189,0.78),rgba(28,200,138,0.32)_28%,rgba(30,136,229,0.18)_48%,transparent_70%)] blur-3xl animate-[prontofyFlow_10s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,19,31,0.18)_0%,rgba(6,19,31,0.52)_52%,rgba(6,19,31,0.9)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <ProntofyLogo className="gap-3" iconClassName="h-12 w-12 sm:h-14 sm:w-14" textClassName="text-2xl sm:text-3xl font-light" />
        <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-[#1CC88A]/30 bg-[#1CC88A]/12 px-4 py-2 text-sm font-bold text-[#6ff0bd]">
          <Sparkles className="h-4 w-4" />
          Secretária IA Prontofy
        </div>
        <h1 className="mt-6 text-[clamp(2.4rem,7vw,5.4rem)] font-extrabold leading-[0.98]">
          Comece a configurar sua <span className="text-[#1CC88A]">secretária IA</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/76">
          Em poucos passos, a Prontofy entende seu consultório, formas de pagamento e estilo de atendimento para preparar uma IA pronta para falar com seus pacientes.
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-10 inline-flex items-center justify-center gap-3 rounded-xl bg-[#1CC88A] px-8 py-4 text-base font-extrabold uppercase tracking-wide text-[#06131f] shadow-[0_18px_52px_rgba(28,200,138,0.34)] transition hover:bg-[#35df91]"
        >
          Iniciar configuração
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  </main>
);

const SuccessScreen = ({ clinicName }: { clinicName: string }) => (
  <main className="min-h-screen bg-[#f4f8fb] text-[#06131f]">
    <header className="border-b border-[#0b2339]/10 bg-white px-5 py-3 shadow-[0_10px_28px_rgba(11,35,57,0.08)] sm:px-8">
      <ProntofyLogo
        className="gap-2 sm:gap-2.5"
        iconClassName="h-7 w-7 sm:h-5 sm:w-5"
        textClassName="text-base sm:text-[0.85rem] text-[#06131f] font-light"
      />
    </header>
    <section className="grid min-h-[calc(100vh-81px)] place-items-center px-6 py-10">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-[10px] border-[#1CC88A] text-[#1CC88A]">
          <Check className="h-14 w-14 stroke-[3]" />
        </div>
        <h1 className="mt-8 text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-tight text-[#0b2339]">
          Configuração concluída com sucesso!
        </h1>
        <div className="mx-auto mt-6 rounded-2xl border border-[#1CC88A]/28 bg-[#1CC88A]/10 p-6 text-lg font-medium leading-8 text-[#07583a]">
          Parabéns{clinicName ? `, ${clinicName}` : ""}. Em breve nossa equipe pode revisar os dados e ajudar você a ativar a sua Secretária IA.
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#1CC88A] px-8 py-4 text-base font-extrabold uppercase tracking-wide text-[#06131f] shadow-[0_18px_42px_rgba(28,200,138,0.28)] transition hover:bg-[#35df91] sm:w-auto"
        >
          <MessageCircle className="h-5 w-5" />
          Falar com a Prontofy
        </a>
      </div>
    </section>
  </main>
);

const ClinicStep = ({ form, update, toggleArray, invalidFields }: StepProps) => (
  <div className="grid gap-5">
    <div className="grid gap-4 sm:grid-cols-2">
      <Input icon={Building2} label="Nome da clínica ou consultório" value={form.nomeClinica} onChange={(value) => update("nomeClinica", value)} hasError={invalidFields.has("nomeClinica")} />
      <ChoiceGroup label="Tipo de estabelecimento" options={ESTABELECIMENTOS} value={form.tipoEstabelecimento} onChange={(value) => update("tipoEstabelecimento", value)} />
    </div>
    <Input icon={MapPin} label="Endereço completo" value={form.endereco} onChange={(value) => update("endereco", value)} hasError={invalidFields.has("endereco")} />
    <div className="grid gap-4 sm:grid-cols-2">
      <Input icon={MapPin} label="Link do Google Maps" value={form.googleMaps} onChange={(value) => update("googleMaps", value)} hasError={invalidFields.has("googleMaps")} />
      <Input icon={MapPin} label="Referência/localização" value={form.referencia} onChange={(value) => update("referencia", value)} />
    </div>
    <MultiChips label="Dias de funcionamento" options={DIAS} selected={form.diasFuncionamento} onToggle={(value) => toggleArray("diasFuncionamento", value)} />
    <div className="grid gap-4 sm:grid-cols-2">
      <Input icon={Clock3} label="Abre as" type="time" value={form.horaInicio} onChange={(value) => update("horaInicio", value)} />
      <Input icon={Clock3} label="Fecha as" type="time" value={form.horaFim} onChange={(value) => update("horaFim", value)} />
    </div>
  </div>
);

const AgendaStep = ({ form, update, toggleArray }: StepProps) => (
  <div className="grid gap-5">
    <Textarea label="Nome do médico ou médicos que atuam na clínica" value={form.medicos} onChange={(value) => update("medicos", value)} />
    <MultiChips label="Especialidades" options={ESPECIALIDADES} selected={form.especialidades} onToggle={(value) => toggleArray("especialidades", value)} />
    <Textarea label="Dias e horarios de atendimento de cada profissional" value={form.horariosProfissionais} onChange={(value) => update("horariosProfissionais", value)} />
    <div className="grid gap-4 sm:grid-cols-3">
      <Input label="Tipos de consulta" value={form.tiposConsulta} onChange={(value) => update("tiposConsulta", value)} />
      <SelectPill label="Duracao media" value={form.duracaoConsulta} options={["20 min", "30 min", "40 min", "50 min", "60 min"]} onChange={(value) => update("duracaoConsulta", value)} />
      <SelectPill label="Intervalo" value={form.intervaloAtendimentos} options={["Sem intervalo", "5 min", "10 min", "15 min", "20 min"]} onChange={(value) => update("intervaloAtendimentos", value)} />
    </div>
    <div className="grid gap-4 sm:grid-cols-[0.7fr_1.3fr]">
      <ChoiceGroup label="Permite encaixe?" options={["Sim", "Não"]} value={form.permiteEncaixe} onChange={(value) => update("permiteEncaixe", value)} />
      <Input label="Regras para encaixe" value={form.regrasEncaixe} onChange={(value) => update("regrasEncaixe", value)} />
    </div>
  </div>
);

const FinanceStep = ({ form, update, toggleArray, invalidFields }: StepProps) => (
  <div className="grid gap-5">
    <Input icon={CreditCard} label="Valores das consultas" value={form.valoresConsultas} onChange={(value) => update("valoresConsultas", value)} hasError={invalidFields.has("valoresConsultas")} />
    <MultiChips label="Formas de pagamento aceitas" options={PAGAMENTOS} selected={form.formasPagamento} onToggle={(value) => toggleArray("formasPagamento", value)} />
    <Textarea label="Convenios aceitos" value={form.convenios} onChange={(value) => update("convenios", value)} />
    <div className="grid gap-4 sm:grid-cols-2">
      <ChoiceGroup label="Pode cobrar sinal/adiantamento?" options={["Sim", "Não"]} value={form.permiteEncaixe} onChange={(value) => update("permiteEncaixe", value)} />
    </div>
  </div>
);

const ServiceStyleStep = ({ form, update }: StepProps) => (
  <div className="grid gap-5">
    <ChoiceGroup label="Estilo de atendimento desejado" options={TONS} value={form.tomComunicacao} onChange={(value) => update("tomComunicacao", value)} />
    <DefaultOrCustomText
      label="Mensagem de boas-vindas"
      defaultLabel="Mensagem padrão"
      customLabel="Mensagem personalizada"
      defaultValue={getDefaultWelcomeMessage(form.nomeClinica)}
      value={form.boasVindas}
      onChange={(value) => update("boasVindas", value)}
    />
    <div className="grid gap-4 sm:grid-cols-3">
      <ChoiceGroup label="Pode remarcar?" options={["Sim", "Não"]} value={form.podeRemarcar} onChange={(value) => update("podeRemarcar", value)} />
      <ChoiceGroup label="Pode cancelar?" options={["Sim", "Não"]} value={form.podeCancelar} onChange={(value) => update("podeCancelar", value)} />
      <SelectPill label="Tempo máximo de resposta" value={form.tempoResposta} options={["Até 1 minuto", "Até 2 minutos", "Até 5 minutos", "Até 10 minutos"]} onChange={(value) => update("tempoResposta", value)} />
    </div>
    <DefaultOrCustomText
      label="Perguntas iniciais ao paciente"
      defaultLabel="Perguntas padrão"
      customLabel="Perguntas personalizadas"
      defaultValue={DEFAULT_PATIENT_QUESTIONS}
      value={form.perguntasIniciais}
      onChange={(value) => update("perguntasIniciais", value)}
    />
  </div>
);

const CommunicationStep = ({ form, update }: StepProps) => (
  <div className="grid gap-5">
    <ChoiceGroup label="Tom de linguagem desejado" options={TONS} value={form.tomComunicacao} onChange={(value) => update("tomComunicacao", value)} />
    <Textarea label="Mensagem de boas-vindas" value={form.boasVindas} onChange={(value) => update("boasVindas", value)} />
    <div className="grid gap-4 sm:grid-cols-2">
      <Textarea label="Modelo de confirmação de consulta" value={form.confirmacaoConsulta} onChange={(value) => update("confirmacaoConsulta", value)} />
      <Textarea label="Modelo de lembrete de consulta" value={form.lembreteConsulta} onChange={(value) => update("lembreteConsulta", value)} />
    </div>
    <Textarea label="Observações sobre a comunicação com pacientes" value={form.observacoesComunicacao} onChange={(value) => update("observacoesComunicacao", value)} />
  </div>
);

const RulesStep = ({ form, update }: StepProps) => (
  <div className="grid gap-5">
    <Textarea label="Perguntas iniciais" value={form.perguntasIniciais} onChange={(value) => update("perguntasIniciais", value)} />
    <div className="grid gap-4 sm:grid-cols-2">
      <Textarea label="Direcionamento por especialidade" value={form.direcionamentoEspecialidade} onChange={(value) => update("direcionamentoEspecialidade", value)} />
      <Textarea label="Regras para identificação de urgência" value={form.regrasUrgencia} onChange={(value) => update("regrasUrgencia", value)} />
    </div>
    <div className="grid gap-4 sm:grid-cols-3">
      <ChoiceGroup label="Pode remarcar?" options={["Sim", "Não"]} value={form.podeRemarcar} onChange={(value) => update("podeRemarcar", value)} />
      <ChoiceGroup label="Pode cancelar?" options={["Sim", "Não"]} value={form.podeCancelar} onChange={(value) => update("podeCancelar", value)} />
      <SelectPill label="Tempo máximo de resposta" value={form.tempoResposta} options={["Até 1 minuto", "Até 2 minutos", "Até 5 minutos", "Até 10 minutos"]} onChange={(value) => update("tempoResposta", value)} />
    </div>
    <Input label="Link do Google Maps" value={form.googleMaps} onChange={(value) => update("googleMaps", value)} />
    <Textarea label="Outras funcionalidades desejadas" value={form.funcionalidadesExtras} onChange={(value) => update("funcionalidadesExtras", value)} />
  </div>
);

const ReviewStep = ({ form, update }: { form: FormData; update: (field: keyof FormData, value: string | string[]) => void }) => (
  <div className="grid gap-5">
    <div className="rounded-2xl border border-[#1CC88A]/24 bg-[#1CC88A]/10 p-5">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#86f3c8]">Resumo</p>
      <h4 className="mt-2 text-2xl font-extrabold">{form.nomeClinica || "Clínica ainda sem nome"}</h4>
      <p className="mt-2 text-white/68">
        {form.tipoEstabelecimento} com funcionamento de {form.horaInicio} as {form.horaFim}, tom {form.tomComunicacao.toLowerCase()} e resposta {form.tempoResposta.toLowerCase()}.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="CNPJ (opcional)" value={form.cnpj} onChange={(value) => update("cnpj", value)} />
      <Input label="Responsável" value={form.nomeClinica} onChange={() => undefined} readOnly />
    </div>
    <Textarea label="Observações adicionais" value={form.observacoesAdicionais} onChange={(value) => update("observacoesAdicionais", value)} />
  </div>
);

type StepProps = {
  form: FormData;
  update: (field: keyof FormData, value: string | string[]) => void;
  toggleArray: (field: keyof FormData, value: string) => void;
  invalidFields: Set<keyof FormData>;
};

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: typeof Building2;
  readOnly?: boolean;
  hasError?: boolean;
};

const Input = ({ label, value, onChange, type = "text", icon: Icon, readOnly, hasError }: FieldProps) => (
  <label className="block">
    <span className={`mb-2 block text-sm font-bold ${hasError ? "text-red-300" : "text-white/78"}`}>{label}</span>
    <span className={`flex items-center rounded-2xl border px-4 transition focus-within:border-[#1CC88A]/70 ${
      hasError ? "border-red-400/80 bg-red-500/10" : "border-white/10 bg-white/[0.055]"
    }`}>
      {Icon && <Icon className={`mr-3 h-4 w-4 ${hasError ? "text-red-300" : "text-white/38"}`} />}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        className={`min-h-12 w-full bg-transparent text-sm font-semibold text-white outline-none ${hasError ? "placeholder:text-red-200/55" : "placeholder:text-white/34"}`}
        placeholder={label}
      />
    </span>
  </label>
);

const Textarea = ({ label, value, onChange, readOnly, hasError }: Omit<FieldProps, "type" | "icon">) => (
  <label className="block">
    <span className={`mb-2 block text-sm font-bold ${hasError ? "text-red-300" : "text-white/78"}`}>{label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      readOnly={readOnly}
      rows={3}
      className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-[#1CC88A]/70 ${
        hasError ? "border-red-400/80 bg-red-500/10 placeholder:text-red-200/55" : "border-white/10 bg-white/[0.055] placeholder:text-white/34"
      }`}
      placeholder={label}
    />
  </label>
);

const DefaultOrCustomText = ({
  label,
  defaultLabel,
  customLabel,
  defaultValue,
  value,
  onChange,
}: {
  label: string;
  defaultLabel: string;
  customLabel: string;
  defaultValue: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const isDefault = value === defaultValue;

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-white/78">{label}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(defaultValue)}
          className={`rounded-full border px-4 py-2 text-sm font-extrabold transition ${
            isDefault ? "border-[#1CC88A] bg-[#1CC88A] text-[#06131f]" : "border-white/10 bg-white/[0.055] text-white/62 hover:text-white"
          }`}
        >
          {defaultLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange(isDefault ? "" : value)}
          className={`rounded-full border px-4 py-2 text-sm font-extrabold transition ${
            !isDefault ? "border-[#1CC88A] bg-[#1CC88A] text-[#06131f]" : "border-white/10 bg-white/[0.055] text-white/62 hover:text-white"
          }`}
        >
          {customLabel}
        </button>
      </div>

      {isDefault ? (
        <div className="rounded-2xl border border-[#1CC88A]/25 bg-[#1CC88A]/10 px-4 py-3 text-sm font-semibold leading-6 text-white/82">
          {defaultValue}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-[#1CC88A]/70 placeholder:text-white/34"
          placeholder={label}
        />
      )}
    </div>
  );
};

const ChoiceGroup = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) => (
  <div>
    <p className="mb-2 text-sm font-bold text-white/78">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full border px-4 py-2 text-sm font-extrabold transition ${
            value === option ? "border-[#1CC88A] bg-[#1CC88A] text-[#06131f]" : "border-white/10 bg-white/[0.055] text-white/62 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const MultiChips = ({ label, options, selected, onToggle }: { label: string; options: string[]; selected: string[]; onToggle: (value: string) => void }) => (
  <div>
    <p className="mb-2 text-sm font-bold text-white/78">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={`rounded-full border px-4 py-2 text-sm font-extrabold transition ${
            selected.includes(option) ? "border-[#1CC88A] bg-[#1CC88A] text-[#06131f]" : "border-white/10 bg-white/[0.055] text-white/62 hover:text-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const SelectPill = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-white/78">{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#111820] px-4 text-sm font-extrabold text-white outline-none transition focus:border-[#1CC88A]/70"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const isFilled = (value: string | string[]) => (Array.isArray(value) ? value.length > 0 : value.trim().length > 0);

const validateStep = (stepIndex: number, form: FormData) => {
  if (stepIndex === 0) {
    if (!isFilled(form.nomeClinica)) {
      return { isValid: false, message: `Preencha o campo ${requiredFieldLabels.nomeClinica}.`, fields: ["nomeClinica"] as Array<keyof FormData> };
    }

    if (!isFilled(form.endereco) && !isFilled(form.googleMaps)) {
      return { isValid: false, message: `Preencha o campo ${requiredFieldLabels.endereco}.`, fields: ["endereco", "googleMaps"] as Array<keyof FormData> };
    }
  }

  if (stepIndex === 1 && !isFilled(form.valoresConsultas)) {
    return { isValid: false, message: `Preencha o campo ${requiredFieldLabels.valoresConsultas}.`, fields: ["valoresConsultas"] as Array<keyof FormData> };
  }

  return { isValid: true, message: "", fields: [] as Array<keyof FormData> };
};

const getFirstInvalidStep = (form: FormData) => {
  for (let index = 0; index < stepMeta.length; index += 1) {
    const validation = validateStep(index, form);
    if (!validation.isValid) {
      return { index, message: validation.message, fields: validation.fields };
    }
  }

  return null;
};

const isStepComplete = (stepIndex: number, form: FormData, touchedFields: Set<keyof FormData>) => {
  if (stepIndex === 0) {
    const locationWasTouched = touchedFields.has("endereco") || touchedFields.has("googleMaps");
    return touchedFields.has("nomeClinica") && locationWasTouched && validateStep(stepIndex, form).isValid;
  }

  if (stepIndex === 1) {
    return touchedFields.has("valoresConsultas") && validateStep(stepIndex, form).isValid;
  }

  return stepMeta[stepIndex].fields.every((field) => {
    const typedField = field as keyof FormData;
    return touchedFields.has(typedField) && isFilled(form[typedField]);
  });
};

const getDefaultWelcomeMessage = (clinicName: string) => {
  const normalizedClinicName = clinicName.trim();
  return normalizedClinicName ? `Olá, aqui é a secretária virtual da ${normalizedClinicName}.` : DEFAULT_WELCOME_MESSAGE;
};

const isDefaultWelcomeMessage = (message: string, clinicName: string) =>
  message === DEFAULT_WELCOME_MESSAGE || message === getDefaultWelcomeMessage(clinicName);

export default ConfiguracaoSecretariaIA;

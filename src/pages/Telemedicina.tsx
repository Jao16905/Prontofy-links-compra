import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import ProntofyLogo from "@/components/ProntofyLogo";
import cardPatients from "@/assets/card-patients.jpg";

const WEBHOOK_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "/webhook";
const WEBHOOK_URL = `${WEBHOOK_BASE_URL}/telemedicina`;

type TelemedicineFormState = {
  nome: string;
  email: string;
  telefone: string;
  horaInicio: string;
  horaFim: string;
  especialidade: string;
  horasTelemedicina: string;
};

const initialFormState: TelemedicineFormState = {
  nome: "",
  email: "",
  telefone: "",
  horaInicio: "",
  horaFim: "",
  especialidade: "",
  horasTelemedicina: "",
};

const fields = [
  { field: "nome", label: "Qual é o seu nome?", type: "text", placeholder: "Seu nome completo" },
  { field: "email", label: "Qual é o melhor e-mail para contato?", type: "email", placeholder: "voce@consultorio.com" },
  { field: "telefone", label: "Qual é seu número de telefone ou WhatsApp?", type: "tel", placeholder: "(00) 00000-0000" },
  { field: "horaInicio", label: "A partir de que horas você poderia atender?", type: "time", placeholder: "" },
  { field: "horaFim", label: "Até que horas você poderia atender?", type: "time", placeholder: "" },
  { field: "especialidade", label: "Qual é a sua especialidade?", type: "text", placeholder: "Ex.: Psiquiatria, Dermatologia, Clínica médica" },
  { field: "horasTelemedicina", label: "Quantas horas por semana você atenderia por telemedicina?", type: "number", placeholder: "Ex.: 8" },
] as const;

const sections = [
  {
    title: "Dados de contato",
    description: "Para sabermos com quem nossa equipe vai falar.",
    fields: ["nome", "email", "telefone"],
  },
  {
    title: "Janela de atendimento",
    description: "Entenda em quais horários você poderia atender por telemedicina.",
    fields: ["horaInicio", "horaFim"],
  },
  {
    title: "Especialidade",
    description: "Ajuda a direcionar a experiência para a sua área médica.",
    fields: ["especialidade"],
  },
  {
    title: "Disponibilidade semanal",
    description: "Uma estimativa simples para mapear seu interesse inicial.",
    fields: ["horasTelemedicina"],
  },
] as const;

const getFieldConfig = (fieldName: keyof TelemedicineFormState) => fields.find((field) => field.field === fieldName)!;

const getFieldLayoutClass = (fieldName: keyof TelemedicineFormState) => {
  if (fieldName === "nome" || fieldName === "especialidade" || fieldName === "horasTelemedicina") {
    return "sm:col-span-2";
  }

  return "";
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());

const Telemedicina = () => {
  const [formData, setFormData] = useState<TelemedicineFormState>(initialFormState);
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const section = sections[currentStep];
  const progress = useMemo(() => {
    const answeredFields = fields.filter(({ field }) => formData[field].trim()).length;
    return Math.round((answeredFields / fields.length) * 100);
  }, [formData]);
  const isLastStep = currentStep === sections.length - 1;

  const validateCurrentStep = () => {
    for (const fieldName of section.fields) {
      const value = formData[fieldName].trim();
      const field = getFieldConfig(fieldName);

      if (!value) {
        setError(`Preencha: ${field.label}`);
        return false;
      }

      if (fieldName === "email" && !isValidEmail(value)) {
        setError("Informe um e-mail válido.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const goNext = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep((current) => Math.min(current + 1, sections.length - 1));
  };

  const goBack = () => {
    setError("");
    setCurrentStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateCurrentStep()) return;

    setStatus("submitting");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          origem: "card_telemedicina_com_ia",
          interesse: "inscricao_telemedicina",
          data_envio: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Webhook request failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError("Não foi possível enviar agora. Tente novamente em alguns instantes.");
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050709] text-white">
      <section className="relative isolate flex min-h-screen items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <img src={cardPatients} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-48" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#050709_0%,rgba(5,7,9,0.88)_44%,rgba(5,7,9,0.6)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(28,200,138,0.16),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(30,136,229,0.15),transparent_34%)]" />

        <div className="mx-auto grid w-full max-w-7xl gap-7 sm:gap-9 lg:grid-cols-[0.92fr_0.78fr] lg:items-center lg:gap-16">
          <div className="text-center lg:text-left">
            <ProntofyLogo />
            <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-emerald-300 sm:mt-10 sm:text-sm sm:tracking-[0.2em] lg:mt-12">Telemedicina com IA</p>
            <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(27px,7.6vw,58px)] font-extrabold leading-[1.04] lg:mx-0 lg:leading-[1]">
              Inscreva-se para ter acesso prioritário a telemedicina do prontofy.
        
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/72 sm:text-base sm:leading-7 lg:mx-0 lg:mt-6 lg:text-lg lg:leading-8">
              Faça seu cadastro e receba uma oferta exclusiva para participar da telemedicina da Prontofy. Aqui você pode receber tratamento e acesso exclusivos.
            </p>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-white/12 bg-[#071725]/88 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-6 lg:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(28,200,138,0.14),transparent_34%)]" />
            <div className="relative">
              {status === "success" ? (
                <div className="py-10 text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-300/12 text-emerald-300">
                    <CheckCircle2 className="h-8 w-8" />
                  </span>
                  <h2 className="mt-5 text-2xl font-extrabold">Interesse enviado</h2>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/64">
                    Recebemos seus sua inscrição, em breve nossa equipe podetá entrar em contato para ativa-lo na telemedicina da Prontofy.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300 sm:text-xs sm:tracking-[0.18em]">Formulário progressivo</p>
                      <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">Dados para inscrição</h2>
                    </div>
                    <span className="w-fit rounded-full border border-emerald-300/24 bg-emerald-300/10 px-3 py-1 text-sm font-black text-emerald-200">
                      {progress}%
                    </span>
                  </div>

                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#1CC88A] transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>

                  <form onSubmit={handleSubmit} className="mt-8">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/42 sm:text-xs sm:tracking-[0.16em]">
                        Etapa {currentStep + 1} de {sections.length}
                      </p>
                      <h3 className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl">{section.title}</h3>
                      <p className="mt-2 text-sm font-semibold leading-6 text-white/54">{section.description}</p>
                    </div>

                    <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5">
                      {section.fields.map((fieldName, fieldIndex) => {
                        const field = getFieldConfig(fieldName);

                        return (
                          <div key={field.field} className={getFieldLayoutClass(field.field)}>
                            <label htmlFor={field.field} className="block text-sm font-extrabold leading-tight text-white/86">
                              {field.label}
                            </label>
                            <input
                              id={field.field}
                              type={field.type}
                              min={field.type === "number" ? 1 : undefined}
                              value={formData[field.field]}
                              onChange={(event) => {
                                setError("");
                                setFormData((current) => ({ ...current, [field.field]: event.target.value }));
                              }}
                              placeholder={field.placeholder}
                              className="mt-2 h-12 w-full rounded-xl border border-white/12 bg-white/[0.065] px-4 text-base font-semibold text-white outline-none transition placeholder:text-white/36 focus:border-emerald-300/50 focus:bg-white/[0.09] sm:h-14"
                              autoFocus={fieldIndex === 0}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {error && <p className="mt-3 text-sm font-semibold text-red-200">{error}</p>}

                    <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-[auto_auto] sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={currentStep === 0 || status === "submitting"}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-4 text-sm font-bold text-white/74 transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                      </button>

                      {isLastStep ? (
                        <button
                          type="submit"
                          disabled={status === "submitting"}
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1CC88A] px-5 text-sm font-extrabold text-[#04110b] transition hover:bg-[#35df91] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                        >
                          {status === "submitting" ? (
                            <>
                              Enviando
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </>
                          ) : (
                            <>
                              Enviar interesse
                              <CheckCircle2 className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      ) : (
                        <button type="button" onClick={goNext} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1CC88A] px-5 text-sm font-extrabold text-[#04110b] transition hover:bg-[#35df91] sm:w-auto">
                          Próximo
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Telemedicina;

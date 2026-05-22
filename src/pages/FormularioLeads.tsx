import { FormEvent, ReactNode, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import ProntofyLogo from "@/components/ProntofyLogo";
import formularioBg from "@/assets/formulario-bg.jpg";

const N8N_WEBHOOK_URL = "https://teste-n8n-editor.6esqeg.easypanel.host/webhook-test/relacionamento";

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

type FormState = {
  nome: string;
  email: string;
  numero: string;
  estado: string;
  maior_dor: string;
  website: string;
};

type FormErrors = Partial<Record<keyof Omit<FormState, "website">, string>>;

const initialFormState: FormState = {
  nome: "",
  email: "",
  numero: "",
  estado: "",
  maior_dor: "",
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

  const payload = useMemo(
    () => ({
      nome: sanitizeText(formData.nome, 120),
      email: sanitizeText(formData.email, 160).toLowerCase(),
      numero: sanitizeText(formData.numero, 32),
      estado: sanitizeText(formData.estado, 40),
      maior_dor: sanitizeText(formData.maior_dor, 120),
      data_envio: new Date().toISOString(),
    }),
    [formData],
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
    if (!payload.maior_dor || !DORES.includes(payload.maior_dor)) nextErrors.maior_dor = "Selecione sua maior dor.";

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
      const response = await fetch(N8N_WEBHOOK_URL, {
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

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <main className="min-h-screen bg-[#050709] text-[#0b2339]">
      <section className="relative overflow-hidden px-5 py-10 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#050709_0%,#0b2339_36%,#0f3d42_62%,#0b2339_100%)]" />
        <img src={formularioBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,9,0.92)_0%,rgba(11,35,57,0.86)_42%,rgba(11,35,57,0.68)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_42%,rgba(28,200,138,0.22),transparent_34%),radial-gradient(circle_at_86%_12%,rgba(30,136,229,0.24),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,rgba(5,7,9,0)_0%,rgba(5,7,9,0.78)_100%)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lead-enter py-4 text-white">
            <ProntofyLogo />
            <div className="mt-12 max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white/80 shadow-sm backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-[#1CC88A]" />
                Aprimoramento de gestão para médicos
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Receba uma apresentação personalizada
              </h1>
              <p className="mt-5 text-lg leading-8 text-white/72">
                Conte um pouco sobre sua realidade e nossa equipe mostra como a Prontofy pode ajudar sua gestão a evoluir com mais clareza.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="lead-enter lead-enter-delay-2 rounded-2xl border border-white/70 bg-white p-5 shadow-[0_28px_80px_rgba(11,35,57,0.18)] sm:p-7 lg:p-8"
          >
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1E88E5]">Formulário</p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0b2339] sm:text-3xl">Dados para contato</h2>
            </div>

            <div className="grid gap-5">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(event) => updateField("website", event.target.value)}
                />
              </div>

              <Field label="Nome completo" error={errors.nome}>
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
                  placeholder="Digite seu nome"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" error={errors.email}>
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
                    placeholder="voce@email.com"
                  />
                </Field>

                <Field label="Número de telefone / WhatsApp" error={errors.numero}>
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
                    placeholder="(11) 99999-9999"
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Estado" error={errors.estado}>
                  <select
                    id="estado"
                    name="estado"
                    required
                    value={formData.estado}
                    onChange={(event) => updateField("estado", event.target.value)}
                    className={inputClassName(errors.estado)}
                  >
                    <option value="">Selecione</option>
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Qual é a sua maior dor?" error={errors.maior_dor}>
                  <select
                    id="maior_dor"
                    name="maior_dor"
                    required
                    value={formData.maior_dor}
                    onChange={(event) => updateField("maior_dor", event.target.value)}
                    className={inputClassName(errors.maior_dor)}
                  >
                    <option value="">Selecione</option>
                    {DORES.map((dor) => (
                      <option key={dor} value={dor}>
                        {dor}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#1CC88A] px-6 py-4 text-base font-extrabold uppercase tracking-wide text-[#0b2339] shadow-[0_18px_38px_rgba(28,200,138,0.28)] transition hover:bg-[#22d997] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              Enviar
            </button>

            {isSuccess && (
              <p className="mt-5 flex items-start gap-2 rounded-xl border border-[#1CC88A]/30 bg-[#1CC88A]/10 p-4 text-sm font-semibold text-[#0b2339]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1CC88A]" />
                Obrigado! Suas informações foram enviadas com sucesso.
              </p>
            )}

            {status === "error" && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                Não foi possível enviar suas informações. Tente novamente.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

const inputClassName = (error?: string) =>
  [
    "mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm font-medium text-[#0b2339] outline-none transition placeholder:text-[#0b2339]/35",
    "focus:border-[#1E88E5] focus:ring-4 focus:ring-[#1E88E5]/12",
    error ? "border-red-300" : "border-[#d6e5f5]",
  ].join(" ");

const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) => {
  return (
    <label className="block text-sm font-bold text-[#0b2339]">
      {label}
      {children}
      {error && <span className="mt-2 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
};

export default FormularioLeads;

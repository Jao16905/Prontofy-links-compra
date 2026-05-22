import { CalendarCheck, MessageCircle, Play } from "lucide-react";
import ProntofyLogo from "./ProntofyLogo";
import cardClinic from "@/assets/card-clinic.jpg";

const WHATSAPP_LINK = "https://wa.me/message/YO6R73FVJZHTC1";
const PRESENTATION_VIDEO_URL = "";

const TemporaryHero = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050709] text-white">
      <section className="relative flex min-h-screen items-center">
        <div className="absolute inset-0">
          <img src={cardClinic} alt="" className="h-full w-full object-cover opacity-28" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#050709_0%,rgba(5,7,9,0.92)_38%,rgba(5,7,9,0.64)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(5,7,9,0)_0%,#050709_100%)]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div className="flex flex-col items-start gap-8">
            <ProntofyLogo />

            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/7 px-4 py-2 text-sm font-medium text-white/78 backdrop-blur">
                <CalendarCheck className="h-4 w-4 text-emerald-300" />
                Apresentação exclusiva para clínicas
              </p>
              <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.98] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Mude a gestão da sua clínica
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
                Prontuário, agenda, automações e inteligência artificial trabalhando juntos para simplificar a rotina da sua equipe.
              </p>
            </div>

            <div className="flex w-full justify-center">
              <a
                href="#video-apresentacao"
                className="inline-flex items-center justify-center gap-3 rounded-md bg-[#19c879] px-6 py-4 text-center text-base font-bold uppercase tracking-wide text-[#04110b] shadow-[0_18px_44px_rgba(25,200,121,0.28)] transition hover:bg-[#35df91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19c879] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050709]"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-center sm:flex-none">Quero evoluir minha gestão</span>
              </a>
            </div>
          </div>

          <div className="w-full">
            <div id="video-apresentacao" className="overflow-hidden rounded-lg border border-white/12 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
              <div className="relative aspect-video">
                {PRESENTATION_VIDEO_URL ? (
                  <iframe
                    src={PRESENTATION_VIDEO_URL}
                    title="Apresentação Prontofy"
                    className="h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img src={cardClinic} alt="Vídeo de apresentação da Prontofy" className="h-full w-full object-cover opacity-75" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(25,200,121,0.22),rgba(0,0,0,0.65)_58%)]" />
                    <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#06110d] shadow-[0_14px_42px_rgba(0,0,0,0.38)]">
                      <Play className="ml-1 h-8 w-8 fill-current" />
                    </div>
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/82 to-transparent p-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">Vídeo</p>
                    <p className="mt-1 text-lg font-semibold text-white">Apresentação Prontofy</p>
                  </div>
                  <span className="rounded-sm border border-white/16 bg-white/10 px-3 py-1 text-sm text-white/75">2 min</span>
                </div>
              </div>
            </div>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-md bg-[#19c879] px-6 py-4 text-center text-base font-bold uppercase tracking-wide text-[#04110b] shadow-[0_18px_44px_rgba(25,200,121,0.28)] transition hover:bg-[#35df91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19c879] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050709]"
            >
              <MessageCircle className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-center sm:flex-none">Quero agendar minha apresentação</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TemporaryHero;

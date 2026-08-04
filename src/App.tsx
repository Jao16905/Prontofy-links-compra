import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CookieConsent } from "@/components/CookieConsent";
import { PromoBanner } from "@/components/PromoBanner";
import { getActivePromotion, processPromoUrlParam } from "@/lib/promo";
import { Promotion } from "@/types/promotion";

const Apresentacao = lazy(() => import("./pages/Apresentacao"));
const ConfiguracaoSecretariaIA = lazy(() => import("./pages/ConfiguracaoSecretariaIA"));
const FormularioApresentacao = lazy(() => import("./pages/FormularioApresentacao"));
const FormularioLeads = lazy(() => import("./pages/FormularioLeads"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SecretariaVirtual = lazy(() => import("./pages/SecretariaVirtual"));
const Telemedicina = lazy(() => import("./pages/Telemedicina"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const [promo, setPromo] = useState<Promotion | null>(() => getActivePromotion(location.pathname));

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const promoId = searchParams.get("promo");

    if (promoId) {
      processPromoUrlParam(promoId, location.pathname).then((fetchedPromo) => {
        setPromo(fetchedPromo);
      });
    } else {
      const active = getActivePromotion(location.pathname);
      setPromo(active);
    }
  }, [location.pathname, location.search]);

  return (
    <>
      <PromoBanner promo={promo} onDismiss={() => setPromo(null)} />
      <Suspense fallback={<div className="min-h-screen bg-[#03060a]" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/apresentacao" element={<Apresentacao />} />
          <Route path="/apresentacao/formulario" element={<FormularioApresentacao />} />
          <Route path="/formulario" element={<FormularioLeads />} />
          <Route path="/secretaria-virutal" element={<Navigate to="/secretaria-virtual" replace />} />
          <Route path="/secretaria-virtual" element={<SecretariaVirtual />} />
          <Route path="/telemedicina" element={<Telemedicina />} />
          <Route path="/configuracao-secretaria-ia" element={<ConfiguracaoSecretariaIA />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieConsent />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


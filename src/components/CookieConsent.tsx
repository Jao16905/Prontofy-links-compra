import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { updateConsent } from "@/utils/track";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [preferences, setPreferences] = useState({ analytics: true, marketing: true });

  useEffect(() => {
    const storedPrefs = localStorage.getItem("cookie_consent_prefs");
    const legacyConsent = localStorage.getItem("cookie_consent");

    if (storedPrefs) {
      const parsed = JSON.parse(storedPrefs);
      updateConsent(parsed.analytics, parsed.marketing);
    } else if (legacyConsent === "accepted") {
      updateConsent(true, true);
    } else if (legacyConsent === "declined") {
      updateConsent(false, false);
    } else {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    updateConsent(true, true);
    localStorage.setItem("cookie_consent_prefs", JSON.stringify({ analytics: true, marketing: true }));
    localStorage.setItem("cookie_consent", "accepted");
    setShowConsent(false);
  };

  const handleSavePreferences = () => {
    updateConsent(preferences.analytics, preferences.marketing);
    localStorage.setItem("cookie_consent_prefs", JSON.stringify(preferences));
    setShowConsent(false);
  };

  const handleDeclineAll = () => {
    updateConsent(false, false);
    localStorage.setItem("cookie_consent_prefs", JSON.stringify({ analytics: false, marketing: false }));
    localStorage.setItem("cookie_consent", "declined");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:p-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="mx-auto max-w-4xl bg-white border border-zinc-200 rounded-xl shadow-lg p-6 flex flex-col gap-6">
        
        {!showCustomization ? (
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center sm:items-start md:items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                Nós usamos cookies
              </h3>
              <p className="text-sm text-zinc-600">
                Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo e anúncios. Ao clicar em "Aceitar Todos", você concorda com o uso de cookies de analytics e marketing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 mt-2 md:mt-0">
              <Button variant="ghost" onClick={() => setShowCustomization(true)} className="w-full sm:w-auto text-zinc-600">
                Personalizar
              </Button>
              <Button variant="outline" onClick={handleDeclineAll} className="w-full sm:w-auto">
                Recusar Todos
              </Button>
              <Button onClick={handleAcceptAll} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                Aceitar Todos
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                Preferências de Cookies
              </h3>
              <p className="text-sm text-zinc-600">
                Gerencie como utilizamos os cookies. Os cookies essenciais não podem ser desativados pois são fundamentais para o funcionamento do site.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 bg-zinc-50 border border-zinc-100 p-4 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <Label className="text-sm font-medium">Essenciais (Sempre ativos)</Label>
                  <span className="text-xs text-zinc-500">Necessários para o site funcionar, como navegação básica e segurança.</span>
                </div>
                <Switch checked disabled />
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="analytics" className="text-sm font-medium cursor-pointer">Analytics</Label>
                  <span className="text-xs text-zinc-500">Ajudam-nos a entender como os visitantes interagem com o site, coletando dados anonimamente.</span>
                </div>
                <Switch 
                  id="analytics"
                  checked={preferences.analytics} 
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))} 
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="marketing" className="text-sm font-medium cursor-pointer">Marketing</Label>
                  <span className="text-xs text-zinc-500">Usados para exibir anúncios mais relevantes.</span>
                </div>
                <Switch 
                  id="marketing"
                  checked={preferences.marketing} 
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))} 
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-end mt-2">
              <Button variant="ghost" onClick={() => setShowCustomization(false)} className="w-full sm:w-auto">
                Voltar
              </Button>
              <Button variant="outline" onClick={handleSavePreferences} className="w-full sm:w-auto">
                Salvar Preferências
              </Button>
              <Button onClick={handleAcceptAll} className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                Aceitar Todos
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

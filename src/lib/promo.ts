import { supabaseMarketing } from "./supabaseMarketing";
import { Promotion, PromoTimeLeft } from "@/types/promotion";

const PROMO_STORAGE_KEY = "prontofy_active_promotion"; // chave legada
const PROMOS_MAP_STORAGE_KEY = "prontofy_active_promotions_map";
const PROMO_COOKIE_KEY = "prontofy_promo_id";

function setCookie(name: string, value: string, expiresDate: Date) {
  const expires = "; expires=" + expiresDate.toUTCString();
  document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function eraseCookie(name: string) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

export function extractPathname(urlOrPath: string): string {
  if (!urlOrPath) return "";
  try {
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      const parsed = new URL(urlOrPath);
      return parsed.pathname.replace(/\/$/, "") || "/";
    }
    const path = urlOrPath.startsWith("/") ? urlOrPath : "/" + urlOrPath;
    return path.replace(/\/$/, "") || "/";
  } catch (_) {
    return urlOrPath;
  }
}

export function isDomainMatchingPromotion(hostname: string, targetDomains?: string[]): boolean {
  if (!targetDomains || targetDomains.length === 0 || targetDomains.includes("*")) {
    return true;
  }
  const cleanHostname = (hostname || "").replace(/^www\./i, "").toLowerCase();
  if (cleanHostname === "localhost" || cleanHostname === "127.0.0.1") {
    return true;
  }
  return targetDomains.some((d) => {
    const cleanTarget = d.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0].toLowerCase();
    return cleanHostname === cleanTarget;
  });
}

export function isRouteMatchingPromotion(currentPathname: string, targetPathsOrUrl?: string | string[]): boolean {
  if (!targetPathsOrUrl) return true;

  const currentPath = extractPathname(currentPathname);
  const pathsArray = Array.isArray(targetPathsOrUrl) ? targetPathsOrUrl : [targetPathsOrUrl];

  if (pathsArray.length === 0 || pathsArray.includes("*") || pathsArray.includes("/")) return true;

  return pathsArray.some((p) => {
    const targetPath = extractPathname(p);
    if (targetPath === "" || targetPath === "/") return true;
    return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
  });
}

export function isPromoTargetingPage(promo: Promotion, hostname?: string, currentPathname?: string): boolean {
  if (!promo) return false;

  const targetDomains = promo.feature?.target_domains;
  const targetPaths = promo.feature?.target_paths;

  if (hostname && !isDomainMatchingPromotion(hostname, targetDomains)) {
    return false;
  }

  if (currentPathname) {
    if (targetPaths && Array.isArray(targetPaths) && targetPaths.length > 0) {
      return isRouteMatchingPromotion(currentPathname, targetPaths);
    }
    if (promo.promotion_url && !promo.promotion_url.startsWith("http")) {
      return isRouteMatchingPromotion(currentPathname, promo.promotion_url);
    }
  }

  return true;
}

export function isPromotionActive(promo: Promotion): boolean {
  if (!promo || !promo.start || !promo.end) return false;
  const now = Date.now();
  const startTime = new Date(promo.start).getTime();
  const endTime = new Date(promo.end).getTime();

  return now >= startTime && now <= endTime;
}

export function getAllActivePromotions(): Promotion[] {
  try {
    const mapRaw = localStorage.getItem(PROMOS_MAP_STORAGE_KEY);
    let promoMap: Record<string, Promotion> = mapRaw ? JSON.parse(mapRaw) : {};

    // Compatibilidade com chave legada simples
    const legacyRaw = localStorage.getItem(PROMO_STORAGE_KEY);
    if (legacyRaw) {
      try {
        const legacyPromo: Promotion = JSON.parse(legacyRaw);
        if (legacyPromo && legacyPromo.id) {
          promoMap[legacyPromo.id] = legacyPromo;
        }
      } catch (_) {}
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }

    const activeList: Promotion[] = [];
    const updatedMap: Record<string, Promotion> = {};

    for (const id in promoMap) {
      const promo = promoMap[id];
      if (isPromotionActive(promo)) {
        activeList.push(promo);
        updatedMap[id] = promo;
      }
    }

    localStorage.setItem(PROMOS_MAP_STORAGE_KEY, JSON.stringify(updatedMap));
    return activeList;
  } catch (err) {
    console.error("Erro ao obter promoções ativas:", err);
    return [];
  }
}

export function saveActivePromotion(promo: Promotion): void {
  try {
    const activeList = getAllActivePromotions();
    const map: Record<string, Promotion> = {};
    for (const p of activeList) {
      map[p.id] = p;
    }
    map[promo.id] = promo;

    localStorage.setItem(PROMOS_MAP_STORAGE_KEY, JSON.stringify(map));

    const endDate = new Date(promo.end);
    setCookie(PROMO_COOKIE_KEY, promo.id, endDate);
  } catch (err) {
    console.error("Erro ao salvar promoção no localStorage/Cookie:", err);
  }
}

export function clearActivePromotion(promoId?: string): void {
  try {
    if (!promoId) {
      localStorage.removeItem(PROMOS_MAP_STORAGE_KEY);
      localStorage.removeItem(PROMO_STORAGE_KEY);
      eraseCookie(PROMO_COOKIE_KEY);
      return;
    }

    const mapRaw = localStorage.getItem(PROMOS_MAP_STORAGE_KEY);
    if (mapRaw) {
      const promoMap: Record<string, Promotion> = JSON.parse(mapRaw);
      delete promoMap[promoId];
      localStorage.setItem(PROMOS_MAP_STORAGE_KEY, JSON.stringify(promoMap));
    }
  } catch (err) {
    console.error("Erro ao limpar promoção ativa:", err);
  }
}

export function getActivePromotion(currentPathname?: string, hostname?: string): Promotion | null {
  try {
    const activePromos = getAllActivePromotions();
    if (activePromos.length === 0) return null;

    const matchingPromo = activePromos.find((promo) =>
      isPromoTargetingPage(promo, hostname, currentPathname)
    );

    return matchingPromo || null;
  } catch (err) {
    console.error("Erro ao ler promoção ativa:", err);
    return null;
  }
}

export async function fetchPromotionById(promoId: string): Promise<Promotion | null> {
  try {
    const { data, error } = await supabaseMarketing
      .from("promotions")
      .select("*")
      .eq("id", promoId)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("Erro ao buscar promoção no Supabase Marketing:", error);
      return null;
    }

    return data as Promotion;
  } catch (err) {
    console.error("Erro inesperado ao buscar promoção:", err);
    return null;
  }
}

export function calculateTimeLeft(endDateIso: string, startDateIso?: string): PromoTimeLeft {
  const endMs = new Date(endDateIso).getTime();
  const now = Date.now();
  const total = endMs - now;

  const startMs = startDateIso ? new Date(startDateIso).getTime() : 0;
  const initialDuration = startDateIso ? (endMs - startMs) : 0;
  const hasDaysBlock = initialDuration >= 86400000;

  if (total <= 0) {
    return {
      days: hasDaysBlock ? "00" : undefined,
      hours: "00",
      minutes: "00",
      seconds: "00",
      isExpired: true,
      hasDaysBlock,
    };
  }

  const secondsTotal = Math.floor(total / 1000);

  if (hasDaysBlock) {
    const days = Math.floor(secondsTotal / 86400);
    const hours = Math.floor((secondsTotal % 86400) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;

    return {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
      isExpired: false,
      hasDaysBlock: true,
    };
  }

  const hours = Math.floor(secondsTotal / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    isExpired: false,
    hasDaysBlock: false,
  };
}

export async function processPromoUrlParam(promoId: string, currentPathname?: string, hostname?: string): Promise<Promotion | null> {
  if (!promoId) return getActivePromotion(currentPathname, hostname);

  const promo = await fetchPromotionById(promoId);
  if (promo && isPromotionActive(promo)) {
    saveActivePromotion(promo);
    if (isPromoTargetingPage(promo, hostname, currentPathname)) {
      return promo;
    }
  }

  return getActivePromotion(currentPathname, hostname);
}


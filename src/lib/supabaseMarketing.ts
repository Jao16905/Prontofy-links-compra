import { createClient } from "@supabase/supabase-js";

const supabaseMarketingUrl = import.meta.env.VITE_SUPABASE_MARKETING_URL || "";
const supabaseMarketingAnonKey = import.meta.env.VITE_SUPABASE_MARKETING_PUBLISHABLE_KEY || "";

if (!supabaseMarketingUrl || !supabaseMarketingAnonKey) {
  console.warn(
    "Supabase Marketing credentials not found. Please check your VITE_SUPABASE_MARKETING_URL and VITE_SUPABASE_MARKETING_PUBLISHABLE_KEY environment variables."
  );
}

export const supabaseMarketing = createClient(supabaseMarketingUrl, supabaseMarketingAnonKey);

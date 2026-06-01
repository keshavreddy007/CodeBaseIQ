import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Cookie, Shield, Check, ChevronDown, ChevronUp, Sliders, Info } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Granular choices
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [personalizationConsent, setPersonalizationConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted or declined (upgraded to v2 to show to all users)
    const localConsent = localStorage.getItem("cookieConsent_v2_status");
    if (!localConsent) {
      // Faster delay for better response time
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      // Load stored preferences if any
      const analyticsStore = localStorage.getItem("cookieConsent_v2_analytics");
      const personalizationStore = localStorage.getItem("cookieConsent_v2_personalization");
      if (analyticsStore !== null) setAnalyticsConsent(analyticsStore === "true");
      if (personalizationStore !== null) setPersonalizationConsent(personalizationStore === "true");
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent_v2_status", "accepted_all");
    localStorage.setItem("cookieConsent_v2_analytics", "true");
    localStorage.setItem("cookieConsent_v2_personalization", "true");
    setAnalyticsConsent(true);
    setPersonalizationConsent(true);
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    localStorage.setItem("cookieConsent_v2_status", "declined_all");
    localStorage.setItem("cookieConsent_v2_analytics", "false");
    localStorage.setItem("cookieConsent_v2_personalization", "false");
    setAnalyticsConsent(false);
    setPersonalizationConsent(false);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent_v2_status", "customized");
    localStorage.setItem("cookieConsent_v2_analytics", analyticsConsent.toString());
    localStorage.setItem("cookieConsent_v2_personalization", personalizationConsent.toString());
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cookie-consent"
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto z-50 md:max-w-[420px]"
          id="cookie-consent-container"
        >
          <div className="bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl shadow-brand-blue/10 relative overflow-hidden">
            {/* Subtle ambient decorative gradient background glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/15 blur-[40px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-violet/15 blur-[40px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="p-2.5 bg-brand-blue/10 rounded-xl border border-brand-blue/20 shrink-0">
                  <Cookie className="w-5 h-5 text-brand-cyan" />
                </div>
                <div className="min-w-0 pr-6">
                  <h3 className="text-white font-semibold text-sm tracking-tight flex items-center gap-1.5">
                    Cookie & Consent Options
                  </h3>
                  <p className="text-[11.5px] text-zinc-400 mt-1 leading-relaxed">
                    CodeBaseIQ uses local keys and session storage trackers to personalize code indexes and remember your active repositories.
                  </p>
                </div>
              </div>

              {/* Preferences Accordion Button */}
              <button
                type="button"
                onClick={() => setShowPreferences(!showPreferences)}
                className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-zinc-300 text-xs font-medium cursor-pointer mb-4 transition-all"
                id="btn-toggle-cookie-preferences"
              >
                <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
                  {showPreferences ? "Hide Preferences" : "Manage Preferences"}
                </span>
                {showPreferences ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>

              {/* Collapsible Preferences Panel */}
              <AnimatePresence>
                {showPreferences && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b border-white/5 mb-4"
                  >
                    <div className="space-y-3 pb-3 pt-1">
                      {/* 1. Essential Category */}
                      <div className="flex items-start justify-between bg-white/[0.01] p-2.5 rounded-lg border border-white/5 gap-4">
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-medium text-white block">Essential Workspaces</span>
                          <span className="text-[10px] text-zinc-500 leading-normal block mt-0.5">
                            Required to persist selected repositories, authentication sessions, and theme layouts.
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono rounded-full font-bold uppercase shrink-0">
                          <Check className="w-2.5 h-2.5" />
                          Always Active
                        </span>
                      </div>

                      {/* 2. Performance & Analytics Category */}
                      <div className="flex items-start justify-between bg-white/[0.01] p-2.5 rounded-lg border border-white/5 gap-4">
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-medium text-white block">Performance & Speed Metrics</span>
                          <span className="text-[10px] text-zinc-500 leading-normal block mt-0.5">
                            Collects completely anonymized latency statistics for global AST indexing and pipeline checkouts.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAnalyticsConsent(!analyticsConsent)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 cursor-pointer flex items-center shrink-0 ${
                            analyticsConsent ? "bg-brand-cyan" : "bg-zinc-800"
                          }`}
                          id="toggle-cookie-analytics"
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-black shadow-md transform transition-transform duration-250 ${
                              analyticsConsent ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* 3. Personalization Category */}
                      <div className="flex items-start justify-between bg-white/[0.01] p-2.5 rounded-lg border border-white/5 gap-4">
                        <div className="flex-1 min-w-0">
                          <span className="text-[12px] font-medium text-white block">Custom Prompt Presets</span>
                          <span className="text-[10px] text-zinc-500 leading-normal block mt-0.5">
                            Caches frequently discussed topics or active coding frameworks to offer intelligent preset chat scripts.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPersonalizationConsent(!personalizationConsent)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-250 cursor-pointer flex items-center shrink-0 ${
                            personalizationConsent ? "bg-brand-cyan" : "bg-zinc-800"
                          }`}
                          id="toggle-cookie-personalization"
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-black shadow-md transform transition-transform duration-250 ${
                              personalizationConsent ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                {showPreferences ? (
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="flex-1 bg-brand-cyan hover:bg-brand-cyan/90 text-black transition-colors py-2 px-3 rounded-xl text-[12px] font-semibold text-center cursor-pointer shadow-lg shadow-brand-cyan/15 flex items-center justify-center gap-1.5"
                    id="cookie-btn-save-pref"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Save Selected Config
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      className="flex-1 bg-white hover:bg-zinc-250 text-black font-semibold transition-colors py-2.5 px-3 rounded-xl text-[12px] text-center cursor-pointer flex items-center justify-center gap-1"
                      id="cookie-btn-accept-all"
                    >
                      Accept All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeclineAll}
                      className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-350 border border-white/10 hover:text-white transition-colors py-2.5 px-3 rounded-xl text-[12px] font-semibold text-center cursor-pointer"
                      id="cookie-btn-decline-all"
                    >
                      Essential Only
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Standard Close Icon */}
            <button 
              type="button"
              onClick={handleDeclineAll}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer z-20"
              aria-label="Confirm decline and exit consent dialog"
              id="cookie-consent-close-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Github, Loader2, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { FloatingObject } from "./FloatingObject";
import { AnalysisIndicators } from "./AnalysisIndicators";

export function Hero({ onAnalyzeSuccess, analysisData }: { onAnalyzeSuccess?: (data: any) => void; analysisData?: any }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: url }),
      });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text.substring(0, 120) || `Server returned invalid status (${res.status})`);
      }
      if (!res.ok) throw new Error(data.error || "Failed to analyze");
      onAnalyzeSuccess?.(data);
      setTimeout(() => {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = async (repoName: string) => {
    if (loading) return;
    const repoUrl = `https://github.com/${repoName}`;
    setUrl(repoUrl);
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: repoUrl }),
      });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text.substring(0, 120) || `Server returned invalid status (${res.status})`);
      }
      if (!res.ok) throw new Error(data.error || "Failed to analyze");
      onAnalyzeSuccess?.(data);
      setTimeout(() => {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProgressState = (elapsed: number) => {
    if (elapsed < 3) return { label: "Cloning repository", percent: Math.min((elapsed / 3) * 20, 20) };
    if (elapsed < 7) return { label: "Indexing files", percent: 20 + Math.min(((elapsed - 3) / 4) * 30, 30) };
    if (elapsed < 20) return { label: "Generating AI insights", percent: 50 + Math.min(((elapsed - 7) / 13) * 45, 45) };
    return { label: "Finalizing report", percent: 95 + Math.min((elapsed - 20) * 0.1, 4) }; 
  };

  const currentProgress = getProgressState(elapsedTime);

  const smoothTransition: any = { duration: 0.8, ease: "easeOut" };

  return (
    <>
      <FloatingObject />
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-brand-violet/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-cyan/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        {/* Centered Headline and Form */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={smoothTransition}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-violet/40 bg-brand-violet/10 text-brand-violet mb-10 shadow-[0_0_30px_-5px_var(--color-brand-violet)] backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-widest uppercase">Next-Gen Code Intelligence</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
          >
            Understand Any Codebase <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet drop-shadow-sm">
              in Minutes.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 mb-14 max-w-3xl leading-relaxed mx-auto px-4 font-medium"
          >
            Paste a GitHub URL and instantly generate architecture explanations, onboarding docs, dependency maps, and an AI-powered walkthrough.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.3 }}
            className="w-full max-w-2xl relative flex flex-col items-center"
          >
            <AnalysisIndicators loading={loading} label={currentProgress.label} />
            <form onSubmit={handleAnalyze} className="p-2.5 glass rounded-2xl flex flex-col sm:flex-row items-center gap-3 shadow-[0_0_80px_-20px_var(--color-brand-cyan)] relative group transition-shadow duration-500 bg-[#070707]/90 border border-white/10 w-full overflow-hidden hover:border-brand-cyan/50 hover:shadow-[0_0_100px_-20px_var(--color-brand-cyan)]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-cyan/20 to-transparent w-[200%] animate-[shimmer_3s_linear_infinite]" />
              <div className="absolute inset-[1px] bg-[#070707] rounded-[15px] z-0" />
              <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full z-10 relative">
                <Github className="w-6 h-6 text-zinc-400 group-hover:text-brand-cyan transition-colors" />
                <input 
                  id="repo-url-input"
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/vercel/next.js" 
                  className="bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 w-full font-mono text-base text-center sm:text-left focus:ring-0"
                  disabled={loading}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !url.trim()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-white to-zinc-200 text-zinc-950 font-extrabold flex items-center justify-center gap-2 hover:from-brand-cyan hover:to-brand-blue hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-white disabled:hover:to-zinc-200 disabled:hover:text-zinc-950 cursor-pointer text-sm font-sans tracking-wide uppercase shrink-0 z-10 relative shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_var(--color-brand-cyan)]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Analyze Repository
              </button>
            </form>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex items-center justify-center gap-2 text-sm text-brand-blue/90 font-medium tracking-wide"
            >
              <ShieldCheck className="w-4 h-4 text-brand-cyan animate-pulse" />
              <span>100% Secure Private Repo Analysis</span>
            </motion.div>
            
            {error && (
              <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
            )}

            {loading ? (
              <div className="mt-8 w-full max-w-md mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 mb-4 h-14 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={currentProgress.label}
                      initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="text-sm font-medium text-zinc-300 flex items-center gap-2 justify-center"
                    >
                      <Loader2 className="w-3.5 h-3.5 text-brand-blue animate-spin" />
                      {currentProgress.label}...
                    </motion.p>
                  </AnimatePresence>
                  <p className="font-mono text-xs text-zinc-500">Elapsed time: {elapsedTime}s</p>
                </div>
                
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-2 relative p-[1px] border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet rounded-full relative"
                    initial={{ width: "0%" }}
                    animate={{ width: `${currentProgress.percent}%` }}
                    transition={{ type: "spring", stiffness: 45, damping: 11 }}
                  >
                    {/* Glowing highlight at the tip of the progress bar */}
                    <motion.div 
                      className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-white/40 blur-[2px]"
                      animate={{
                        opacity: [0.4, 1.0, 0.4],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Dynamic infinite silver reflection shimmer wave */}
                    <motion.div 
                      className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.18)_50%,transparent_100%)] bg-[length:200%_100%]"
                      animate={{
                        backgroundPosition: ["100% 0%", "-100% 0%"]
                      }}
                      transition={{
                        duration: 2.0,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
                  <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider block mr-1">Presets:</span>
                  <button 
                    type="button"
                    onClick={() => handlePresetClick("facebook/react")}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 hover:bg-brand-blue/10 hover:border-brand-blue/30 text-zinc-300 hover:text-white transition-all cursor-pointer font-medium text-xs shadow-sm hover:translate-y-[-1px] active:translate-y-[0px]"
                  >
                    React
                  </button>
                  <button 
                    type="button"
                    onClick={() => handlePresetClick("vercel/next.js")}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 hover:bg-brand-cyan/10 hover:border-brand-cyan/30 text-zinc-300 hover:text-white transition-all cursor-pointer font-medium text-xs shadow-sm hover:translate-y-[-1px] active:translate-y-[0px]"
                  >
                    Next.js
                  </button>
                  <button 
                    type="button"
                    onClick={() => handlePresetClick("tailwindlabs/tailwindcss")}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 hover:bg-brand-violet/10 hover:border-brand-violet/30 text-zinc-300 hover:text-white transition-all cursor-pointer font-medium text-xs shadow-sm hover:translate-y-[-1px] active:translate-y-[0px]"
                  >
                    Tailwind
                  </button>
                  <button 
                    type="button"
                    onClick={() => handlePresetClick("expressjs/express")}
                    className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-zinc-300 hover:text-white transition-all cursor-pointer font-medium text-xs shadow-sm hover:translate-y-[-1px] active:translate-y-[0px]"
                  >
                    Express
                  </button>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[11px] text-zinc-600 mt-2 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" /> Supports React & Node
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" /> Works with Python
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-violet" /> Rust, Go, & More
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </section>
    </>
  );
}

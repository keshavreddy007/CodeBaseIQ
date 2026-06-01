import { motion } from "motion/react";

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-brand-cyan/5 border-t border-brand-cyan/20" />
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-cyan/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Ready to decode your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet">repository?</span>
        </h2>
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto font-medium">
          Join thousands of developers saving hours of onboarding time. Analyze your first codebase entirely free.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => {
              document.getElementById('root')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-white to-zinc-200 text-zinc-950 font-extrabold hover:from-brand-cyan hover:to-brand-blue hover:text-white transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_var(--color-brand-cyan)] uppercase tracking-wide text-sm"
          >
            Start Analyzing for Free
          </button>
        </div>
      </div>
    </section>
  );
}

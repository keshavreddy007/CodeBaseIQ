import { motion } from "motion/react";
import { Code2, Globe, Users, Zap, ArrowLeft } from "lucide-react";

interface AboutProps {
  onNavigateHome: () => void;
}

export function About({ onNavigateHome }: AboutProps) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button 
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold tracking-wide transition-all border border-white/5 hover:border-white/15 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:-translate-x-1 group-hover:text-white transition-transform" />
            Back to Home
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-blue/10 mb-6">
            <Globe className="w-8 h-8 text-brand-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About CodeBaseIQ
          </h1>
          <p className="text-xl text-zinc-400">
            We are building the future of codebase comprehension, making it easier for every developer to understand large, complex projects instantly.
          </p>
        </motion.div>

        {/* Featured Quote / Philosophy Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-blue/8 to-brand-violet/8 border border-white/10 mb-16 shadow-2xl group hover:border-brand-blue/30 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand-cyan/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-brand-violet/5 blur-2xl pointer-events-none" />
          
          <span className="text-brand-cyan/20 text-7xl font-serif absolute -top-2 -left-1">“</span>
          
          <p className="text-base sm:text-lg text-zinc-250 font-medium italic relative leading-relaxed pl-4 sm:pl-6">
            We started CodeBaseIQ with one simple goal: to change the way developers perceive, explore, and integrate themselves with new software architectures. Instead of spending hours tracing imports, reading outdated documentation, or running static analytics charts, CodeBaseIQ bridges the gap between raw text files and developer intuition. We believe that onboarding should be instantaneous, deep comprehension should be the standard, and every line of code should feel familiar and structured from day one.
          </p>
          
          <div className="mt-6 flex items-center gap-2.5 pl-4 sm:pl-6">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-cyan/10 border border-brand-cyan/15">
              <Code2 className="w-2.5 h-2.5 text-brand-cyan" />
            </div>
            <span className="text-[11px] font-mono tracking-wider font-bold text-zinc-400 uppercase">
              The CodeBaseIQ Core Philosophy
            </span>
          </div>
        </motion.div>        {/* Developer Spotlight / Founder Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-zinc-950/40 border border-white/10 mb-16 shadow-2xl group hover:border-brand-violet/30 transition-all duration-500"
          id="developer-spotlight-card"
        >
          <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-brand-violet/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full bg-brand-cyan/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Minimalist Tech Avatar */}
            <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-violet to-brand-cyan p-[1.5px] shadow-xl shadow-brand-blue/5">
              <div className="w-full h-full rounded-[14px] bg-zinc-950 flex flex-col items-center justify-center font-mono relative overflow-hidden">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan bg-clip-text text-transparent">K</span>
                <span className="text-[9px] text-brand-cyan/80 font-bold tracking-widest uppercase mt-1">17 Y/O</span>
                <div className="absolute inset-0 bg-brand-blue/5 opacity-40 mix-blend-overlay pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan font-mono px-2.5 py-1 rounded bg-brand-cyan/10 border border-brand-cyan/15">
                  Developer & Founder
                </span>
                <span className="text-[11px] font-mono text-zinc-550 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Keshav • Aspiring Founder
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">
                Hey everyone, I'm Keshav
              </h3>

              <div className="text-zinc-350 text-sm leading-relaxed space-y-3.5">
                <p>
                  I'm a 17-year-old developer obsessed with building meaningful systems and an aspiring founder. I built CodeBaseIQ—a leading AI-powered helper built to remove the sheer friction of reading and deciphering unfamiliar codebases.
                </p>
                <p>
                  Instead of drowning in directories or trying to manually trace file relationships, CodeBaseIQ generates detailed architectural explanations, clean onboarding checklists, comprehensive dependency maps, and interactive guided walkthroughs. All of this is done instantly: <strong className="text-white bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono text-xs">with just the Repository URL, and that's it.</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10"
          >
            <Users className="w-8 h-8 text-brand-violet mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
            <p className="text-zinc-400">
              To empower developers by eliminating the friction of navigating unfamiliar codebases. We believe that understanding code should be as simple as having a conversation.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10"
          >
            <Zap className="w-8 h-8 text-brand-cyan mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
            <p className="text-zinc-400">
              A world where the learning curve for any open-source or proprietary software project is near zero, accelerating global software innovation.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="prose prose-invert prose-zinc max-w-none"
        >
          <h2 className="text-2xl font-bold text-white mb-4">The Story</h2>
          <p className="text-zinc-400 leading-relaxed mb-6">
            CodeBaseIQ started from a simple frustration: developers spend more time reading and trying to understand code than actually writing it. The problem scales exponentially with the size of the team and the age of the codebase. By leveraging the latest in AI and language models, we built a tool that acts as your personal pair programmer, deeply familiar with the architecture, dependencies, and quirks of any repository you point it at.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            We are a passionate team of engineers and designers dedicated to building the most intuitive and powerful code analysis tools in the world. Join us on our journey to make code comprehension accessible to everyone.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

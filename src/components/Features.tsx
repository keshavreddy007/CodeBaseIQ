import { motion } from "motion/react";
import { BrainCircuit, BookOpen, GitGraph, ShieldCheck } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Instant Architecture Intelligence",
      description: "Our AI agents crawl the repository, parse configuration files, and understand relationships to build a comprehensive map of how the software fits together.",
      icon: BrainCircuit,
      color: "text-brand-blue",
      bg: "bg-brand-blue/10",
      border: "border-brand-blue/20",
      glowColor: "rgba(16, 185, 129, 0.2)",
      hoverBorder: "rgba(16, 185, 129, 0.45)"
    },
    {
      title: "AI Developer Onboarding",
      description: "Generate customized onboarding guides tailored for new hires. Tell the AI what kind of developer they are, and it curates the perfect reading path.",
      icon: BookOpen,
      color: "text-brand-cyan",
      bg: "bg-brand-cyan/10",
      border: "border-brand-cyan/20",
      glowColor: "rgba(6, 182, 212, 0.2)",
      hoverBorder: "rgba(6, 182, 212, 0.45)"
    },
    {
      title: "Repository Visualization",
      description: "Get beautiful, interactive architecture diagrams, component trees, and service relationship graphs immediately after pasting a link.",
      icon: GitGraph,
      color: "text-brand-violet",
      bg: "bg-brand-violet/10",
      border: "border-brand-violet/20",
      glowColor: "rgba(59, 130, 246, 0.2)",
      hoverBorder: "rgba(59, 130, 246, 0.45)"
    },
    {
      title: "Unlimited Analysis",
      description: "Enjoy completely free, unlimited public and private repository analysis. We prioritize your code's security with zero-data-retention scanning.",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      glowColor: "rgba(52, 211, 153, 0.2)",
      hoverBorder: "rgba(52, 211, 153, 0.45)"
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Intelligence built for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet drop-shadow-sm">modern engineering teams</span>
          </h2>
          <p className="text-lg text-zinc-400">
            Stop spending weeks reading source code. Get complete situational awareness in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{
                y: -6,
                scale: 1.025,
                borderColor: feature.hoverBorder,
                boxShadow: `0 12px 40px -10px ${feature.glowColor}`,
              }}
              className="group glass p-8 rounded-2xl cursor-pointer relative overflow-hidden transition-all duration-300 border border-white/5 bg-zinc-950/20"
            >
              {/* Cyber L-Brackets in corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/5 group-hover:border-brand-cyan/40 transition-colors duration-300" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/5 group-hover:border-brand-cyan/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/5 group-hover:border-brand-cyan/40 transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/5 group-hover:border-brand-cyan/40 transition-colors duration-300" />

              {/* Technical Monospace Tag */}
              <div className="absolute top-4 right-5 font-mono text-[9px] text-zinc-500 group-hover:text-brand-cyan/80 transition-colors tracking-widest font-bold">
                [ INT_UNIT_0{idx + 1} ]
              </div>

              {/* Soft neon floor glow inside the card */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-12 rounded-full bg-brand-cyan/5 blur-xl group-hover:bg-brand-cyan/15 transition-all duration-300 pointer-events-none" />

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bg} ${feature.border} border mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-zinc-900/60`}>
                <feature.icon className={`w-6 h-6 ${feature.color} transition-all duration-300 group-hover:rotate-3`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm group-hover:text-zinc-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

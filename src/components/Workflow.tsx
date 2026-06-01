import { motion } from "motion/react";

export function Workflow() {
  const steps = [
    {
      number: "01",
      title: "Paste GitHub URL",
      description: "Works with any public or private repository (via OAuth). Just paste the link.",
    },
    {
      number: "02",
      title: "AI Analyzes Repository",
      description: "Our system clones, indexes, and builds a semantic map of the entire codebase.",
    },
    {
      number: "03",
      title: "Get Interactive Architecture Insights",
      description: "Access instant docs, search capability, and a conversational codebase AI.",
    }
  ];

  return (
    <section id="workflow" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="md:grid grid-cols-12 gap-12 items-center">
          <div className="col-span-5 mb-12 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              How it works
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              We've simplified codebase onboarding into three straightforward steps. No complex configuration, no agents to deploy locally.
            </p>
          </div>
          
          <div className="col-span-7 relative">
             <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-brand-blue via-brand-violet to-transparent hidden md:block" />
             
             <div className="space-y-12">
                {steps.map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative pl-0 md:pl-16"
                  >
                    <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center font-mono text-zinc-500 hidden md:flex shrink-0">
                      {step.number}
                    </div>
                    <div className="glass p-6 rounded-2xl">
                      <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                      <p className="text-zinc-400 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

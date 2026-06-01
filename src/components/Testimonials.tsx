import { motion } from "motion/react";

export function Testimonials() {
  const testimonials = [
    {
      quote: "It felt like having a senior engineer walk me through our monorepo. Saved our new hires literally weeks of context gathering.",
      author: "Sarah Chen",
      role: "VP of Engineering at FinTech Startup"
    },
    {
      quote: "We use it for open-source contributions. Being able to chat with the repo before writing a PR is a massive confidence booster.",
      author: "Alex Rivera",
      role: "OSS Maintainer"
    },
    {
      quote: "The dependency mapping alone is worth it. It instantly highlighted a circular dependency in our authentication flow that we hadn't noticed.",
      author: "Michael Chang",
      role: "Lead Architect"
    }
  ];

  return (
    <section className="py-24 bg-black/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16 tracking-tight">Trusted by engineering teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-2xl flex flex-col justify-between"
            >
              <p className="text-zinc-300 mb-8 font-serif italic text-lg leading-relaxed">"{t.quote}"</p>
              <div>
                <div className="font-semibold text-white">{t.author}</div>
                <div className="text-xs text-brand-blue uppercase tracking-wider mt-1">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

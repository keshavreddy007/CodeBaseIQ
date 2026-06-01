import { motion } from "motion/react";

export function TechStack() {
  const techs = [
    { name: "React", label: "Frontend" },
    { name: "Next.js", label: "Framework" },
    { name: "Node.js", label: "Backend" },
    { name: "Python", label: "Backend" },
    { name: "FastAPI", label: "API" },
    { name: "Java", label: "Enterprise" },
    { name: "Spring Boot", label: "Framework" },
    { name: "Go", label: "Systems" },
    { name: "Rust", label: "Systems" },
    { name: "PostgreSQL", label: "Database" },
    { name: "Docker", label: "Infrastructure" },
    { name: "Kubernetes", label: "Infrastructure" }
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-black/50 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 text-center z-10 relative">
        <h3 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-12">
          Understands 40+ Languages & Frameworks
        </h3>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {techs.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.04)" }}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.02] transition-all cursor-default shadow-sm hover:shadow-brand-blue/5 hover:border-white/20 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
              <div className="relative z-10 text-sm font-medium text-zinc-200">{tech.name}</div>
              <div className="relative z-10 text-[10px] text-zinc-500 uppercase mt-0.5 tracking-wider">{tech.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

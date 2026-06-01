import { motion } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export function FAQ() {
  const faqs = [
    {
      q: "Does CodeBaseIQ store my repository code?",
      a: "No. Code is processed in memory and never stored in a persistent database. We prioritize your privacy and security."
    },
    {
      q: "Do you support private repositories?",
      a: "Yes! You get unlimited private and public repository analysis. You can authenticate via GitHub OAuth to analyze your private repositories with complete security."
    },
    {
      q: "How large of a repository can it analyze?",
      a: "We currently support repositories up to 500MB or roughly 50,000 files. We use intelligent chunking to parse the most relevant structure first."
    },
    {
      q: "What programming languages are supported?",
      a: "We support over 40 languages including JavaScript/TypeScript, Python, Java, Go, Rust, C++, Ruby, PHP, and more. Frameworks like React, Next.js, and Spring Boot get specialized parsing."
    },
    {
      q: "How accurate is the AI analysis?",
      a: "Our AI models are specifically fine-tuned for code comprehension and architecture analysis. While highly accurate in identifying patterns, dependencies, and structure, we recommend using the tool as an assistant rather than a definitive source of truth."
    },
    {
      q: "Can I export the analysis results?",
      a: "Yes! You can easily export your dashboard analysis and dependency maps as PDF or JSON to share with your team or include in your documentation."
    },
    {
      q: "Do I need to be an expert developer to use this?",
      a: "Not at all. CodeBaseIQ is designed to help anyone understand a codebase, regardless of their experience level. It translates complex technical structures into plain English summaries."
    },
    {
      q: "Is there an API available to integrate this into our internal tools?",
      a: "We are currently developing an enterprise API that will allow you to integrate codebase scanning directly into your CI/CD pipelines and internal developer portals."
    }
  ];

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>

        {/* Support email callout block */}
        <div className="mt-12 text-center">
          <div className="glass p-8 rounded-2xl border border-white/5 bg-zinc-950/20 max-w-xl mx-auto relative overflow-hidden">
            {/* L-Brackets in corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/10" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/10" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10" />

            {/* Neon background core glow */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-12 rounded-full bg-brand-cyan/5 blur-xl pointer-events-none" />

            <h3 className="text-lg font-bold text-white mb-2">Need to Report a Bug or Get Help?</h3>
            <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
              If you discover any errors, system bugs, or wish to share valuable suggestions with our development team, feel free to contact us.
            </p>
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-xs font-semibold text-zinc-400">Support & Developer Team:</span>
              <a 
                href="mailto:codebaseiq2026@gmail.com" 
                className="text-xs font-bold font-mono text-brand-cyan hover:underline transition-all"
                title="Send a bug report or error description"
              >
                codebaseiq2026@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/5 transition-colors hover:border-white/10">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full text-left px-6 py-4 flex items-center justify-between font-medium text-zinc-200"
      >
        {question}
        {open ? <Minus className="w-5 h-5 text-zinc-500" /> : <Plus className="w-5 h-5 text-zinc-500" />}
      </button>
      {open && (
        <div className="px-6 pb-4 text-zinc-400 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

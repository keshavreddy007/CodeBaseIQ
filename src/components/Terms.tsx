import { motion } from "motion/react";
import { FileText, ArrowLeft } from "lucide-react";

interface TermsProps {
  onNavigateHome: () => void;
}

export function Terms({ onNavigateHome }: TermsProps) {
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
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-cyan/10 mb-6">
            <FileText className="w-8 h-8 text-brand-cyan" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-zinc-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert prose-zinc max-w-none text-zinc-400"
        >
          <h2 className="text-2xl font-bold text-white mb-4 mt-8">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the CodeBaseIQ service, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">2. Description of Service</h2>
          <p className="mb-4">
            CodeBaseIQ provides an AI-powered code analysis platform. You acknowledge and agree that the Service may include certain communications from CodeBaseIQ, such as service announcements, administrative messages, and that these communications are considered part of CodeBaseIQ membership and you will not be able to opt out of receiving them.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">3. End User License</h2>
          <p className="mb-4">
            Subject to your compliance with these Terms, CodeBaseIQ grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use our Services. You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by CodeBaseIQ.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">4. Acceptable Use Policy</h2>
          <p className="mb-4">
            You agree not to use the Services in any unlawful or fraudulent manner, or for any unlawful or fraudulent purpose. You agree not to upload any private codebase that you do not own the rights to, or any codebase containing malicious software.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">5. Modifications to Service</h2>
          <p className="mb-4">
            CodeBaseIQ reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">6. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

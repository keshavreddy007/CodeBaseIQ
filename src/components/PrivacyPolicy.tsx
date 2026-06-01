import { motion } from "motion/react";
import { Shield, ArrowLeft } from "lucide-react";

interface PrivacyPolicyProps {
  onNavigateHome: () => void;
}

export function PrivacyPolicy({ onNavigateHome }: PrivacyPolicyProps) {
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
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-violet/10 mb-6">
            <Shield className="w-8 h-8 text-brand-violet" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Privacy Policy
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
          <h2 className="text-2xl font-bold text-white mb-4 mt-8">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, avatar image, and any codebase repositories you analyze.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">2. How We Use and Share Information</h2>
          <p className="mb-4">
            We may use the information we collect about you to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.</li>
            <li>Perform internal operations, including, for example, to prevent fraud and abuse of our Services; to troubleshoot software bugs and operational problems; to conduct data analysis, testing, and research; and to monitor and analyze usage and activity trends.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">3. Security</h2>
          <p className="mb-4">
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. For example, all codebase analyses are processed securely and not permanently retained without your consent.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">4. Changes to the Privacy Policy</h2>
          <p className="mb-4">
            We may change this Privacy Policy from time to time. If we make significant changes in the way we treat your personal information, or to the Privacy Policy, we will provide you notice through the Services or by some other means, such as email.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at codebaseiq2026@gmail.com.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

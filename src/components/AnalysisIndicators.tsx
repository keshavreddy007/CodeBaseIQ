import { motion } from "motion/react";

export function AnalysisIndicators({ loading, label }: { loading: boolean; label: string }) {
  return (
    <div className="absolute -top-12 inset-x-0 pointer-events-none z-50 flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
      <>
        {loading && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 backdrop-blur-sm pointer-events-auto"
          >
            <span className="text-xs text-brand-blue font-medium tracking-tight">💡 Pro tip: check the FAQ for advanced usage</span>
          </motion.div>
        )}
      </>
      <>
        {loading && (
          <motion.div
            key="status"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/20 backdrop-blur-sm pointer-events-auto"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-violet opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-violet"></span>
            </span>
            <span className="text-xs text-brand-violet font-medium">{label}</span>
          </motion.div>
        )}
      </>
    </div>
  );
}

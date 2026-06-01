import { Network } from "lucide-react";
import type { ViewState } from "../App";

interface FooterProps {
  onViewChange?: (view: ViewState, subTab?: string) => void;
}

export function Footer({ onViewChange }: FooterProps) {
  return (
    <footer className="py-12 border-t border-white/5 bg-black/50 text-sm">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => onViewChange?.('landing')}>
            <div className="w-6 h-6 rounded flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-violet">
              <Network className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white">CodeBaseIQ</span>
          </div>
          <p className="text-zinc-500 mb-4">
            Helping developers understand source code instantly through AI.
          </p>
          <div className="text-xs text-zinc-500 mt-4 pt-4 border-t border-white/5 space-y-1">
            <span className="block font-semibold text-zinc-400">Support & Feedback:</span>
            <a 
              href="mailto:codebaseiq2026@gmail.com" 
              className="font-mono text-brand-cyan hover:underline transition-all block truncate"
              title="Report bugs, errors, or reach out to our team"
            >
              codebaseiq2026@gmail.com
            </a>
          </div>
        </div>
        
        <div>
          <button 
            onClick={() => onViewChange?.('product', 'architecture')} 
            className="font-semibold text-white mb-4 hover:text-brand-blue cursor-pointer transition-colors text-left"
          >
            Product
          </button>
          <ul className="space-y-2 text-zinc-500 flex flex-col items-start">
            <li><button onClick={() => onViewChange?.('product', 'architecture')} className="hover:text-white transition-colors cursor-pointer">Features</button></li>
            <li><button onClick={() => onViewChange?.('product', 'integrations')} className="hover:text-white transition-colors cursor-pointer">Integrations</button></li>
            <li><button onClick={() => onViewChange?.('product', 'changelog')} className="hover:text-white transition-colors cursor-pointer">Changelog</button></li>
          </ul>
        </div>

        <div>
          <button 
            onClick={() => onViewChange?.('resources', 'docs')} 
            className="font-semibold text-white mb-4 hover:text-brand-cyan cursor-pointer transition-colors text-left"
          >
            Resources
          </button>
          <ul className="space-y-2 text-zinc-500 flex flex-col items-start font-medium">
            <li><button onClick={() => onViewChange?.('resources', 'docs')} className="hover:text-white transition-colors cursor-pointer">Documentation</button></li>
            <li><button onClick={() => onViewChange?.('resources', 'api')} className="hover:text-white transition-colors cursor-pointer">API Reference</button></li>
            <li><button onClick={() => onViewChange?.('resources', 'blog')} className="hover:text-white transition-colors cursor-pointer">Blog</button></li>
            <li><button onClick={() => onViewChange?.('resources', 'community')} className="hover:text-white transition-colors cursor-pointer">Community</button></li>
          </ul>
        </div>

        <div>
          <button 
            onClick={() => onViewChange?.('about')} 
            className="font-semibold text-white mb-4 hover:text-brand-violet cursor-pointer transition-colors text-left"
          >
            Company
          </button>
          <ul className="space-y-2 text-zinc-500 flex flex-col items-start font-medium">
            <li><button onClick={() => onViewChange?.('about')} className="hover:text-white transition-colors cursor-pointer">About</button></li>
            <li><button onClick={() => onViewChange?.('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button></li>
            <li><button onClick={() => onViewChange?.('terms')} className="hover:text-white transition-colors cursor-pointer">Terms of Service</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 CodeBaseIQ Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://x.com/CodeBaseIQ2026" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue transition-colors">Twitter</a>
          <a href="https://www.instagram.com/codebaseiq?igsh=MXJxaHk2dDEzcDdvcA==" target="_blank" rel="noopener noreferrer" className="hover:text-brand-violet transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

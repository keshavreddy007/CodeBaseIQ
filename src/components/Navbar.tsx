import { motion } from "motion/react";
import { Code2, Github, LogOut, User, ShieldAlert, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { auth, logOut } from "../lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { AuthModal } from "./AuthModal";
import { ProfileModal } from "./ProfileModal";
import { AdminPanel } from "./AdminPanel";
import type { ViewState } from "../App";

export function Navbar({ currentView = 'landing', onViewChange }: { currentView?: ViewState; onViewChange?: (view: ViewState, subTab?: string) => void }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 inset-x-0 z-50 glass border-b-0 border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <button onClick={() => onViewChange?.('landing')} className="font-semibold tracking-tight text-lg hover:text-brand-cyan transition-colors">
              CodeBaseIQ
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-5 text-xs lg:text-sm text-zinc-400">
            <button 
              onClick={() => onViewChange?.('product', 'architecture')} 
              className={`hover:text-white transition-colors cursor-pointer font-medium ${currentView === 'product' ? 'text-brand-blue font-semibold bg-white/5 px-2.5 py-1 rounded-md border border-white/5' : ''}`}
            >
              Product
            </button>
            <button 
              onClick={() => onViewChange?.('resources', 'docs')} 
              className={`hover:text-white transition-colors cursor-pointer font-medium ${currentView === 'resources' ? 'text-brand-cyan font-semibold bg-white/5 px-2.5 py-1 rounded-md border border-white/5' : ''}`}
            >
              Resources & Sandbox
            </button>
            <button 
              onClick={() => onViewChange?.('about')} 
              className={`hover:text-white transition-colors cursor-pointer font-medium ${currentView === 'about' ? 'text-brand-violet font-semibold bg-white/5 px-2.5 py-1 rounded-md border border-white/5' : ''}`}
            >
              Company
            </button>
            {currentView === 'landing' ? (
              <>
                <a href="#features" className="hover:text-white transition-colors">Features</a>
              </>
            ) : (
              <button 
                onClick={() => onViewChange?.('landing')} 
                className="hover:text-white transition-colors cursor-pointer font-medium"
              >
                Home
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">

            {user ? (
              <div className="flex items-center gap-3">
                {currentView !== 'dashboard' && (
                  <button
                    onClick={() => onViewChange?.('dashboard')}
                    className="px-3 py-1.5 rounded-lg bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 text-xs font-semibold transition-colors border border-brand-cyan/20"
                  >
                    Dashboard
                  </button>
                )}
                {(user.email?.toLowerCase() === "reddykeshav0007@gmail.com" || user.email?.toLowerCase() === "bloodygaming398@gmail.com") && (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-xs font-semibold transition-colors border border-red-500/10"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Admin
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-white transition-colors focus:outline-none p-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  <div className="relative">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-zinc-900" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700">
                        <User className="w-4 h-4 text-zinc-400" />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
                  </div>
                  <span className="hidden sm:inline font-medium pr-1">{user.displayName || user.email?.split('@')[0]}</span>
                </motion.button>
              </div>
            ) : (
              <>
                <button onClick={() => setIsAuthOpen(true)} className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-medium transition-[background-color,transform] hover:scale-105 active:scale-95 border border-white/5">
                  Sign In
                </button>
                <button onClick={() => setIsAuthOpen(true)} className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-violet text-xs sm:text-sm font-medium text-white hover:opacity-90 transition-[opacity,transform] hover:scale-105 active:scale-95">
                  Start Free
                </button>
              </>
            )}
            
            {currentView !== 'dashboard' && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 md:hidden transition-colors cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <>
        {isMobileMenuOpen && currentView !== 'dashboard' && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-zinc-950/95 border-b border-white/10 backdrop-blur-lg md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6 text-sm text-zinc-300">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onViewChange?.('landing');
                }}
                className={`w-full text-left hover:text-white transition-colors py-2 border-b border-white/5 font-medium cursor-pointer ${currentView === 'landing' ? 'text-white font-bold' : ''}`}
              >
                Home / Landing
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onViewChange?.('product', 'architecture');
                }}
                className={`w-full text-left hover:text-white transition-colors py-2 border-b border-white/5 font-medium cursor-pointer ${currentView === 'product' ? 'text-brand-blue font-bold' : ''}`}
              >
                Product Guides
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onViewChange?.('resources', 'docs');
                }}
                className={`w-full text-left hover:text-white transition-colors py-2 border-b border-white/5 font-medium cursor-pointer ${currentView === 'resources' ? 'text-brand-cyan font-bold' : ''}`}
              >
                Resources & Sandbox
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onViewChange?.('about');
                }}
                className={`w-full text-left hover:text-white transition-colors py-2 border-b border-white/5 font-medium cursor-pointer ${currentView === 'about' ? 'text-brand-violet font-bold' : ''}`}
              >
                Company / About
              </button>
              

            </div>
          </motion.div>
        )}
      </>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user} 
        onProfileUpdated={() => {
          if (auth.currentUser) {
            setUser({ ...auth.currentUser } as FirebaseUser);
          }
        }}
      />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} user={user} />
    </>
  );
}

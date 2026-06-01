/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { DashboardPreview } from "./components/DashboardPreview";
import { Features } from "./components/Features";
import { TechStack } from "./components/TechStack";
import { Workflow } from "./components/Workflow";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { UserDashboard } from "./components/UserDashboard";
import { About } from "./components/About";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { Terms } from "./components/Terms";
import { Product } from "./components/Product";
import { Resources } from "./components/Resources";
import { CookieConsent } from "./components/CookieConsent";
import { Analytics } from "@vercel/analytics/react";
import { useState, useEffect } from "react";
import { auth } from "./lib/firebase";
import { User as FirebaseUser } from "firebase/auth";

export type ViewState = 'landing' | 'dashboard' | 'about' | 'privacy' | 'terms' | 'product' | 'resources';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [productTab, setProductTab] = useState<'architecture' | 'integrations' | 'changelog'>('architecture');
  const [resourceTab, setResourceTab] = useState<'docs' | 'api' | 'compliance' | 'blog' | 'community'>('docs');

  const handleViewChange = (view: ViewState, subTab?: string) => {
    setCurrentView(view);
    if (view === 'product') {
      if (subTab) {
        setProductTab(subTab as any);
      }
    } else if (view === 'resources') {
      if (subTab) {
        setResourceTab(subTab as any);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      const params = new URLSearchParams(window.location.search);
      const repoParam = params.get("repo");
      if (!currentUser && currentView === 'dashboard' && !repoParam) {
        setCurrentView('landing');
      }
    });
    return () => unsubscribe();
  }, [currentView]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) {
      setCurrentView("dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen selection:bg-brand-blue/30 selection:text-white">
      <Navbar currentView={currentView} onViewChange={handleViewChange} />
      
      {currentView === 'dashboard' ? (
        <main>
          <UserDashboard user={user} onNavigateHome={() => handleViewChange('landing')} />
        </main>
      ) : currentView === 'about' ? (
        <main>
          <About onNavigateHome={() => handleViewChange('landing')} />
        </main>
      ) : currentView === 'privacy' ? (
        <main>
          <PrivacyPolicy onNavigateHome={() => handleViewChange('landing')} />
        </main>
      ) : currentView === 'terms' ? (
        <main>
          <Terms onNavigateHome={() => handleViewChange('landing')} />
        </main>
      ) : currentView === 'product' ? (
        <main>
          <Product activeTab={productTab} onTabChange={setProductTab} onNavigateHome={() => handleViewChange('landing')} />
        </main>
      ) : currentView === 'resources' ? (
        <main>
          <Resources activeSection={resourceTab} onSectionChange={setResourceTab} onNavigateHome={() => handleViewChange('landing')} />
        </main>
      ) : (
        <main>
          <Hero onAnalyzeSuccess={setAnalysisResult} analysisData={analysisResult} />
          <DashboardPreview data={analysisResult} />
          <TechStack />
          <Features />
          <Workflow />
          <Testimonials />
          <FAQ />
          <FinalCTA />
        </main>
      )}
      
      <Footer onViewChange={handleViewChange} />
      <CookieConsent />
      <Analytics />
    </div>
  );
}


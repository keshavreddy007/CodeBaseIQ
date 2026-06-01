import { motion, AnimatePresence } from "motion/react";
import { 
  FileCode, 
  Network, 
  Bot, 
  LayoutTemplate, 
  Send, 
  Loader2, 
  Sparkles, 
  Download, 
  BookOpen, 
  Compass, 
  Terminal, 
  Layers, 
  Copy, 
  Check,
  FileText,
  ChevronLeft,
  ChevronRight,
  PieChart as PieChartIcon
} from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { DependencyMap } from "./DependencyMap";
import { generateStyledPDF } from "../lib/pdfExporter";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

const MOCK_ANALYTICS_DATA = [
  { name: 'TypeScript', value: 45, color: '#3178c6' },
  { name: 'React (TSX)', value: 35, color: '#00d8ff' },
  { name: 'CSS/Tailwind', value: 10, color: '#38bdf8' },
  { name: 'JSON/Config', value: 7, color: '#facc15' },
  { name: 'Other', value: 3, color: '#94a3b8' },
];

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { 
  vscDarkPlus, 
  dracula, 
  materialDark, 
  atomDark,
  nord
} from "react-syntax-highlighter/dist/esm/styles/prism";

const THEMES = {
  vscDarkPlus: { name: "VS Code Dark", style: vscDarkPlus },
  dracula: { name: "Dracula", style: dracula },
  materialDark: { name: "Material Dark", style: materialDark },
  atomDark: { name: "Atom Dark", style: atomDark },
  nord: { name: "Nord", style: nord },
};

export function DashboardPreview({ data }: { data?: any }) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'architecture' | 'onboarding' | 'dependencies' | 'walkthrough' | 'analytics'>('summary');
  const [copiedSection, setCopiedSection] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [syntaxTheme, setSyntaxTheme] = useState<keyof typeof THEMES>('vscDarkPlus');

  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={THEMES[syntaxTheme].style as any}
          language={match[1]}
          PreTag="div"
          className="rounded-lg !bg-black/50 text-xs my-4 border border-white/10"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-white/10 px-1 py-0.5 rounded text-brand-blue" {...props}>
          {children}
        </code>
      );
    },
  };

  const handleChat = async () => {
    if (!chatMessage.trim() || !data) return;
    const msg = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: 'user', content: msg }]);
    setLoadingChat(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: msg, 
          context: data,
          owner: data.owner,
          repo: data.repo
        }),
      });
      const contentType = res.headers.get("content-type");
      let chatData;
      if (contentType && contentType.includes("application/json")) {
        chatData = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text.substring(0, 120) || `Server returned invalid status (${res.status})`);
      }
      if (res.ok) {
        setChatHistory(prev => [...prev, { role: 'ai', content: chatData.reply }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', content: "Error: " + chatData.error }]);
      }
    } catch (e: any) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Failed to send message: " + e.message }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const isRealData = !!data;
  const displayData = data || {
    owner: "vercel",
    repo: "next.js",
    fileTree: [ "📁 app/", "📄 app/page.tsx", "📁 api/", "📄 api/route.ts", "📄 package.json", "📄 tsconfig.json" ],
    data: {
      summary: "### Next.js Sandbox Repository\nNext.js is a premier React enterprise framework built by Vercel. This repository represents the app-router directory topology and server middleware architecture.",
      overview: "**Next.js** is an advanced React framework that gives you the building blocks to compile lightning-fast, secure, and SEO-optimized web applications with dynamic routing.",
      architecture: "### System Architectural Design\nThis stack follows a hybrid **Client-Server Architecture** utilizing **React Server Components (RSC)** for data orchestration and **Webpack/Turbopack Bundlers**.\n\n- **Client Components** handle state operations using local hooks.\n- **Server Actions** process queries without a separate REST API layer.",
      onboarding: "### Developer Getting Started Onboarding\n\n1. **Pre-requisites**: Node.js >= 18.17.0, npm >= 9.0.0.\n2. **Setup Variables**:\n   ```bash\n   cp .env.example .env\n   ```\n3. **Install Dependencies**:\n   ```bash\n   npm install\n   ```\n4. **Boot Development Environment**:\n   ```bash\n   npm run dev\n   ```",
      walkthrough: "### System Logical Walkthrough & Request Loop\n\n1. **Entry Point**: The user initiates a client-side request at `/`.\n2. **Middleware Intercept**: `src/middleware.ts` decodes session tokens.\n3. **RSC Execution**: Next.js compiles the page server-side, queries database endpoints, and streams HTML back.",
      dependencyMap: [
        { "source": "app/layout.tsx", "target": "components/Navbar.tsx", "label": "renders" },
        { "source": "app/page.tsx", "target": "components/Hero.tsx", "label": "renders" },
        { "source": "components/Hero.tsx", "target": "api/analyze/route.ts", "label": "triggers POST" },
        { "source": "api/analyze/route.ts", "target": "@google/genai", "label": "queries Gemini" }
      ],
      authFlow: "Auth is primarily handled via NextAuth.js configured in `src/middleware.ts`.",
      infrastructure: "Hosted on AWS micro-instances or Vercel Edge Serverless functions."
    }
  };

  const handleCopySection = () => {
    let textToCopy = "";
    if (activeSubTab === 'summary') {
      textToCopy = displayData.data.summary || displayData.data.overview || "";
    } else if (activeSubTab === 'architecture') {
      textToCopy = displayData.data.architecture || `${displayData.data.authFlow || ""}\n\n${displayData.data.infrastructure || ""}`;
    } else if (activeSubTab === 'onboarding') {
      textToCopy = displayData.data.onboarding || "No onboarding guide generated.";
    } else if (activeSubTab === 'walkthrough') {
      textToCopy = displayData.data.walkthrough || "No execution walkthrough generated.";
    } else if (activeSubTab === 'dependencies') {
      textToCopy = JSON.stringify(displayData.data.dependencyMap || [], null, 2);
    }
    
    navigator.clipboard.writeText(textToCopy);
    setCopiedSection(true);
    setTimeout(() => setCopiedSection(false), 2000);
  };

  const handleDownload = () => {
    const rawMap = displayData.data.dependencyMap || [];
    const markdownContent = `
# CodeBaseIQ Architectural Analysis & Exploration Report

**Repository**: ${displayData.owner}/${displayData.repo}  
**Date generated**: ${new Date().toLocaleDateString()}

---

## 🚀 1. Executive Codebase Summary
${displayData.data.summary || displayData.data.overview || 'N/A'}

---

## 🏛️ 2. Comprehensive System Architecture
${displayData.data.architecture || 'N/A'}

### Authentication Topology
${displayData.data.authFlow || 'None explicit'}

### Infrastructure & Deployments
${displayData.data.infrastructure || 'Standard client-server environment'}

---

## 📦 3. Developer Onboarding Document
${displayData.data.onboarding || 'N/A'}

---

## 🧭 4. Interactive Walkthrough & Runtime Execution Pathway
${displayData.data.walkthrough || 'N/A'}

---

## 🔗 5. Extracted Dependency Mapping Table
| Source Module / Folder | Connection Label | Target Module / Dependency |
|---|---|---|
${rawMap.map((r: any) => `| ${r.source} | ${r.label || 'depends on'} | ${r.target} |`).join('\n') || '| N/A | N/A | N/A |'}

---
*Report exported safely via CodeBaseIQ.*
`.trim();

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${displayData.owner}-${displayData.repo}-master-architecture.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonContent = JSON.stringify(displayData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${displayData.owner}-${displayData.repo}-analysis-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMessage = (content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codebase-insight-${new Date().getTime()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative px-6 pb-32" id="dashboard">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-[0_0_120px_-30px_var(--color-brand-cyan)] relative"
        >
          {/* Dashboard Header */}
          <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center px-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden md:flex items-center gap-1 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white px-2 py-1 rounded text-xs transition-colors border border-white/5 cursor-pointer ml-1 select-none font-medium"
                title={isSidebarOpen ? "Collapse Repo Tree" : "Expand Repo Tree"}
              >
                {isSidebarOpen ? <ChevronLeft className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-brand-blue" />}
                <span className="font-mono text-[9px] uppercase font-bold tracking-wider">{isSidebarOpen ? "Hide Tree" : "Show Tree"}</span>
              </button>

              <div className="flex bg-black/40 rounded-md px-3 py-1 font-mono text-xs text-zinc-500 gap-2 items-center border border-white/5">
                 <span className="text-zinc-400">{displayData.owner}</span>
                 <span>/</span>
                 <span className="text-white">{displayData.repo}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-auto md:h-[650px] overflow-hidden w-full">
            {/* Sidebar (File Tree) */}
            <motion.div 
              initial={false}
              animate={{ 
                width: isSidebarOpen ? "25%" : "0%",
                opacity: isSidebarOpen ? 1 : 0,
                borderRightWidth: isSidebarOpen ? "1px" : "0px",
                padding: isSidebarOpen ? "16px" : "0px"
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:flex flex-col gap-4 overflow-y-auto custom-scrollbar border-white/5 bg-white/[0.01]/[0.01] shrink-0 overflow-hidden"
            >
              <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Repository</h3>
              <ul className="space-y-2 font-mono text-sm text-zinc-400">
                {(displayData.fileTree || []).slice(0, 1000).map((file: string, idx: number) => (
                  <li key={idx} className={`flex items-center gap-2 truncate ${file.includes('📁') ? 'text-brand-blue' : 'text-zinc-300'}`}>
                    {file}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col gap-5 h-[450px] sm:h-[500px] md:h-full overflow-y-auto custom-scrollbar border-b md:border-b-0 min-w-0">
              
              {/* Header Context Controls */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5"
              >
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-brand-cyan" />
                    Codebase Intelligence
                  </h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Explore generated architecture blueprints & metrics</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleDownload}
                    className="p-1 px-3 rounded-full bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-xs font-semibold border border-brand-blue/20 flex items-center gap-1.5 transition-all shadow-md shadow-brand-blue/5 cursor-pointer shrink-0"
                    title="Download entire codebase documentation compilation as Markdown"
                  >
                    <Download className="w-3.5 h-3.5" /> MD Report
                  </button>
                  <button 
                    onClick={() => generateStyledPDF(displayData)}
                    className="p-1 px-3 rounded-full bg-brand-violet/10 hover:bg-brand-violet/20 text-brand-violet text-xs font-semibold border border-brand-violet/20 flex items-center gap-1.5 transition-all shadow-md shadow-brand-violet/5 cursor-pointer shrink-0 animate-pulse hover:animate-none"
                    title="Export styled analysis report as PDF document"
                  >
                    <FileText className="w-3.5 h-3.5" /> Export PDF
                  </button>
                  <button 
                    onClick={handleDownloadJson}
                    className="p-1 px-3 rounded-full bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan text-xs font-semibold border border-brand-cyan/20 flex items-center gap-1.5 transition-all shadow-md shadow-brand-cyan/5 cursor-pointer shrink-0"
                    title="Export raw structured analysis data as JSON"
                  >
                    <FileCode className="w-3.5 h-3.5" /> Export JSON
                  </button>
                </div>
              </motion.div>

              {/* Advanced Horizontal Sub Tabs */}
              <div className="flex bg-white/[0.02] border border-white/5 rounded-xl p-1 gap-1 overflow-x-auto custom-scrollbar shrink-0 snap-x">
                <button
                  onClick={() => setActiveSubTab('summary')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 snap-start ${
                    activeSubTab === 'summary' 
                      ? 'bg-zinc-800 text-brand-blue border border-white/5 shadow-inner' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Summary
                </button>
                <button
                  onClick={() => setActiveSubTab('architecture')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 snap-start ${
                    activeSubTab === 'architecture' 
                      ? 'bg-zinc-800 text-brand-cyan border border-white/5 shadow-inner' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  Architecture
                </button>
                <button
                  onClick={() => setActiveSubTab('onboarding')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 snap-start ${
                    activeSubTab === 'onboarding' 
                      ? 'bg-zinc-800 text-amber-400 border border-white/5 shadow-inner' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Onboarding
                </button>
                <button
                  onClick={() => setActiveSubTab('walkthrough')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 snap-start ${
                    activeSubTab === 'walkthrough' 
                      ? 'bg-zinc-800 text-brand-violet border border-white/5 shadow-inner' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Walkthrough
                </button>
                <button
                  onClick={() => setActiveSubTab('dependencies')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 snap-start ${
                    activeSubTab === 'dependencies' 
                      ? 'bg-zinc-800 text-emerald-400 border border-white/5 shadow-inner' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Dependency Map
                </button>
                <button
                  onClick={() => setActiveSubTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 snap-start ${
                    activeSubTab === 'analytics' 
                      ? 'bg-zinc-800 text-blue-400 border border-white/5 shadow-inner' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <PieChartIcon className="w-3.5 h-3.5" />
                  Analytics
                </button>
              </div>

              {/* Subtab Description Utility bar with Copy */}
              <div className="flex items-center justify-between text-xs text-zinc-500 bg-white/[0.01] border border-white/5 rounded-lg p-2.5 shrink-0">
                <span className="font-medium text-zinc-400">
                  {activeSubTab === 'summary' && "🎯 Highlights, general summary and development library stack"}
                  {activeSubTab === 'architecture' && "🏛️ Folders topology, architectural design patterns, state and routing"}
                  {activeSubTab === 'onboarding' && "🏁 Developer onboarding manual: variables, dependencies, and prerequisites"}
                  {activeSubTab === 'walkthrough' && "🧭 AI runtime walkthrough: user flow lifecycle, model handlers & processes"}
                  {activeSubTab === 'dependencies' && "🔗 Relational modules imports blueprint & dependencies connections list"}
                  {activeSubTab === 'analytics' && "📊 Codebase language composition and static analysis metrics"}
                </span>

                <div className="flex items-center gap-3">
                  <select 
                    value={syntaxTheme} 
                    onChange={(e) => setSyntaxTheme(e.target.value as keyof typeof THEMES)}
                    className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-[10px] text-zinc-300 outline-none focus:border-brand-blue hidden sm:block font-mono tracking-wider"
                    title="Toggle syntax highlighting theme"
                  >
                    {Object.entries(THEMES).map(([key, theme]) => (
                      <option key={key} value={key}>{theme.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleCopySection}
                    className="p-1 px-2.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white tracking-wide transition-colors flex items-center gap-1 cursor-pointer font-medium text-[11px]"
                    title="Copy this section's source markdown content"
                  >
                    {copiedSection ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400 animate-scale-up" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Markdown
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Active Tab Panel Body */}
              <div className="flex-1 min-h-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSubTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="space-y-6 text-sm text-zinc-300 leading-relaxed font-sans"
                  >
                    {activeSubTab === 'summary' && (
                      <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                        {displayData.data.summary ? (
                          <Markdown components={markdownComponents}>{displayData.data.summary}</Markdown>
                        ) : (
                          <div className="space-y-4">
                            <Markdown components={markdownComponents}>{displayData.data.overview}</Markdown>
                            {displayData.data.suggestedReading && (
                              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                                <h4 className="text-zinc-200 font-semibold mb-2 flex items-center gap-1">
                                  <FileCode className="w-4 h-4 text-zinc-400" /> Key Files to Read First:
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-zinc-405 font-mono text-xs">
                                  {displayData.data.suggestedReading.map((file: string, idx: number) => (
                                    <li key={idx} className="hover:text-white transition-colors">{file}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {activeSubTab === 'architecture' && (
                      <div className="space-y-6">
                        {displayData.data.architecture ? (
                          <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                            <Markdown components={markdownComponents}>{displayData.data.architecture}</Markdown>
                          </div>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none text-zinc-300 space-y-6">
                            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
                              <h3 className="font-bold text-brand-cyan mb-2">Codebase Architectural Summary</h3>
                              <p className="text-zinc-400">Detailed system hierarchy extracted automatically from readmes and tree structures.</p>
                            </div>
                            <div>
                              <h4 className="text-zinc-100 font-bold mb-2">Identity & Authentication Protocol</h4>
                              <Markdown components={markdownComponents}>{displayData.data.authFlow || 'No custom auth logic identified.'}</Markdown>
                            </div>
                            {displayData.data.infrastructure && (
                              <div>
                                <h4 className="text-zinc-100 font-bold mb-2">Infrastructure & Core Deployments</h4>
                                <Markdown components={markdownComponents}>{displayData.data.infrastructure}</Markdown>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {activeSubTab === 'onboarding' && (
                      <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                        {displayData.data.onboarding ? (
                          <Markdown components={markdownComponents}>{displayData.data.onboarding}</Markdown>
                        ) : (
                          <div className="space-y-4">
                            <h3 className="text-lg font-bold text-amber-400">Developer Onboarding Guide</h3>
                            <p className="text-zinc-400">A guide generated step-by-step from repository configurations:</p>
                            
                            <div className="p-4 rounded-xl border border-white/5 bg-zinc-950/60 font-mono text-xs space-y-3 text-zinc-300">
                              <p className="text-zinc-500">{"# 1. Install Workspace packages"}</p>
                              <p>{"npm install"}</p>
                              <p className="text-zinc-500">{"# 2. Boot development server"}</p>
                              <p>{"npm run dev"}</p>
                              <p className="text-zinc-500">{"# 3. Formulate testing pipeline"}</p>
                              <p>{"npm run test || npm run build"}</p>
                            </div>
                            <p className="text-xs text-zinc-500">Check package declarations or README within the repository tab for absolute custom dependencies details.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeSubTab === 'walkthrough' && (
                      <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                        {displayData.data.walkthrough ? (
                          <Markdown components={markdownComponents}>{displayData.data.walkthrough}</Markdown>
                        ) : (
                          <div className="space-y-4">
                            <h3 className="text-lg font-bold text-brand-violet">AI Logical Walkthrough</h3>
                            <p className="text-zinc-400">Code lifecycle events, request routes, and sequence processes flow:</p>
                            
                            <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                              <div className="flex gap-3">
                                <div className="p-1 w-5 h-5 rounded bg-brand-violet/20 text-brand-violet text-xs font-bold flex items-center justify-center">1</div>
                                <div>
                                  <h4 className="font-semibold text-white text-sm">Server Registry Initialization</h4>
                                  <p className="text-xs text-zinc-500">Express starts on PORT 3000 mapping API triggers (`/api/analyze` and `/api/chat`).</p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="p-1 w-5 h-5 rounded bg-brand-violet/20 text-brand-violet text-xs font-bold flex items-center justify-center">2</div>
                                <div>
                                  <h4 className="font-semibold text-white text-sm">GitHub Fetch recursive Tree</h4>
                                  <p className="text-xs text-zinc-500">Pasting URLs recursive API request fetches folder assets directory structure from GitHub REST.</p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="p-1 w-5 h-5 rounded bg-brand-violet/20 text-brand-violet text-xs font-bold flex items-center justify-center">3</div>
                                <div>
                                  <h4 className="font-semibold text-white text-sm">Gemini Multi-Metrics Prompting</h4>
                                  <p className="text-xs text-zinc-500">Injects custom summaries, architectures, onboarding steps, and dependencies links compiling a responsive markdown report.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeSubTab === 'dependencies' && (
                      <DependencyMap relations={displayData.data.dependencyMap || []} />
                    )}

                    {activeSubTab === 'analytics' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="h-[400px] w-full flex flex-col md:flex-row items-center justify-center p-4"
                      >
                        <div className="w-full md:w-1/2 h-64 shrink-0 -ml-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={MOCK_ANALYTICS_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="rgba(255,255,255,0.05)"
                              >
                                {MOCK_ANALYTICS_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip 
                                contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#fff' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3 p-4">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><PieChartIcon className="w-4 h-4 text-brand-blue" /> Language Composition</h3>
                            <div className="space-y-2.5">
                              {MOCK_ANALYTICS_DATA.map((item, i) => (
                                <motion.div 
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  key={i} 
                                  className="flex items-center justify-between text-xs font-mono group hover:bg-white/[0.02] p-1.5 -mx-1.5 rounded transition-colors"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-3 h-3 rounded-[3px] shadow-sm transform group-hover:scale-110 transition-transform" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}40` }} />
                                    <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-wider">{item.name}</span>
                                  </div>
                                  <span className="font-semibold text-zinc-300 group-hover:text-white">{item.value}%</span>
                                </motion.div>
                              ))}
                            </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            {/* AI Chat Sidebar */}
            <div className="w-full md:w-1/4 border-t md:border-t-0 md:border-l border-white/5 bg-white/[0.01] flex flex-col relative h-[450px] sm:h-[500px] md:h-full shrink-0">
              {!isRealData && (
                <div className="absolute inset-0 z-10 bg-[#0A0A0A]/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                   <button 
                     onClick={() => {
                       const input = document.getElementById("repo-url-input");
                       if (input) {
                         input.scrollIntoView({ behavior: "smooth", block: "center" });
                         setTimeout(() => {
                           input.focus();
                         }, 500);
                       }
                     }}
                     className="text-sm font-medium text-brand-blue bg-brand-blue/10 px-4 py-2 rounded-full border border-brand-blue/20 hover:bg-brand-blue/20 hover:border-brand-blue/40 transition-all cursor-pointer shadow-lg shadow-brand-blue/5 hover:scale-105 active:scale-95"
                   >
                     Analyze a repo to unlock AI Chat
                   </button>
                </div>
              )}
              <div className="p-4 border-b border-white/5 shrink-0 bg-white/[0.01] flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase flex items-center gap-2">
                  <Bot className="w-4 h-4" /> Ask Codebase
                </h3>
                {isRealData && (
                  <select className="bg-black/40 border border-white/5 text-[10px] text-zinc-400 font-mono px-2 py-1 rounded outline-none focus:border-brand-blue/50 cursor-pointer hover:bg-white/5 transition-colors">
                    <option value="codebase">General Assistant</option>
                    <option value="architect">Architecture Sage</option>
                    <option value="security">Security Auditor</option>
                    <option value="performance">Performance Expert</option>
                  </select>
                )}
              </div>
              
              <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                {chatHistory.length === 0 && isRealData && (
                   <div className="text-center text-xs text-zinc-500 mt-10">
                     Ask anything about the architecture, auth flow, or where specific logic is located.
                   </div>
                )}
                {chatHistory.map((msg, i) => (
                   <div key={i} className={`relative p-3 text-sm rounded-xl max-w-[90%] ${msg.role === 'user' ? 'bg-brand-blue/10 border border-brand-blue/20 text-brand-blue self-end rounded-tr-sm' : 'bg-white/5 border border-white/10 text-zinc-300 self-start rounded-tl-sm'}`}>
                      {msg.role === 'ai' && (
                         <button
                           onClick={() => handleDownloadMessage(msg.content)} 
                           className="absolute top-2 right-2 p-1 bg-black/20 hover:bg-black/40 rounded transition-colors" 
                           title="Download message" 
                         >
                           <Download className="w-4 h-4 text-zinc-400" />
                         </button>
                      )}
                      <div className="prose prose-invert prose-sm max-w-none">
                         <Markdown components={markdownComponents}>{msg.content}</Markdown>
                      </div>
                   </div>
                ))}
                {loadingChat && (
                  <div className="self-start p-4 bg-white/5 border border-white/10 rounded-xl rounded-tl-sm w-72 flex flex-col gap-2.5 animate-pulse">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse shrink-0" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-blue/80 font-mono">Synthesizing codebase context...</span>
                     </div>
                     <div className="h-2.5 w-11/12 bg-white/10 rounded" />
                     <div className="h-2.5 w-4/5 bg-white/10 rounded" />
                     <div className="h-2.5 w-3/4 bg-white/5 rounded" />
                     <div className="h-2.5 w-1/2 bg-white/5 rounded" />
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-white/5 shrink-0 bg-white/[0.02]">
                <div className="relative">
                  <input 
                    type="text"
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleChat()}
                    placeholder="Ask a question..."
                    disabled={!isRealData || loadingChat}
                    className="w-full bg-black/50 border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-brand-blue/50 transition-colors disabled:opacity-50"
                  />
                  <button 
                    onClick={handleChat}
                    disabled={!isRealData || loadingChat || (!chatMessage.trim())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-md transition-colors disabled:opacity-50"
                  >
                     <Send className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

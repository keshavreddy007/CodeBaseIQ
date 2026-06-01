import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, BookOpen, Library, Code2, Rss, HelpCircle, 
  ChevronRight, Terminal, Copy, Check, Play, Search, CheckCircle2, AlertTriangle,
  ShieldAlert, Globe, Database, Plus, Trash2, Shield
} from "lucide-react";
import Markdown from "react-markdown";

interface ResourcesProps {
  onNavigateHome: () => void;
  activeSection?: ResourceSection;
  onSectionChange?: (section: ResourceSection) => void;
}

type ResourceSection = 'docs' | 'api' | 'blog' | 'community' | 'compliance';

interface DocTopic {
  id: string;
  title: string;
  category: string;
  content: string;
  code?: string;
  tips?: string[];
}

const DOC_TOPICS: DocTopic[] = [
  {
    id: 'quickstart',
    category: 'Getting Started',
    title: 'Platform Quickstart Guide',
    content: 'Welcome to CodeBaseIQ. Our platform helps you make sense of massive systems without losing hours reading file paths. To begin, you can connect any public GitHub URL directly from our homepage dashboard. The sandbox will checkout the repository, map files, execute AST symbol parsing, and enable conversational model context instantly.',
    code: 'npm install -g @codebaseiq/cli\nciq login --token=YOUR_API_TOKEN\nciq analyze . --recursive',
    tips: [
      'Ensure of safe sandboxed execution: checkout containers don\'t run malicious project dependency builders.',
      'Public repositories are cloned with git deep-cloning disabled for maximum checkout speed.',
      'To analyze a private repository, synchronize via the authorized Firebase or Admin Panel token scopes.'
    ]
  },
  {
    id: 'scopes',
    category: 'Architecture Rules',
    title: 'Managing Custom Scopes',
    content: 'CodeBaseIQ maps internal services, dependency injections, caches, and storage databases into a topology schema. If you use custom directories or unstandardized frameworks, define a `codebaseiq.config.json` inside your root directory to guide symbol resolution boundaries and AST exclusion paths explicitly.',
    code: '{\n  "version": "2.4",\n  "scopes": {\n    "services": "src/services/**",\n    "databases": ["src/db/**", "infra/**/*.tf"]\n  },\n  "exclude": ["**/node_modules/**", "**/.next/**", "**/dist/**"]\n}',
    tips: [
      'Exclude large compiled static files and bundle folders in configuration to prevent pipeline indexing timeouts.',
      'Ensure standard JSON formatting is applied. Inaccurate parameters might default AST trackers to automated fallback modes.'
    ]
  },
  {
    id: 'compilers',
    category: 'Advanced DevOps',
    title: 'Automated IaC Compilations',
    content: 'Under the Enterprise Hub, you can compile live system diagrams into Infrastructure-as-Code scripts. Once services are modified in the visual whiteboard mapper, the template engine translates current whiteboard parameters directly into clean, standardized Terraform configuration scripts.',
    code: 'resource "google_compute_subnetwork" "subnet" {\n  name          = "enterprise-subnet"\n  ip_cidr_range = "10.0.1.0/24"\n  region        = "us-central1"\n}',
    tips: [
      'Exported scripts follow standard HashiCorp structure principles.',
      'Be sure to set up appropriate provider authentication keys prior to running terraform apply in your local shell terminal.'
    ]
  },
  {
    id: 'privaterepo',
    category: 'Getting Started',
    title: 'Analyzing Private Repositories',
    content: 'CodeBaseIQ supports secure mapping and code analysis for private GitHub repositories. To index a private repository, you must supply a GitHub Personal Access Token (classic or fine-grained) with read access to the repository tree. Your token is only used client-side for sandbox requests and is never stored on our database servers.',
    code: '# Step 1: Go to GitHub Settings > Developer Settings > Personal Access Tokens\n# Step 2: Generate a token with the "repo" scope (classic) or read-only contents (fine-grained)\n# Step 3: Paste the token inside the Custom Repo Mapper in your workspace dashboard',
    tips: [
      'For classic tokens: Check the "repo" scope to enable repository tree and contents reading capabilities.',
      'For fine-grained tokens: Grant "Read-only" permissions for "Contents" and "Metadata" under Repository Permissions.',
      'To revoke access later, simply delete or expire the Personal Access Token in your GitHub Settings.'
    ]
  }
];

export function Resources({ onNavigateHome, activeSection: propActiveSection, onSectionChange }: ResourcesProps) {
  const [localSection, setLocalSection] = useState<ResourceSection>('docs');
  const activeSection = propActiveSection !== undefined ? propActiveSection : localSection;

  const setActiveSection = (section: ResourceSection) => {
    if (onSectionChange) {
      onSectionChange(section);
    } else {
      setLocalSection(section);
    }
  };

  const [selectedDocId, setSelectedDocId] = useState<string>('quickstart');

  // API Playground States
  const [apiMethod, setApiMethod] = useState<'POST' | 'GET'>('POST');
  const [targetRepo, setTargetRepo] = useState('expressjs/express');
  const [recursiveDepth, setRecursiveDepth] = useState('1');
  const [isRunningRequest, setIsRunningRequest] = useState(false);
  const [playgroundResponse, setPlaygroundResponse] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Selected article modal
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  // Compliance Lab States
  const [cloudProvider, setCloudProvider] = useState<'GCP' | 'AWS' | 'Azure'>('GCP');
  const [complianceStandard, setComplianceStandard] = useState<'SOC2' | 'HIPAA' | 'ISO27001' | 'OWASP'>('SOC2');
  const [microservices, setMicroservices] = useState([
    { name: "Auth Gateway", port: "8000", type: "Gateway / Reverse Proxy", isExposed: true, hasDb: false },
    { name: "User Service", port: "8080", type: "API REST Service", isExposed: false, hasDb: true },
    { name: "Payment Processor", port: "8100", type: "Transaction Engine", isExposed: false, hasDb: false },
    { name: "Core DB Cluster", port: "5432", type: "Relational Database", isExposed: false, hasDb: true }
  ]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePort, setNewServicePort] = useState("");
  const [newServiceType, setNewServiceType] = useState("API REST Service");
  const [newServiceExposed, setNewServiceExposed] = useState(false);
  const [newServiceHasDb, setNewServiceHasDb] = useState(false);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);

  const [complianceReport, setComplianceReport] = useState<string | null>(null);
  const [isRunningCompliance, setIsRunningCompliance] = useState(false);

  const handleRunCompliance = async () => {
    setIsRunningCompliance(true);
    setComplianceReport(null);
    try {
      const res = await fetch("/api/enterprise/compliance-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cloudProvider,
          systemScope: complianceStandard === 'SOC2' ? 'SOC2 Type II Audit' : complianceStandard === 'HIPAA' ? 'HIPAA Patient Privacy & PHI Standard' : complianceStandard === 'ISO27001' ? 'ISO 27001 ISMS Blueprint' : 'OWASP Top 10 Vulnerability Audit',
          microservices
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate compliance report");
      }
      setComplianceReport(data.report || "No response received.");
    } catch (err: any) {
      setComplianceReport(`## Scan Failed\n\nError: ${err.message || "An exception occurred during the compliance compilation."}`);
    } finally {
      setIsRunningCompliance(false);
    }
  };

  const selectedDoc = DOC_TOPICS.find(d => d.id === selectedDocId) || DOC_TOPICS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRunPlayground = () => {
    setIsRunningRequest(true);
    setPlaygroundResponse(null);
    setTimeout(() => {
      setIsRunningRequest(false);
      if (apiMethod === 'POST') {
        setPlaygroundResponse(JSON.stringify({
          status: "completed",
          task_id: `task_${Math.floor(Math.random() * 900000 + 100000)}`,
          repository: targetRepo,
          duration_ms: 1240,
          meta: {
            detected_languages: ["JavaScript", "TypeScript"],
            recursive: recursiveDepth === '1',
            status: "analyzed",
            file_count: 145,
            root_symbols_indexed: 1044
          }
        }, null, 2));
      } else {
        setPlaygroundResponse(JSON.stringify({
          status: "healthy",
          engine_version: "2.4.1",
          active_sandboxes: 4,
          queue_lag_seconds: 0.12,
          auth_scopes: ["public_read", "webhook_receive"]
        }, null, 2));
      }
    }, 1200);
  };

  const articles = [
    {
      title: "Scaling AST Semantic Indexers up to 10M Lines of Code",
      category: "Engineering",
      date: "May 25, 2026",
      readTime: "7 min read",
      excerpt: "Deep dive how we engineered safe sandboxed multi-threaded workers in Rust to extract syntax trees, resolve global references, and store relationships inside a high-speed memory-mapped graph without crashing memory buffers.",
      fullContent: "At CodeBaseIQ, code analysis speed is a core pillar. Standard single-threaded AST parsers fail during massive codebases. Our engineering group built native Rust bindings on top of specialized Tree-sitter parsers, which execute concurrently on sandboxed cluster environments. By decoupling file reading, tree building, and global symbol linkage through worker threads, we successfully reduced average analysis latency on a 1M line project from 2.5 minutes down to an incredible 7.2 seconds. This technical breakthrough unlocks immediate interactive developer feedback."
    },
    {
      title: "RAG vs. Graph-Guided Attention in Codebases",
      category: "AI Research",
      date: "April 12, 2026",
      readTime: "11 min read",
      excerpt: "Plain prompt injects lead to hallucinations. Read our experiments contrasting traditional vector database search chunkings against graph-guided AST token feeds when asking LLMs to find deep bug locations or resolve references.",
      fullContent: "Standard Retrieval-Augmented Generation (RAG) splits files into arbitrary chunks. This breaks logical connections—for example, if a method is defined on line 12 but imported in an entirely different file, naive chunking cannot map the link. CodeBaseIQ uses Graph-Guided Attention. By feeding our pre-calculated AST symbol maps alongside raw context windows, the compiler helps the model track references directly, eliminating code hallucinations and delivering precise debugging tips."
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-zinc-950 text-zinc-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button 
            onClick={onNavigateHome}
            className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold tracking-wide transition-all border border-white/5 hover:border-white/15 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:-translate-x-1 group-hover:text-white transition-transform" />
            Back to Home
          </button>
        </motion.div>

        {/* Resources Layout Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-xs font-mono mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Resource Desk
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Knowledge & API Desk
            </h1>
            <p className="mt-4 text-base text-zinc-400 max-w-xl">
              Equip yourself with comprehensive startup guidelines, production endpoints, API sandboxes, and articles.
            </p>
          </div>

          {/* Navigation Tab selection */}
          <div className="flex bg-white/[0.01] border border-white/5 p-1 rounded-xl scrollbar-none max-w-full overflow-x-auto shrink-0 gap-1 font-sans">
            {(['docs', 'api', 'compliance', 'blog', 'community'] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  activeSection === sec 
                    ? 'bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {sec === 'docs' ? 'Guides Info' : sec === 'api' ? 'API Playground' : sec === 'compliance' ? 'Compliance Lab' : sec === 'blog' ? 'Engineering Blog' : 'Community'}
              </button>
            ))}
          </div>
        </div>

        {/* Sections Content container */}
        <>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={
              activeSection === 'docs' 
                ? "grid md:grid-cols-12 gap-8 items-start" 
                : activeSection === 'api' 
                ? "grid lg:grid-cols-12 gap-8 items-stretch" 
                : activeSection === 'compliance'
                ? "grid lg:grid-cols-12 gap-8 items-stretch"
                : activeSection === 'community' 
                ? "grid sm:grid-cols-3 gap-6" 
                : "space-y-6"
            }
          >
            {activeSection === 'docs' && (
              <div className="contents">
                {/* Left sidebar topic selector */}
                <div className="md:col-span-4 space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase px-1">Documentation Categories</h3>
                <div className="space-y-1.5">
                  {DOC_TOPICS.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedDocId(topic.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between cursor-pointer ${
                        selectedDocId === topic.id
                          ? 'bg-[#0c0d12] border-brand-cyan/30 text-white shadow'
                          : 'bg-transparent border-white/5 text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-200'
                      }`}
                    >
                      <div>
                        <span className="block text-[9px] font-mono tracking-wider text-zinc-500 uppercase mb-0.5">{topic.category}</span>
                        <span className="font-semibold block">{topic.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedDocId === topic.id ? 'translate-x-1 text-brand-cyan' : 'text-zinc-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right content viewport */}
              <div className="md:col-span-8 p-8 rounded-3xl bg-[#07070a] border border-white/10 space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#06b6d4]">{selectedDoc.category}</span>
                  <h2 className="text-2xl font-bold text-white mt-1.5">{selectedDoc.title}</h2>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed">{selectedDoc.content}</p>

                {selectedDoc.code && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span>EXAMPLE NOTATION</span>
                      <button 
                        onClick={() => handleCopy(selectedDoc.code!, 'doc-code')}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedText === 'doc-code' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedText === 'doc-code' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-4 bg-black rounded-xl border border-white/5 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
                      {selectedDoc.code}
                    </pre>
                  </div>
                )}

                {selectedDoc.tips && selectedDoc.tips.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 font-mono uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" /> Implementation Advice
                    </div>
                    <ul className="text-xs text-zinc-400 space-y-1 list-disc pl-4">
                      {selectedDoc.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            )}

          {activeSection === 'api' && (
              <div className="contents">
              {/* API Configuration & Trigger Panel */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#09090c] border border-white/5 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Developer Console</h3>
                    <p className="text-xs text-zinc-500 mt-1">Simulate interactive API endpoints on live repository scopes.</p>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1.5 uppercase font-mono">METHOD SPEC</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setApiMethod('POST')}
                        className={`p-2.5 rounded-lg border text-xs font-bold tracking-wider font-mono cursor-pointer ${
                          apiMethod === 'POST' ? 'bg-brand-blue/10 border-brand-blue text-brand-blue' : 'bg-transparent border-white/5 text-zinc-500'
                        }`}
                      >
                        POST /analyze
                      </button>
                      <button 
                        onClick={() => setApiMethod('GET')}
                        className={`p-2.5 rounded-lg border text-xs font-bold tracking-wider font-mono cursor-pointer ${
                          apiMethod === 'GET' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-transparent border-white/5 text-zinc-500'
                        }`}
                      >
                        GET /health
                      </button>
                    </div>
                  </div>

                  {apiMethod === 'POST' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: "auto", height: "auto" }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="text-[10px] text-zinc-500 font-bold block mb-1 uppercase font-mono">TARGET PATH REPOSITORY</label>
                        <input 
                          type="text" 
                          value={targetRepo} 
                          onChange={(e) => setTargetRepo(e.target.value)}
                          className="w-full bg-black/60 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-500 font-bold block mb-1 uppercase font-mono">RECURSIVE STRUCT DEPT</label>
                        <select 
                          value={recursiveDepth} 
                          onChange={(e) => setRecursiveDepth(e.target.value)}
                          className="w-full bg-black/60 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-blue cursor-pointer"
                        >
                          <option value="0">Recursive level 0 (Only top index)</option>
                          <option value="1">Recursive level 1 (Exposed multi-level trees)</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={handleRunPlayground}
                    disabled={isRunningRequest}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-90 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    {isRunningRequest ? 'Contacting Sandbox...' : 'Run Simulated Snippet'}
                  </button>
                </div>
              </div>

              {/* API Response display */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-black border border-white/5 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Sandbox Response Logs</span>
                  </div>
                  {playgroundResponse && (
                    <button 
                      onClick={() => handleCopy(playgroundResponse, 'api-res')}
                      className="text-[11px] text-brand-cyan hover:underline font-mono cursor-pointer"
                    >
                      {copiedText === 'api-res' ? 'Copied Response!' : 'Copy Code'}
                    </button>
                  )}
                </div>

                <div className="flex-1 font-mono text-xs overflow-auto custom-scrollbar min-h-[250px] bg-[#030304] p-4 rounded-2xl border border-white/5 flex items-center justify-center">
                  {isRunningRequest ? (
                    <div className="text-center space-y-3">
                      <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-mono animate-pulse">Synchronizing request with server sandbox...</p>
                    </div>
                  ) : playgroundResponse ? (
                    <pre className="text-emerald-400 w-full text-left leading-relaxed font-mono">
                      {playgroundResponse}
                    </pre>
                  ) : (
                    <p className="text-zinc-650 text-center text-xs">Configure params on the left and trigger run button to see mockup response structures.</p>
                  )}
                </div>
              </div>
            </div>
            )}

          {activeSection === 'compliance' && (
            <div className="contents">
              {/* Compliance Layout Configurations Column */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#09090c] border border-white/5 flex flex-col justify-between gap-6">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 text-brand-blue mb-1">
                      <Shield className="w-4 h-4 text-brand-blue animate-pulse" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">DevSecOps Sandbox</h3>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Configure your cloud topology and trigger a premium AI security & compliance scan of your architectural layout.
                    </p>
                  </div>

                  {/* Cloud provider selection */}
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1.5 uppercase font-mono tracking-wider">Cloud Environment</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: 'GCP', label: 'GCP Cluster', color: 'hover:border-brand-blue/30' },
                        { id: 'AWS', label: 'AWS Subnet', color: 'hover:border-amber-500/30' },
                        { id: 'Azure', label: 'Azure Active', color: 'hover:border-brand-cyan/30' }
                      ] as const).map((prov) => (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => setCloudProvider(prov.id)}
                          className={`p-2 rounded-lg border text-[11px] font-bold tracking-tight font-mono transition-all duration-155 cursor-pointer ${
                            cloudProvider === prov.id 
                              ? 'bg-brand-blue/10 border-brand-blue/80 text-brand-blue shadow-sm' 
                              : `bg-transparent border-white/5 text-zinc-500 ${prov.color}`
                          }`}
                        >
                          {prov.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audit Target Select */}
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold block mb-1.5 uppercase font-mono tracking-wider">Target Regulation Standard</label>
                    <select
                      value={complianceStandard}
                      onChange={(e) => setComplianceStandard(e.target.value as any)}
                      className="w-full bg-black/60 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-brand-cyan cursor-pointer transition-colors"
                    >
                      <option value="SOC2">🔒 SOC2 Type II (Security, Availability, Confidentiality)</option>
                      <option value="HIPAA">🏥 HIPAA (Healthcare Patient Data Integrity)</option>
                      <option value="ISO27001">💼 ISO 27001 ISMS (Information Security Management)</option>
                      <option value="OWASP">🛡️ OWASP Top 10 (Access Logs & SQLi Mitigation Audit)</option>
                    </select>
                  </div>

                  {/* Microservices Topology stack list */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase font-mono tracking-wider">Registered Nodes ({microservices.length})</label>
                      <button
                        type="button"
                        onClick={() => setShowAddServiceForm(!showAddServiceForm)}
                        className="text-[10px] font-mono text-brand-cyan font-bold hover:underline flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Plus className="w-3 h-3" /> Add Node
                      </button>
                    </div>

                    {/* Inline Form Card */}
                    {showAddServiceForm && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-black/60 border border-brand-cyan/20 space-y-3 text-left"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-zinc-500 font-mono block mb-1">Service Name</label>
                            <input
                              type="text"
                              value={newServiceName}
                              onChange={(e) => setNewServiceName(e.target.value)}
                              placeholder="Order API"
                              className="w-full bg-[#050505] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-350 focus:outline-none focus:border-brand-cyan font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-zinc-500 font-mono block mb-1">Internal Port</label>
                            <input
                              type="text"
                              value={newServicePort}
                              onChange={(e) => setNewServicePort(e.target.value)}
                              placeholder="8085"
                              className="w-full bg-[#050505] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-350 focus:outline-none focus:border-brand-cyan font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pb-1 text-[11px]">
                          <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 font-sans select-none">
                            <input
                              type="checkbox"
                              checked={newServiceExposed}
                              onChange={(e) => setNewServiceExposed(e.target.checked)}
                              className="rounded border-zinc-800 bg-[#050505] text-brand-blue focus:ring-opacity-40"
                            />
                            <span>Public IP Access</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 font-sans select-none">
                            <input
                              type="checkbox"
                              checked={newServiceHasDb}
                              onChange={(e) => setNewServiceHasDb(e.target.checked)}
                              className="rounded border-zinc-800 bg-[#050505] text-brand-blue focus:ring-opacity-40"
                            />
                            <span>Relational DB</span>
                          </label>
                        </div>

                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddServiceForm(false)}
                            className="px-2.5 py-1 rounded bg-zinc-900 border border-white/5 text-[10.5px] hover:bg-zinc-800 text-zinc-400 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!newServiceName.trim()) return;
                              setMicroservices([
                                ...microservices,
                                {
                                  name: newServiceName.trim(),
                                  port: newServicePort.trim() || "80",
                                  type: newServiceHasDb ? "Relational Database" : "API REST Service",
                                  isExposed: newServiceExposed,
                                  hasDb: newServiceHasDb
                                }
                              ]);
                              setNewServiceName("");
                              setNewServicePort("");
                              setNewServiceExposed(false);
                              setNewServiceHasDb(false);
                              setShowAddServiceForm(false);
                            }}
                            className="px-2.5 py-1 rounded bg-brand-cyan text-black font-semibold text-[10.5px] hover:opacity-90 transition-all font-mono"
                          >
                            Register Node
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Nodes grid stack */}
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                      {microservices.map((svc, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between"
                        >
                          <div className="min-w-0 flex items-center gap-2">
                            {svc.hasDb ? (
                              <Database className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                            ) : svc.isExposed ? (
                              <Globe className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                            ) : (
                              <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            )}
                            <div className="min-w-0 text-left">
                              <span className="block text-xs font-semibold text-zinc-250 font-mono leading-none">{svc.name}</span>
                              <span className="text-[10px] text-zinc-500 font-mono mt-1.5 leading-none block">Port: {svc.port} • {svc.type}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {svc.isExposed && (
                              <span className="text-[8px] font-bold font-mono tracking-wide px-1.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan uppercase">Exposed</span>
                            )}
                            <button
                              type="button"
                              onClick={() => setMicroservices(microservices.filter((_, i) => i !== idx))}
                              className="p-1 hover:bg-white/5 rounded text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                              title="Deregister node"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={handleRunCompliance}
                    disabled={isRunningCompliance || microservices.length === 0}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue hover:opacity-90 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ShieldAlert className="w-4 h-4 fill-none" />
                    {isRunningCompliance ? 'Generating Audit Report...' : 'Compile Security & Threat Report'}
                  </button>
                </div>
              </div>

              {/* Compliance Report display console */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-black border border-white/5 flex flex-col justify-between" style={{ minHeight: '440px' }}>
                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-violet animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Enterprise Compliance Auditor CLI</span>
                  </div>
                  {complianceReport && (
                    <button 
                      onClick={() => handleCopy(complianceReport!, 'audit-report')}
                      className="text-[11px] text-brand-blue hover:underline font-mono cursor-pointer"
                    >
                      {copiedText === 'audit-report' ? 'Copied Report!' : 'Copy Report'}
                    </button>
                  )}
                </div>

                {/* Audit Content View */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 font-mono text-zinc-300">
                  {isRunningCompliance ? (
                    <div className="h-full flex flex-col items-center justify-center py-10 space-y-5">
                      <div className="w-8 h-8 border-2 border-brand-violet border-t-transparent rounded-full animate-spin" />
                      <div className="w-full max-w-sm space-y-2 font-mono text-[10px] text-zinc-500">
                        <p className="animate-pulse">⏳ Initializing DevSecOps auditor sandboxes...</p>
                        <p className="animate-pulse animate-delay-150">⚡ Mapping {microservices.length} registered system topologies...</p>
                        <p className="animate-pulse animate-delay-300">🧠 Scanning {complianceStandard} gap requirements securely using Gemini models...</p>
                        <p className="animate-pulse animate-delay-500">🛡️ Compiling real-time compliance scorecard and recommendation indices...</p>
                      </div>
                    </div>
                  ) : complianceReport ? (
                    <div className="prose prose-invert prose-zinc prose-sm text-zinc-300 text-left max-w-none pt-2 font-sans px-2">
                      <Markdown>{complianceReport}</Markdown>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6">
                      <Shield className="w-10 h-10 text-zinc-650 mb-3 animate-pulse" />
                      <p className="text-[11.5px] text-zinc-500 font-mono max-w-sm leading-relaxed">
                        To run a real-time SOC2 or OWASP Top 10 compliance audit, select your target environment nodes on the left and trigger compilation checks.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'blog' && (
              <div className="contents">
              {/* Blog articles columns */}
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((art, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-2xl bg-[#09090c] border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between align-stretch gap-6"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                        <span className="text-brand-cyan font-bold bg-[#0e171b] px-2.5 py-0.5 rounded-full border border-brand-cyan/10">{art.category}</span>
                        <span>{art.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">{art.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{art.excerpt}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                      <span className="text-zinc-500 font-mono text-[10px]">{art.readTime}</span>
                      <button 
                        onClick={() => setSelectedArticle(art)}
                        className="text-brand-blue hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 font-bold"
                      >
                        Read Post <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expand posts modal overlay */}
              <>
                {selectedArticle && (
                  <motion.div 
                    key="article-modal"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-8 rounded-3xl bg-zinc-950 border border-white/10 max-w-xl w-full text-left space-y-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-xs font-mono font-bold text-brand-cyan uppercase bg-brand-cyan/10 px-2.5 py-0.5 rounded border border-brand-cyan/20">
                          {selectedArticle.category}
                        </span>
                        <button 
                          onClick={() => setSelectedArticle(null)}
                          className="text-zinc-400 hover:text-white text-xs cursor-pointer px-2.5 py-1 rounded bg-white/5"
                        >
                          Close
                        </button>
                      </div>

                      <h3 className="text-xl font-bold text-white">{selectedArticle.title}</h3>
                      <div className="text-[11px] font-mono text-zinc-500 flex gap-4">
                        <span>Published: {selectedArticle.date}</span>
                        <span>{selectedArticle.readTime}</span>
                      </div>

                      <p className="text-sm text-zinc-300 leading-relaxed pt-2">
                        {selectedArticle.fullContent}
                      </p>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                        <span>CodeBaseIQ engineering logs</span>
                        <span className="text-brand-blue">© 2026</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </>
            </div>
            )}

          {activeSection === 'community' && (
              <div className="contents">
              <div className="p-6 rounded-2xl bg-[#09090c] border border-white/5 text-center space-y-4">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Active Community members</span>
                <h3 className="text-3xl font-extrabold text-white font-mono">14,240+</h3>
                <p className="text-xs text-zinc-400">Join our active Discord channel to collaborate on repository configurations, custom AST trees, and build queries.</p>
                <div className="pt-2">
                  <button className="px-4 py-2 border border-brand-blue/30 text-brand-blue bg-brand-blue/10 hover:bg-brand-blue/20 transition-all font-semibold rounded-xl text-xs cursor-pointer">
                    Connect Discord
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#09090c] border border-white/5 text-center space-y-4">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">GitHub Repository Stars</span>
                <h3 className="text-3xl font-extrabold text-white font-mono">8,980★</h3>
                <p className="text-xs text-zinc-400">CodeBaseIQ is built on top of extensive modular indexers. Check issues, submit pull queries, or review open source templates.</p>
                <div className="pt-2">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-block px-4 py-2 border border-white/10 hover:bg-white/5 transition-all text-white font-semibold rounded-xl text-xs cursor-pointer">
                    GitHub Stars
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#09090c] border border-white/5 text-center space-y-4">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Global Weekly Scans</span>
                <h3 className="text-3xl font-extrabold text-white font-mono">1.2M+</h3>
                <p className="text-xs text-zinc-400">Trusted globally by thousands of modern startups and Fortune 100 enterprise organizations running automated pipeline tests.</p>
                <div className="pt-2 flex justify-center items-center gap-1.5 text-[11px] text-green-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 animate-pulse" /> Nodes Operating Online
                </div>
              </div>
            </div>
            )}
          </motion.div>
        </>

      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, Cpu, Zap, Eye, GitBranch, Layers, 
  Terminal, ShieldCheck, RefreshCw, ChevronRight, CheckCircle2, 
  Github, GitPullRequest, Database, Slack, Code, Globe
} from "lucide-react";

interface ProductProps {
  onNavigateHome: () => void;
  activeTab?: ProductTab;
  onTabChange?: (tab: ProductTab) => void;
}

type ProductTab = 'architecture' | 'integrations' | 'changelog';

export function Product({ onNavigateHome, activeTab: propActiveTab, onTabChange }: ProductProps) {
  const [localTab, setLocalTab] = useState<ProductTab>('architecture');
  const activeTab = propActiveTab !== undefined ? propActiveTab : localTab;

  const setActiveTab = (tab: ProductTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalTab(tab);
    }
  };

  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-zinc-950 text-zinc-300">
      <div className="max-w-6xl mx-auto">
        {/* Back navigation button */}
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

        {/* Header */}
        <div className="text-center md:text-left mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-mono mb-4">
              <Code className="w-3.5 h-3.5" /> Product Center
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              CodeBaseIQ Engine Suite
            </h1>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
              Deep semantic indexers, enterprise graph solvers, and language models built directly into your secure development lifecycle.
            </p>
          </div>

          {/* Tab Sub-navigation */}
          <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-xl self-start md:self-auto max-w-full overflow-x-auto custom-scrollbar shrink-0 gap-1">
            {(['architecture', 'integrations', 'changelog'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-lg shadow-brand-blue/10' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents */}
        <>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className={activeTab === 'architecture' ? "space-y-12" : "space-y-8"}
          >
            {activeTab === 'architecture' && (
              <div className="contents">
                {/* Architecture Core Features Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#09090c] border border-white/5 space-y-4">
                  <div className="p-3 bg-brand-blue/10 w-fit rounded-xl border border-brand-blue/20 text-brand-blue">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Semantic Graph Indexer</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    CodeBaseIQ converts your repository code files into Abstract Syntax Trees (ASTs). Symbols, classes, references, and imports are indexed into an analytical multi-dimensional graph database.
                  </p>
                  <ul className="text-xs text-zinc-500 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" /> Fine-grained dependency tracking</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" /> Symbol definition resolver</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" /> Stencil and code block segmentation</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-[#09090c] border border-white/5 space-y-4">
                  <div className="p-3 bg-brand-cyan/10 w-fit rounded-xl border border-brand-cyan/20 text-brand-cyan">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">System Topology Mapper</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Automatically reconstruct architecture and infrastructure schemas. By parsing multi-module setups, Dockerfiles, and cloud templates on the fly, CodeBaseIQ creates a live connected microservice chart.
                  </p>
                  <ul className="text-xs text-zinc-500 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> Port configuration tracking</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> DB query relation graphing</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" /> Live tech-stack auto-profiler</li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-[#09090c] border border-white/5 space-y-4">
                  <div className="p-3 bg-brand-violet/10 w-fit rounded-xl border border-brand-violet/20 text-brand-violet">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">SOC2 & ISO Audit Scanners</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Identify non-compliant infrastructure settings, exposed authorization secrets, expired packages, and unencrypted transmission pipelines before code goes into master branches.
                  </p>
                  <ul className="text-xs text-zinc-500 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-violet" /> Terraform IaC audit checker</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-violet" /> Automatic compliance reports</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-brand-violet" /> Secret leak and open-port guard</li>
                  </ul>
                </div>
              </div>

              {/* Technical walkthrough deep-dive */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-brand-blue">Platform Highlight</span>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mt-2">How CodeBaseIQ processes your repository</h2>
                  <p className="text-sm text-zinc-400 mt-2">
                    When you hook a public repository or trigger analyses inside your enterprise hub, our sandbox container parses the codebase systematically:
                  </p>
                </div>

                <div className="grid sm:grid-cols-4 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 relative">
                    <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-white/5">01</div>
                    <span className="text-xs font-mono font-bold text-brand-blue uppercase">Clone & Index</span>
                    <p className="text-xs text-zinc-400">Secure sandboxed clone and flat list creation of all directories and files dynamically.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 relative">
                    <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-white/5">02</div>
                    <span className="text-xs font-mono font-bold text-brand-cyan uppercase">AST Generation</span>
                    <p className="text-xs text-zinc-400">Our native AST translators extract code bodies, identifiers, comments, and logic structures.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 relative">
                    <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-white/5">03</div>
                    <span className="text-xs font-mono font-bold text-brand-violet uppercase">Relational Solving</span>
                    <p className="text-xs text-zinc-400">Dependency links, routing pipelines, variables, cross-references and library scopes are mapped.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2 relative">
                    <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-white/5">04</div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Context Sync</span>
                    <p className="text-xs text-zinc-400">The synthesized graph database feeds LLM attention heads with highly pin-pointed code contexts.</p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {activeTab === 'integrations' && (
              <div className="contents">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Available Integrations Card */}
                <div className="p-8 rounded-3xl bg-[#08080a] border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Connected Platforms</h3>
                    <p className="text-sm text-zinc-400 mt-1">Sync your work systems seamlessly with our APIs & webhooks.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className="p-2 bg-black rounded-lg border border-white/10 text-white">
                        <Github className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">GitHub</div>
                        <div className="text-[10px] text-zinc-500 font-mono">Webhooks / Sync</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className="p-2 bg-brand-violet/10 rounded-lg border border-brand-violet/20 text-brand-violet">
                        <GitPullRequest className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">GitLab</div>
                        <div className="text-[10px] text-zinc-500 font-mono">Sync Ready</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className="p-2 bg-brand-blue/10 rounded-lg border border-brand-blue/20 text-brand-blue">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Bitbucket</div>
                        <div className="text-[10px] text-zinc-500 font-mono">Beta Access</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className="p-2 bg-[#E01E5A]/10 rounded-lg border border-[#E01E5A]/20 text-[#E01E5A]">
                        <Slack className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Slack</div>
                        <div className="text-[10px] text-zinc-500 font-mono">Notifications</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/10 text-xs text-zinc-400 flex items-start gap-2.5 leading-relaxed">
                    <Zap className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                    <span>Integrations operate via private access tokens that never leave your repository sandbox. Fully secure custom VPC endpoints can be set up via the enterprise panel.</span>
                  </div>
                </div>

                {/* API Webhooks config tool mockup */}
                <div className="p-8 rounded-3xl bg-[#08080a] border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Webhooks & DevOps API</h3>
                    <p className="text-sm text-zinc-400 mt-1">Configure automated post-commit repo scans instantly.</p>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <div className="text-zinc-500 mb-1 flex items-center justify-between">
                        <span>POST REQUEST SPEC</span>
                        <button 
                          onClick={() => handleCopy("curl -X POST https://api.codebaseiq.com/v1/analyze")}
                          className="text-brand-blue hover:underline cursor-pointer"
                        >
                          {copiedEndpoint ? "Copied!" : "Copy URL"}
                        </button>
                      </div>
                      <div className="p-3 bg-black rounded-lg border border-white/10 text-zinc-300 overflow-x-auto whitespace-pre">
{`curl -X POST https://api.codebaseiq.com/v1/analyze \\
  -H "Authorization: Bearer ciq_sk_948a" \\
  -H "Content-Type: application/json" \\
  -d '{"githubUrl": "https://github.com/react"}'`}
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 mb-1">MOCK JSON RESPONSE</div>
                      <div className="p-3 bg-black rounded-lg border border-white/10 text-emerald-400 overflow-x-auto max-h-40 overflow-y-auto">
{`{
  "status": "success",
  "id": "analysis_983df",
  "meta": {
    "repository": "facebook/react",
    "files": 4124,
    "lines_of_code": 320980
  },
  "score": {
    "compliance": "98%",
    "vulnerabilities": 0
  }
}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {activeTab === 'changelog' && (
              <div className="contents">
                {/* Release Timeline items */}
                <div className="border-l-2 border-white/5 pl-6 ml-4 space-y-12">
                
                {/* V2.4 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-brand-blue border-4 border-zinc-950" />
                  <div className="inline-block text-xs font-mono font-bold bg-brand-blue/10 border border-brand-blue/20 text-brand-blue px-2.5 py-1 rounded-md mb-2">
                    v2.4 - Latest Deployment (May 2026)
                  </div>
                  <h3 className="text-xl font-bold text-white">Semantic Multi-repo Cross References</h3>
                  <p className="text-zinc-400 text-sm mt-1 max-w-3xl">
                    You can now trace symbols, definitions, variables, and queries across completely different linked repositories. Highly valued for large microservice ecosystems mapping dependency networks dynamically.
                  </p>
                  <ul className="text-xs text-zinc-500 mt-2.5 space-y-1 list-disc pl-4">
                    <li>Cross-service route resolution matching endpoints and client API wrappers</li>
                    <li>Global Workspace context scopes for multi-repo workspace structures</li>
                    <li>Upgraded indexing speed by 4x for TypeScript repositories</li>
                  </ul>
                </div>

                {/* V2.3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-brand-cyan border-4 border-zinc-950" />
                  <div className="inline-block text-xs font-mono font-bold bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan px-2.5 py-1 rounded-md mb-2">
                    v2.3 (April 2026)
                  </div>
                  <h3 className="text-xl font-bold text-white">Live-syncing Topology Diagrams</h3>
                  <p className="text-zinc-400 text-sm mt-1 max-w-3xl">
                    Introduced the Interactive Visual Architecture Whiteboard, mapping services, caches, proxy configurations, ingress layers, and databanks in beautiful multi-colored vector circles. Perfect for visual code navigation.
                  </p>
                  <ul className="text-xs text-zinc-500 mt-2.5 space-y-1 list-disc pl-4">
                    <li>Custom node creation with customizable internal port rules</li>
                    <li>Live network pipeline wire mappings with directional tracers</li>
                    <li>Database model configuration viewer overlays</li>
                  </ul>
                </div>

                {/* V2.2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-brand-violet border-4 border-zinc-950" />
                  <div className="inline-block text-xs font-mono font-bold bg-brand-violet/10 border border-brand-violet/20 text-brand-violet px-2.5 py-1 rounded-md mb-2">
                    v2.2 (February 2026)
                  </div>
                  <h3 className="text-xl font-bold text-white">SOC2 & Terraform Auditing Centers</h3>
                  <p className="text-zinc-400 text-sm mt-1 max-w-3xl">
                    Shipped structural policy auditors to spot unverified ports, root access flags, cleartext API keys, and configuration drift from reference compliance postures in the Enterprise suite.
                  </p>
                  <ul className="text-xs text-zinc-500 mt-2.5 space-y-1 list-disc pl-4">
                    <li>Comprehensive AWS / Azure / GCP compliance benchmarks checks</li>
                    <li>Instant local IaC configuration file compilers</li>
                    <li>Secured pipeline deployment blueprints</li>
                  </ul>
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

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Info, GitFork, Copy, Check, Download } from "lucide-react";

interface Relation {
  source: string;
  target: string;
  label?: string;
}

interface DependencyMapProps {
  relations: Relation[];
}

export function DependencyMap({ relations = [] }: DependencyMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fallback relations if none provided or generated
  const activeRelations = useMemo(() => {
    if (relations && relations.length > 0) return relations;
    return [
      { source: "src/main.tsx", target: "src/App.tsx", label: "mounts" },
      { source: "src/App.tsx", target: "src/components/Navbar.tsx", label: "imports" },
      { source: "src/App.tsx", target: "src/components/Hero.tsx", label: "imports" },
      { source: "src/App.tsx", target: "src/components/DashboardPreview.tsx", label: "imports" },
      { source: "src/components/Hero.tsx", target: "server.ts", label: "/api/analyze endpoint" },
      { source: "src/components/DashboardPreview.tsx", target: "src/components/DependencyMap.tsx", label: "imports" },
      { source: "server.ts", target: "@google/genai SDK", label: "calls Gemini" },
      { source: "server.ts", target: "firebase-admin", label: "verifies security" }
    ];
  }, [relations]);

  const uniqueNodes = useMemo(() => {
    const nodes = new Set<string>();
    activeRelations.forEach(r => {
      nodes.add(r.source);
      nodes.add(r.target);
    });
    return Array.from(nodes);
  }, [activeRelations]);

  const filteredRelations = useMemo(() => {
    if (!searchQuery) return activeRelations;
    const query = searchQuery.toLowerCase();
    return activeRelations.filter(r => 
      r.source.toLowerCase().includes(query) || 
      r.target.toLowerCase().includes(query) || 
      (r.label && r.label.toLowerCase().includes(query))
    );
  }, [activeRelations, searchQuery]);

  // Arrange nodes into visual columns for SVG path connection
  const arrangedNodes = useMemo(() => {
    // Left nodes are sources that are rarely targets
    // Right nodes are targets that are rarely sources
    const sources = new Set(activeRelations.map(r => r.source));
    const targets = new Set(activeRelations.map(r => r.target));
    
    const leftColumn = Array.from(sources).filter(node => !targets.has(node) || sources.has(node));
    const rightColumn = Array.from(targets).filter(node => !leftColumn.includes(node));
    
    // Fallback if columns are broken
    if (leftColumn.length === 0) {
      return { 
        left: uniqueNodes.slice(0, Math.ceil(uniqueNodes.length / 2)), 
        right: uniqueNodes.slice(Math.ceil(uniqueNodes.length / 2)) 
      };
    }
    return { left: leftColumn.slice(0, 10), right: rightColumn.slice(0, 10) };
  }, [activeRelations, uniqueNodes]);

  const handleCopyRaw = () => {
    const text = JSON.stringify(activeRelations, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeHoverNode = hoveredNode || selectedNode;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 bg-brand-cyan/10 rounded-lg text-brand-cyan">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Interactive Dependency Blueprint</h3>
            <p className="text-xs text-zinc-500">Hover or click a node to highlight input/output data flow curves.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-brand-cyan transition-colors w-full sm:w-48"
            />
          </div>
          <button 
            onClick={handleCopyRaw}
            className="p-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-medium cursor-pointer transition-colors flex items-center gap-1 shrink-0"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            Copy JSON
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative rounded-xl border border-white/5 bg-black/60 p-6 min-h-[340px] flex flex-col justify-between overflow-hidden">
        
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Dynamic Canvas Container */}
        <div className="w-full overflow-x-auto scrollbar-thin pb-2 z-10 relative">
          <div className="min-w-[580px] md:min-w-0 grid grid-cols-12 gap-4 items-center justify-between h-[240px]">
            
            {/* Left Side: Sources */}
            <div className="col-span-4 flex flex-col gap-2 justify-center h-full">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2 text-left px-2">Sources / Modules</span>
              {arrangedNodes.left.map((node, i) => {
                const isSelected = selectedNode === node;
                const isHovered = hoveredNode === node;
                const hasFocus = activeHoverNode === node || (activeHoverNode && activeRelations.some(r => r.source === node && (r.target === activeHoverNode || r.source === activeHoverNode)));
                
                return (
                  <motion.div 
                    key={node}
                    initial={{ opacity: 0, x: -16, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.24, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(selectedNode === node ? null : node)}
                    className={`p-2 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer select-none text-left truncate ${
                      isSelected ? 'bg-brand-blue/25 border-brand-blue/60 text-white shadow-lg' : 
                      isHovered ? 'bg-white/10 border-white/20 text-white' :
                      activeHoverNode && !hasFocus ? 'opacity-30 border-white/5 text-zinc-500' :
                      'bg-white/[0.02] border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    📁 {node}
                  </motion.div>
                );
              })}
            </div>

            {/* Center Connection Paths (SVG overlay) */}
            <div className="col-span-4 h-full relative">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {arrangedNodes.left.map((leftNode, lIdx) => {
                  const totalL = arrangedNodes.left.length;
                  const yL = 40 + (lIdx / (totalL - 1 || 1)) * 160;

                  return arrangedNodes.right.map((rightNode, rIdx) => {
                    const totalR = arrangedNodes.right.length;
                    const yR = 40 + (rIdx / (totalR - 1 || 1)) * 160;

                    // Find relation
                    const rel = activeRelations.find(r => r.source === leftNode && r.target === rightNode);
                    if (!rel) return null;

                    const isPathHighlighted = 
                      activeHoverNode === leftNode || 
                      activeHoverNode === rightNode;
                    
                    const isSpecificActive = 
                      (hoveredNode === leftNode && !selectedNode) || 
                      (selectedNode === leftNode) || 
                      (hoveredNode === rightNode && !selectedNode) || 
                      (selectedNode === rightNode);

                    return (
                      <g key={`${leftNode}-${rightNode}`}>
                        <motion.path
                          d={`M 0,${yL} C 40,${yL} 80,${yR} 120,${yR}`}
                          fill="none"
                          stroke={isPathHighlighted ? "url(#gradient-flow)" : "rgba(255,255,255,0.08)"}
                          strokeWidth={isPathHighlighted ? 2.5 : 1}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.8 }}
                          transition={{ duration: 0.65, delay: (lIdx + rIdx) * 0.02, ease: "easeOut" }}
                          className={isSpecificActive ? "animate-[dash_2s_linear_infinite]" : ""}
                          style={{
                            strokeDasharray: isSpecificActive ? "6,4" : "none"
                          }}
                        />
                      </g>
                    );
                  });
                })}

                {/* Define gradients for the paths */}
                <defs>
                  <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Right Side: Targets */}
            <div className="col-span-4 flex flex-col gap-2 justify-center h-full">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2 text-right px-2">Targets / Packages</span>
              {arrangedNodes.right.map((node, i) => {
                const isSelected = selectedNode === node;
                const isHovered = hoveredNode === node;
                const hasFocus = activeHoverNode === node || (activeHoverNode && activeRelations.some(r => r.target === node && (r.source === activeHoverNode || r.target === activeHoverNode)));

                return (
                  <motion.div 
                    key={node}
                    initial={{ opacity: 0, x: 16, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.24, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(selectedNode === node ? null : node)}
                    className={`p-2 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer select-none text-right truncate ${
                      isSelected ? 'bg-brand-cyan/25 border-brand-cyan/60 text-white shadow-lg' : 
                      isHovered ? 'bg-white/10 border-white/20 text-white' :
                      activeHoverNode && !hasFocus ? 'opacity-30 border-white/5 text-zinc-500' :
                      'bg-white/[0.02] border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    📄 {node}
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Selected connection details */}
        {activeHoverNode && (
          <div className="mt-4 p-2.5 rounded-lg bg-zinc-950/80 border border-white/5 text-xs text-zinc-300 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
            <div className="truncate">
              Focus is set to <strong className="text-white font-mono">{activeHoverNode}</strong>. Connections detected:{" "}
              <span className="text-zinc-400 font-medium">
                {activeRelations
                  .filter(r => r.source === activeHoverNode || r.target === activeHoverNode)
                  .map(r => r.source === activeHoverNode ? `→ connects to ${r.target}` : `← connected by ${r.source}`)
                  .join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Relations Query Table List */}
      <div className="border border-white/5 rounded-xl bg-[#08080a] overflow-hidden">
        <div className="p-3 border-b border-white/5 bg-white/[0.01]">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Indexed Connections ({filteredRelations.length})</h4>
        </div>
        <div className="max-h-[180px] overflow-y-auto custom-scrollbar text-xs">
          <table className="w-full text-left font-mono">
            <tbody>
              {filteredRelations.map((rel, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 text-zinc-300 truncate max-w-[150px]">{rel.source}</td>
                  <td className="p-3 text-brand-cyan text-center shrink-0">
                    <span className="bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded text-[10px] font-sans font-medium capitalize">
                      {rel.label || "imports"}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400 truncate max-w-[150px]">{rel.target}</td>
                </tr>
              ))}
              {filteredRelations.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-zinc-650 italic">No connections match your query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

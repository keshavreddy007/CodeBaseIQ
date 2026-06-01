import { motion } from "motion/react";
import { 
  Search, 
  Folder, 
  Clock, 
  GitBranch, 
  Star, 
  Lock, 
  Eye, 
  Trash2, 
  ArrowLeft, 
  Bot, 
  Sparkles, 
  Send, 
  Loader2, 
  HelpCircle, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Check, 
  Network, 
  AlertCircle,
  Terminal,
  Layers,
  BookOpen,
  Compass,
  Download,
  Copy,
  User as UserIcon,
  RefreshCw,
  Share2
} from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DependencyMap } from "./DependencyMap";

const DIRTY_TEMPLATES = [
  {
    name: "⚛️ Dynamic React Memory Leak",
    language: "typescript",
    label: "Props with 'any', infinite re-renders",
    code: `import React, { useState, useEffect } from 'react';

// Anti-Pattern: Prop types declared as 'any', implicit re-renders, unsafe listeners without teardown.
export default function UserTicker(props: any) {
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Problem: Causes infinite re-render loop if deps or objects inside re-trigger
    const interval = setInterval(() => {
      setCounter(counter + 1);
    }, 1000);

    // Problem: Attaching listener to window without executing cleanup on unmount
    window.addEventListener('resize', () => {
      console.log('Window resized to', window.innerWidth);
    });

    const fetchUser = async () => {
      const response = await fetch('/api/user/' + props.userId);
      const json = await response.json();
      setData(json); // Causes state check mismatch
    };
    fetchUser();
  }, [props]); // Re-triggered on every parent object reference

  return (
    <div>
      <h3>Ticker: {counter}</h3>
      <ul>
        {data.map((item: any) => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}`
  },
  {
    name: "🔒 Vulnerable SQL & Auth Route",
    language: "javascript",
    label: "Raw query concat, weak hash, no injection guards",
    code: `const express = require('express');
const router = express.Router();
const db = require('../lib/database');

// Anti-Pattern: Directly concatenating query strings (SQLi), plain text comparisons.
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // CRITICAL: Raw query concatenation allows direct SQL Injection!
  const query = "SELECT id, username, role FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length > 0) {
      // Weak session token without HMAC signature protection
      const mockSession = { userId: result[0].id, role: result[0].role, time: Date.now() };
      res.cookie('user_session', JSON.stringify(mockSession));
      res.json({ success: true, message: "Welcome " + result[0].username });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });
});`
  },
  {
    name: "⚡ Unoptimized Loop Allocation",
    language: "typescript",
    label: "Quadratic complexity (O(N^2)) lookup arrays",
    code: `// Anti-Pattern: Repetitive O(N) Array lookup inside O(N) loops. Repetitive cloning.
export function findDuplicatesAndMetrics(records: any[]) {
  const duplicates = [];

  for (let i = 0; i < records.length; i++) {
    const item = records[i];
    
    // Problem: O(N) scan nested inside another loop, leading to O(N^2) quadratic performance
    const matchCount = records.filter(r => r.id === item.id).length;
    if (matchCount > 1) {
      // Problem: O(N) lookup checking before unique push
      if (!duplicates.includes(item)) {
        duplicates.push(item);
      }
    }
  }

  // Large unnecessary garbage collections
  const cloned = JSON.parse(JSON.stringify(records));
  const sorted = cloned.sort((a,b) => a.id - b.id);

  return { duplicates, sorted };
}`
  }
];

const DEVELOPER_AGENTS = [
  {
    id: "senior_dev",
    name: "Senior Lead Engineer",
    roleName: "Senior Lead Software Engineer",
    description: "Expert at clean patterns, robust abstractions, code smells, refactoring models, and runtime debugging protocols.",
    icon: Bot,
    color: "from-brand-blue to-brand-cyan",
    textColor: "text-brand-blue",
    borderColor: "border-brand-blue/20",
    bgHover: "hover:bg-brand-blue/5",
    systemPrompt: "You are the Senior Lead Engineer. You write elegant, modular, production-grade TypeScript, Go, Rust, or Python code. You explain complex architectural patterns clearly, adhere to SOLID principles and DRY coding, find bad smells or anti-patterns, and provide immediate refactoring strategies for modern runtimes.",
    presets: [
      { label: "Architectural Bottlenecks", text: "Explain the main component relationships and find if there are any obvious bottlenecks or architectural violations." },
      { label: "Refactor Snippets", text: "Look over typical components in a project like this and give direct refactoring suggestions for safer state management." },
      { label: "Implement Event Handler", text: "Show how to implement a clean asynchronous event processor using TypeScript classes and strict types." }
    ]
  },
  {
    id: "architect",
    name: "Enterprise Architect",
    roleName: "Enterprise Cloud Architect",
    description: "Specializes in high-availability backend routing, container orchestration, isolated subnet topologies, and gateway specs.",
    icon: Network,
    color: "from-brand-violet to-brand-blue",
    textColor: "text-brand-violet",
    borderColor: "border-brand-violet/20",
    bgHover: "hover:bg-brand-violet/5",
    systemPrompt: "You are the Enterprise Cloud Architect. You specialize in microservices, multi-region database replication, event-driven Message Queues (Kafka, RabbitMQ), VPC configurations, custom load balancers, and Kubernetes infrastructure maps for high-throughput enterprise systems.",
    presets: [
      { label: "Autoscale Microservices", text: "Draft a high-throughput, auto-scaling microservices architecture design for our order dispatch system." },
      { label: "Secure Gateway Redirection", text: "Explain and construct a secure multi-region gateway routing policy configuration supporting decoupled user tokens." },
      { label: "VPC Private Subnet Map", text: "Generate a subnet topology structure showing isolated private containers, relational database access, and cache clusters." }
    ]
  },
  {
    id: "performance",
    name: "Performance Engineer",
    roleName: "High-Performance Systems Engineer",
    description: "Analyzes code latency, memory-leaks, database execution plans, Redis caching, and bundle optimizations.",
    icon: Zap,
    color: "from-yellow-400 to-amber-500",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/20",
    bgHover: "hover:bg-amber-500/5",
    systemPrompt: "You are the High-Performance Systems Engineer. You are obsessed with microsecond latency, highly optimized memory footprints, database execution indexing, efficient Redis cluster caching models, asset compilation size reduction, and asynchronous non-blocking scheduling loops.",
    presets: [
      { label: "React Memory Leak Check", text: "Trace and resolve standard memory leaks in high-frequency React dynamic event-listener loops." },
      { label: "Redis Staging Rate Limiter", text: "Build an efficient sliding-window API rate limiter logic supported by Redis atomic commands." },
      { label: "Database Outer Join Index", text: "Write an optimal SQL database indexing strategy for queries needing multiple outer joins in high volume." }
    ]
  },
  {
    id: "security",
    name: "Cybersecurity Auditor",
    roleName: "Enterprise Cybersecurity Auditor (SOC2 / OWASP)",
    description: "Audits code for injection holes, evaluates cross-origin session policies, secures token transfers, and guides SOC2 readiness.",
    icon: ShieldCheck,
    color: "from-emerald-400 to-green-500",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgHover: "hover:bg-emerald-500/5",
    systemPrompt: "You are the Cybersecurity Security Expert. You audit source codes against OWASP Top 10 vulnerabilities, unauthorized privilege escalations, unsafe JSON Web Token validation, database injection attacks (SQLi, NoSQLi), and layout secure configurations matching standard SOC2 compliance checks.",
    presets: [
      { label: "OAuth Redirection Leak Test", text: "Verify standard OAuth callback redirect endpoints to prevent potential authorization token hijack or exposure." },
      { label: "Anti-SQL Injection Middleware", text: "Implement a robust security middleware layer designed to enforce sanitization and prevent nested script injection." },
      { label: "SOC2 Compliance Container Set", text: "List key architectural checklist items necessary to establish SOC2 Type II compliance in public cloud containers." }
    ]
  },
  {
    id: "qa",
    name: "QA & Automation Specialist",
    roleName: "Lead Automation & QA Engineer",
    description: "Writes Jest mock interfaces, details Cypress/Playwright integration scenarios, and ensures high test coverage.",
    icon: Check,
    color: "from-brand-cyan to-brand-blue",
    textColor: "text-brand-cyan",
    borderColor: "border-brand-cyan/20",
    bgHover: "hover:bg-brand-cyan/5",
    systemPrompt: "You are the Lead QA and Test Automation Specialist. You design comprehensive test matrices and write clean JUnit/Jest mock test sets, automated integration pipelines, headless end-to-end tests (Cypress, Playwright), and guard against runtime boundary regressions.",
    presets: [
      { label: "Jest Asynchronous Tests", text: "Create 5 comprehensive unit tests for a complex async API calling service using mock timers." },
      { label: "Playwright Dynamic Flows", text: "Generate a standard user-onboarding automation workflow script matching multi-page user logins with validation checks." },
      { label: "Direct Mock Injection", text: "Explain how to inject easily mockable dependency interfaces into deeply nested system module components." }
    ]
  }
];

const markdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus as any}
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

interface UserDashboardProps {
  user: FirebaseUser | null;
  onNavigateHome: () => void;
}

export function UserDashboard({ user, onNavigateHome }: UserDashboardProps) {
  const [activeAgentId, setActiveAgentId] = useState<string>("senior_dev");
  
  // Saved Repositories State
  const [repositories, setRepositories] = useState(() => {
    const backup = localStorage.getItem("local_dashboard_repos");
    const rawRepos = backup ? JSON.parse(backup) : [
      { 
        id: 1, 
        name: "facebook/react", 
        analysisDate: "2 hours ago", 
        syncTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'short' }),
        status: "completed", 
        visibility: "public", 
        context: "React is a JavaScript library for building component-based declarative user interfaces. It uses virtual DOM representation and Fiber architecture for optimized rendering schedules.",
        tags: ["frontend", "library", "ui", "framework", "virtual-dom"]
      },
      { 
        id: 2, 
        name: "vercel/next.js", 
        analysisDate: "Yesterday", 
        syncTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'short' }),
        status: "completed", 
        visibility: "public", 
        context: "Next.js is a React meta-framework enabling full-stack capabilities. Includes file-based routing via App Router, React Server Components (RSC), Server Actions, and automatic static optimization.",
        tags: ["meta-framework", "ssr", "fullstack", "react", "routing"]
      },
      { 
        id: 3, 
        name: "tailwindlabs/tailwindcss", 
        analysisDate: "3 days ago", 
        syncTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'short' }),
        status: "completed", 
        visibility: "public", 
        context: "Tailwind CSS is a utility-first CSS framework. It utilizes compiled JIT styling, theme configurations, custom presets, and responsive utilities directly within HTML/JSX class definitions.",
        tags: ["utility-first", "css", "styling", "design-system", "tailwindcss"]
      },
    ];
    // Ensure existing backup entries also receive fallback syncTimestamp and tags if missing
    return rawRepos.map((r: any) => {
      if (!r.syncTimestamp) {
        let diffMs = 2 * 60 * 60 * 1000;
        if (r.analysisDate === "Yesterday") diffMs = 24 * 60 * 60 * 1000;
        else if (r.analysisDate === "3 days ago") diffMs = 3 * 24 * 60 * 60 * 1000;
        r.syncTimestamp = new Date(Date.now() - diffMs).toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'short' });
      }
      if (!r.tags) {
        const fallbackTags: string[] = ["frontend"];
        const lowerName = r.name.toLowerCase();
        if (lowerName.includes("react")) fallbackTags.push("library", "ui", "framework");
        if (lowerName.includes("next")) fallbackTags.push("meta-framework", "ssr", "fullstack");
        if (lowerName.includes("tailwind")) fallbackTags.push("utility-first", "css", "styling");
        if (lowerName.includes("express") || lowerName.includes("node")) fallbackTags.push("backend", "node");
        r.tags = fallbackTags;
      }
      return r;
    });
  });

  // AI Chat Agent State
  const [selectedRepo, setSelectedRepo] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) {
      return repoParam;
    }
    return "facebook/react";
  });
  const [customRepoUrl, setCustomRepoUrl] = useState("");
  const [customRepoToken, setCustomRepoToken] = useState("");
  const [showTokenHelp, setShowTokenHelp] = useState(false);
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [addingError, setAddingError] = useState("");

  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [copiedSection, setCopiedSection] = useState(false);

  // Column 3 active tab selection ('overview', 'architecture', 'onboarding', 'dependency', 'refactor')
  const [activeTab, setActiveTab ] = useState<"overview" | "architecture" | "onboarding" | "dependency" | "refactor">("overview");

  // Operational Chaos/Architecture Simulation States
  const [archViewMode, setArchViewMode] = useState<"docs" | "sandbox">("docs");
  const [simTrafficRate, setSimTrafficRate] = useState<number>(85);
  const [rateLimitActive, setRateLimitActive] = useState<boolean>(false);
  const [circuitBreakerActive, setCircuitBreakerActive] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([
    "INITIALIZING: Operational Chaos Sandbox booted successfully.",
    "ROUTING: Global edge gateways active on port 443.",
    "MONITORING: Simulated nodes (4/4) verified healthy in auto-scale cluster."
  ]);
  const [nodesState, setNodesState] = useState([
    { id: "gateway", name: "CDN / Reverse Proxy IP", status: "healthy", latency: 8, cpu: 12, maxCpu: 100 },
    { id: "auth", name: "OAuth Identity Provider API", status: "healthy", latency: 15, cpu: 18, maxCpu: 100 },
    { id: "payment", name: "Transaction Gateway Engine", status: "healthy", latency: 24, cpu: 14, maxCpu: 100 },
    { id: "database", name: "Active Cloud Spanner DB", status: "healthy", latency: 4, cpu: 22, maxCpu: 100 }
  ]);

  // AI Refactoring Lab States
  const [refactorCodeInput, setRefactorCodeInput] = useState(DIRTY_TEMPLATES[0].code);
  const [refactorLanguage, setRefactorLanguage] = useState("typescript");
  const [refactorMode, setRefactorMode] = useState<'solid' | 'performance' | 'typesafe' | 'security' | 'unittests'>('solid');
  const [refactorResult, setRefactorResult] = useState<any>(null);
  const [loadingRefactor, setLoadingRefactor] = useState(false);
  const [refactorError, setRefactorError] = useState("");

  // Mobile active panel selection ('catalog' | 'chat' | 'blueprint') for responsive screens
  const [mobileActivePanel, setMobileActivePanel] = useState<"catalog" | "chat" | "blueprint">("chat");

  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const handleShareClick = () => {
    if (!activeRepo) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?repo=${encodeURIComponent(activeRepo.name)}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoParam = params.get("repo");
    if (repoParam) {
      const exists = repositories.find((r: any) => r.name.toLowerCase() === repoParam.toLowerCase());
      if (!exists) {
        // Automatically add this shared repository to the workspace as analyzing and trigger initial compilation!
        const newId = Date.now();
        const calculatedTags = ["frontend"];
        const lowerName = repoParam.toLowerCase();
        if (lowerName.includes("react")) calculatedTags.push("library", "ui", "framework");
        if (lowerName.includes("next")) calculatedTags.push("meta-framework", "ssr", "fullstack");
        if (lowerName.includes("tailwind")) calculatedTags.push("utility-first", "css", "styling");
        if (lowerName.includes("express") || lowerName.includes("node")) calculatedTags.push("backend", "node");

        const newRepo = {
          id: newId,
          name: repoParam,
          analysisDate: "Analyzing shared link...",
          syncTimestamp: "In progress",
          status: "analyzing",
          visibility: "public",
          context: "Connecting to GitHub API through shared deep link to list codebase folder tree and summarize structure...",
          tags: calculatedTags
        };

        setRepositories((prev: any) => [newRepo, ...prev]);
        setSelectedRepo(repoParam);

        // Trigger analysis
        const triggerDeepLinkAnalysis = async () => {
          try {
            const normalizedUrl = `https://github.com/${repoParam}`;
            const res = await fetch("/api/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ githubUrl: normalizedUrl })
            });
            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
              data = await res.json();
            } else {
              const text = await res.text();
              throw new Error(text.substring(0, 120) || `Server returned invalid status (${res.status})`);
            }
            if (!res.ok) {
              throw new Error(data.error || "Failed to analyze this repository.");
            }

            let aiContext = "";
            if (data.data) {
              const { overview, authFlow, infrastructure, suggestedReading } = data.data;
              aiContext = `SYSTEM OVERVIEW:\n${overview || "N/A"}\n\nINFRASTRUCTURE:\n${infrastructure || "N/A"}\n\nAUTH FLOW:\n${authFlow || "N/A"}`;
              if (suggestedReading && suggestedReading.length > 0) {
                aiContext += `\n\nSUGGESTED DOCUMENTS TO DISCUSS:\n${suggestedReading.map((file: string) => `- ${file}`).join('\n')}`;
              }
            } else {
              aiContext = `Repository ${repoParam} is connected. Structure: ${data.fileTree?.join(", ") || "N/A"}`;
            }

            setRepositories((prev: any) => prev.map((r: any) => r.id === newId ? {
              ...r,
              status: "completed",
              analysisDate: "Analyzed just now",
              syncTimestamp: new Date().toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'short' }),
              context: aiContext,
              analysisData: data.data,
              fileTree: data.fileTree
            } : r));
          } catch (err: any) {
            console.error("Deep link analysis failed:", err);
            setRepositories((prev: any) => prev.map((r: any) => r.id === newId ? {
              ...r,
              status: "failed",
              analysisDate: "Analysis failed",
              context: `Could not parse shared deep link: ${err.message || "Ensure the target repository is public and accessible."}`
            } : r));
          }
        };

        triggerDeepLinkAnalysis();
      } else {
        setSelectedRepo(exists.name);
      }
    }
  }, []);

  // Filtering & Search for Repository List
  const [repoSearch, setRepoSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "public" | "private">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "analyzing" | "failed">("all");

  useEffect(() => {
    localStorage.setItem("local_dashboard_repos", JSON.stringify(repositories));
  }, [repositories]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, loadingChat]);

  // Operational Chaos Simulator Tick Engine
  useEffect(() => {
    if (activeTab !== "architecture" || archViewMode !== "sandbox") return;

    const interval = setInterval(() => {
      setNodesState((prevNodes) => {
        return prevNodes.map((node) => {
          let newCpu = node.cpu;
          let newLatency = node.latency;
          let status = "healthy";

          const isDatabase = node.id === "database";
          const isGateway = node.id === "gateway";
          const isAuth = node.id === "auth";
          const isPayment = node.id === "payment";

          const cpuJitter = Math.floor((Math.random() - 0.5) * 4);
          const latencyJitter = Math.floor((Math.random() - 0.5) * 3);

          if (simTrafficRate > 500) {
            if (rateLimitActive) {
              newCpu = Math.max(10, Math.min(65, Math.floor(25 * (1 + (Math.random() - 0.5) * 0.15)) + cpuJitter));
              newLatency = Math.max(5, Math.min(180, Math.floor(isGateway ? 18 + latencyJitter : node.latency * 0.95)));
              status = "healthy";
            } else {
              newCpu = Math.max(20, Math.min(98, Math.floor(node.cpu + (simTrafficRate / 35) + cpuJitter)));
              newLatency = Math.max(10, Math.min(1200, Math.floor(isDatabase ? 18 + (simTrafficRate / 100) : node.latency + (simTrafficRate / 120))));
              if (newCpu > 80) {
                status = "overloaded";
              }
            }
          } else {
            if (isGateway) {
              newCpu = Math.max(5, Math.min(25, 10 + cpuJitter));
              newLatency = Math.max(2, Math.min(12, 6 + latencyJitter));
            } else if (isAuth) {
              newCpu = Math.max(8, Math.min(30, 15 + cpuJitter));
              newLatency = Math.max(5, Math.min(22, 12 + latencyJitter));
            } else if (isPayment) {
              newCpu = Math.max(6, Math.min(25, 12 + cpuJitter));
              newLatency = Math.max(10, Math.min(35, 20 + latencyJitter));
            } else if (isDatabase) {
              newCpu = Math.max(10, Math.min(40, 18 + cpuJitter));
              newLatency = Math.max(2, Math.min(8, 4 + latencyJitter));
            }
            status = "healthy";
          }

          if (circuitBreakerActive && isPayment) {
            newCpu = 4;
            newLatency = 2;
            status = "overloaded";
          }

          return {
            ...node,
            cpu: Math.min(node.maxCpu, Math.max(2, newCpu)),
            latency: Math.max(1, newLatency),
            status: status as any
          };
        });
      });

      const logOptions = [
        `PROXIED IP: Secure SSL reverse routing completed in 3.1ms.`,
        `AUTH VERIFICATION: Checked scope validation headers. Status: 200 OK`,
        `DB DECRYPT: Executing secure transaction ledger save.`,
        `SANDBOX WEBHOOK: Emitted telemetry stream packet to monitoring agent.`,
        `AUTOSCALING ENGINE: Monitored active task limits in standard safety margins.`,
        `CIRCUIT WATCHER: Node response values standard. Zero active bypasses.`
      ];

      const chosenEvent = logOptions[Math.floor(Math.random() * logOptions.length)];
      const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
      
      setSimLogs((prev) => {
        const next = [`[${ts}] ${chosenEvent}`, ...prev];
        return next.slice(0, 12);
      });

    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab, archViewMode, simTrafficRate, rateLimitActive, circuitBreakerActive]);

  const handleAddCustomRepo = async () => {
    setAddingError("");
    if (!customRepoUrl.trim()) return;
    
    const url = customRepoUrl.trim();
    let repoName = url;
    
    if (url.includes("github.com/")) {
      const parts = url.split("github.com/");
      if (parts[1]) {
        repoName = parts[1].replace(/\/$/, "");
      }
    }

    if (!repoName.includes("/")) {
      setAddingError("Invalid GitHub format. Must be owner/repo (e.g. facebook/react) or full github url");
      return;
    }

    if (repositories.some((r: any) => r.name.toLowerCase() === repoName.toLowerCase())) {
      setAddingError("This repository already exists in your workspace.");
      return;
    }

    const tokenToUse = customRepoToken.trim();
    const isPrivate = !!tokenToUse;

    const newId = Date.now();
    const calculatedTags = ["frontend"];
    const lowerName = repoName.toLowerCase();
    if (lowerName.includes("react")) calculatedTags.push("library", "ui", "framework");
    if (lowerName.includes("next")) calculatedTags.push("meta-framework", "ssr", "fullstack");
    if (lowerName.includes("tailwind")) calculatedTags.push("utility-first", "css", "styling");
    if (lowerName.includes("express") || lowerName.includes("node")) calculatedTags.push("backend", "node");
    
    const newRepo = {
      id: newId,
      name: repoName,
      analysisDate: "Analyzing...",
      syncTimestamp: "In progress",
      status: "analyzing",
      visibility: isPrivate ? "private" : "public",
      token: tokenToUse,
      context: "Connecting to GitHub API to list codebase folder tree and summarize directory conventions...",
      tags: calculatedTags
    };

    setRepositories((prev: any) => [newRepo, ...prev]);
    setSelectedRepo(repoName);
    setCustomRepoUrl("");
    setCustomRepoToken("");
    setIsAddingRepo(false);

    try {
      const normalizedUrl = `https://github.com/${repoName}`;
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: normalizedUrl, githubToken: tokenToUse })
      });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text.substring(0, 120) || `Server returned invalid status (${res.status})`);
      }
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze this repository.");
      }

      let aiContext = "";
      if (data.data) {
        const { overview, authFlow, infrastructure, suggestedReading } = data.data;
        aiContext = `SYSTEM OVERVIEW:\n${overview || "N/A"}\n\nINFRASTRUCTURE:\n${infrastructure || "N/A"}\n\nAUTH FLOW:\n${authFlow || "N/A"}`;
        if (suggestedReading && suggestedReading.length > 0) {
          aiContext += `\n\nSUGGESTED DOCUMENTS TO DISCUSS:\n${suggestedReading.map((file: string) => `- ${file}`).join('\n')}`;
        }
      } else {
        aiContext = `Repository ${repoName} is connected. Structure: ${data.fileTree?.join(", ") || "N/A"}`;
      }

      setRepositories((prev: any) => prev.map((r: any) => r.id === newId ? {
        ...r,
        status: "completed",
        analysisDate: "Just now",
        syncTimestamp: new Date().toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'short' }),
        context: aiContext,
        analysisData: data.data,
        fileTree: data.fileTree
      } : r));

    } catch (err: any) {
      console.error(err);
      setRepositories((prev: any) => prev.map((r: any) => r.id === newId ? {
        ...r,
        status: "failed",
        analysisDate: "Analysis failed",
        context: `Coupled analysis check failed: ${err.message || "Ensure the target repository is public/private and token is correct."}`
      } : r));
    }
  };

  const handleReanalyzeRepo = async (id: number, name: string) => {
    const existingRepo = repositories.find((r: any) => r.id === id);
    const tokenToUse = existingRepo?.token || "";

    setRepositories((prev: any) => prev.map((r: any) => r.id === id ? {
      ...r,
      status: "analyzing",
      analysisDate: "Refreshing context...",
      context: "Scanning files and fetching repository documentation from GitHub API..."
    } : r));

    try {
      const normalizedUrl = `https://github.com/${name}`;
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl: normalizedUrl, githubToken: tokenToUse })
      });
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text.substring(0, 120) || `Server returned invalid status (${res.status})`);
      }
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze this repository.");
      }

      let aiContext = "";
      if (data.data) {
        const { overview, authFlow, infrastructure, suggestedReading } = data.data;
        aiContext = `SYSTEM OVERVIEW:\n${overview || "N/A"}\n\nINFRASTRUCTURE:\n${infrastructure || "N/A"}\n\nAUTH FLOW:\n${authFlow || "N/A"}`;
        if (suggestedReading && suggestedReading.length > 0) {
          aiContext += `\n\nSUGGESTED DOCUMENTS TO DISCUSS:\n${suggestedReading.map((file: string) => `- ${file}`).join('\n')}`;
        }
      } else {
        aiContext = `Repository ${name} is connected. Structure: ${data.fileTree?.join(", ") || "N/A"}`;
      }

      setRepositories((prev: any) => prev.map((r: any) => r.id === id ? {
        ...r,
        status: "completed",
        analysisDate: "Refreshed just now",
        syncTimestamp: new Date().toLocaleString("en-US", { dateStyle: 'medium', timeStyle: 'short' }),
        context: aiContext,
        analysisData: data.data,
        fileTree: data.fileTree
      } : r));

    } catch (err: any) {
      console.error(err);
      setRepositories((prev: any) => prev.map((r: any) => r.id === id ? {
        ...r,
        status: "failed",
        analysisDate: "Analysis failed",
        context: `Coupled analysis check failed: ${err.message || "Ensure the target repository and private token are valid."}`
      } : r));
    }
  };

  const handleRemoveRepo = (id: number, name: string) => {
    setRepositories(repositories.filter((r: any) => r.id !== id));
    if (selectedRepo === name) {
      setSelectedRepo("facebook/react");
    }
  };

  const handleSendAgentMessage = async (customText?: string) => {
    const textToSend = customText || chatMessage;
    if (!textToSend.trim() || loadingChat) return;

    if (!customText) {
      setChatMessage("");
    }

    setChatHistory(prev => [...prev, { role: 'user', content: textToSend }]);
    setLoadingChat(true);

    const activeRepoData = repositories.find((r: any) => r.name === selectedRepo);
    const repoContext = activeRepoData ? activeRepoData.context : "General Context";
    const currentAgent = DEVELOPER_AGENTS.find(a => a.id === activeAgentId) || DEVELOPER_AGENTS[0];

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory,
          repoContext,
          repoUrl: selectedRepo,
          agentRole: currentAgent.roleName,
          agentPrompt: currentAgent.systemPrompt
        })
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text.substring(0, 120) || `Server returned invalid status (${res.status})`);
      }

      if (res.ok) {
        setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', content: "Error: " + (data.error || "Failed to fetch response") }]);
      }
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'ai', content: "Error: Failed to connect to developer agent server." }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const currentAgent = DEVELOPER_AGENTS.find(a => a.id === activeAgentId) || DEVELOPER_AGENTS[0];
  const CurrentAgentIcon = currentAgent.icon;
  const promptPresets = currentAgent.presets;

  const activeRepo = repositories.find((r: any) => r.name === selectedRepo) || repositories[0];

  const filteredRepositories = repositories.filter((repo: any) => {
    const s = repoSearch.toLowerCase();
    const matchesSearch = repo.name.toLowerCase().includes(s) || 
      (repo.tags && repo.tags.some((t: string) => t.toLowerCase().includes(s))) ||
      (repo.context && repo.context.toLowerCase().includes(s));
    const matchesVisibility = visibilityFilter === "all" || repo.visibility === visibilityFilter;
    const matchesStatus = statusFilter === "all" || repo.status === statusFilter;
    return matchesSearch && matchesVisibility && matchesStatus;
  });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#050507] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Space Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/5 gap-6">
          <div id="workspace-header" className="relative">
            <div className="mb-4 flex items-center gap-2">
              <button 
                onClick={onNavigateHome}
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-semibold tracking-wide transition-all border border-white/5 hover:border-white/10 cursor-pointer"
                id="btn-back-home"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-zinc-500 group-hover:-translate-x-1 group-hover:text-white transition-transform" />
                Back to Home
              </button>

              {activeRepo && (
                <button 
                  onClick={handleShareClick}
                  className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/15 hover:bg-brand-blue/25 text-brand-cyan hover:text-white text-xs font-semibold tracking-wide transition-all border border-brand-cyan/25 hover:border-brand-blue/45 cursor-pointer shadow-lg shadow-brand-blue/5"
                  id="btn-share-analysis"
                >
                  {copiedShareLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                      <span>Copied Report Link!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-brand-cyan group-hover:scale-105 transition-transform" />
                      <span>Share Analysis Report</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2"
            >
              Unified Agent Command Hub: {user?.displayName || user?.email?.split('@')[0] || "Guest Explorer"}
            </motion.h1>
            
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs sm:text-sm text-zinc-400 max-w-xl"
              >
                Multi-Agent Specialist Workspace. All views consolidated into one dashboard with zero tab switching.
              </motion.p>

              {activeRepo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative group/tooltip inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-brand-blue/30 transition-all select-none cursor-help self-start lg:self-auto"
                >
                  <GitBranch className="w-3 h-3 text-brand-blue shrink-0" />
                  <span className="text-[11px] font-bold font-mono text-white max-w-[160px] truncate">{activeRepo.name}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    {activeRepo.status === 'completed' && <span className="w-1 h-1 rounded-full bg-emerald-500" />}
                    {activeRepo.status === 'analyzing' && <span className="w-1 h-1 rounded-full bg-brand-blue animate-pulse" />}
                    {activeRepo.status === 'failed' && <span className="w-1 h-1 rounded-full bg-red-500" />}
                    {activeRepo.analysisDate}
                  </span>

                  {/* Hover-able status tooltip displaying exact time of last analysis sync */}
                  <div className="absolute top-full left-0 mt-2 p-2.5 bg-[#09090b] text-[11px] text-zinc-300 rounded-lg border border-white/10 shadow-2xl opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 pointer-events-none transition-all duration-150 z-50 whitespace-nowrap min-w-[210px] flex flex-col gap-1.5 font-sans">
                    <div className="flex items-center gap-1.5 font-bold text-white border-b border-white/5 pb-1">
                      <Clock className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                      <span>Last Analysis Metadata</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500 text-[10px]">Exact Sync:</span>
                      <span className="font-mono text-zinc-200 text-[10px]">{activeRepo.syncTimestamp || "Generating..."}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500 text-[10px]">Relative:</span>
                      <span className="text-zinc-300 text-[10px]">{activeRepo.analysisDate}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500 text-[10px]">Status:</span>
                      <span className="capitalize font-semibold text-emerald-400 text-[10px] flex items-center gap-1">
                        <span className={`w-1 h-1 rounded-full inline-block ${activeRepo.status === 'completed' ? 'bg-emerald-400' : activeRepo.status === 'analyzing' ? 'bg-brand-blue animate-pulse' : 'bg-red-400'}`} />
                        {activeRepo.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 bg-white/[0.02] border border-white/5 px-3.5 py-2.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            <span>5 SPECIALIST AGENTS ONLINE</span>
          </div>
        </div>

        {/* Global Repository Search & Tag Discovery Desk */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="glass bg-zinc-950/45 border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xl relative overflow-hidden group hover:border-brand-blue/30 transition-all duration-300"
          id="global-repo-search-area"
        >
          {/* Decorative subtle background glows */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-blue/5 blur-[40px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-8 rounded-full bg-brand-cyan/5 blur-[20px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-cyan flex items-center gap-1.5 font-mono">
                <Search className="w-3.5 h-3.5 text-brand-blue" />
                Global Repository Indexer & Search
              </h3>
              <p className="text-[11px] text-zinc-400">
                Instantly filter all analyzed codebases in your workspace by owner, metadata keywords, or taxonomy categories.
              </p>
            </div>
            
            <div className="flex items-center bg-white/[0.02] border border-white/5 rounded-lg p-1 text-[10px] text-zinc-400 font-mono gap-3 px-3 self-start md:self-auto">
              <span>Indexed: <strong className="text-zinc-250">{repositories.length}</strong></span>
              <span className="text-zinc-700">|</span>
              <span>Matches: <strong className="text-brand-blue">{filteredRepositories.length}</strong></span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex-1 relative group/search">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/search:text-brand-blue transition-colors" />
              <input
                type="text"
                value={repoSearch}
                onChange={(e) => setRepoSearch(e.target.value)}
                placeholder="Type query to filter... (e.g. facebook, css, routing, virtual-dom, meta-framework)"
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-650 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all font-mono shadow-inner duration-300"
                id="global-repository-search"
              />
              {repoSearch && (
                <button
                  type="button"
                  onClick={() => setRepoSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] tracking-wide font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-400 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Inclusivity Filters directly next to the search bar */}
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value as any)}
                className="bg-black/60 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-3.5 py-3 text-xs text-zinc-300 focus:outline-none focus:border-brand-blue cursor-pointer font-sans min-w-[100px] flex-1 sm:flex-none transition-colors"
                title="Filter by GitHub visibility"
              >
                <option value="all">👁️ All Vis</option>
                <option value="public">🌐 Public</option>
                <option value="private">🔒 Private</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#050507]/[0.01] bg-black/60 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-3.5 py-3 text-xs text-zinc-300 focus:outline-none focus:border-brand-blue cursor-pointer font-sans min-w-[120px] flex-1 sm:flex-none transition-colors"
                title="Filter by analysis status"
              >
                <option value="all">⚙️ All Status</option>
                <option value="completed">✅ Complete</option>
                <option value="analyzing">⏳ Syncing</option>
                <option value="failed">❌ Failed</option>
              </select>
            </div>
          </div>

          {/* Quick Clickable Taxonomy Pills */}
          <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mr-1.5">Quick Taxonomy tags:</span>
            {["frontend", "backend", "library", "meta-framework", "ssr", "fullstack", "css", "styling"].map((tag) => {
              const isSelected = repoSearch.toLowerCase() === tag;
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setRepoSearch(isSelected ? "" : tag)}
                  className={`text-[10px] px-2.5 py-1 rounded-md border font-mono transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? "bg-brand-blue/20 border-brand-blue text-white shadow-md shadow-brand-blue/10 font-bold" 
                      : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] hover:border-white/10"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile View Panel Switcher Segment */}
        <div className="lg:hidden p-1 bg-zinc-950/90 border border-white/10 rounded-2xl flex gap-1 mb-6 select-none shadow-xl" id="mobile-control-panel-switcher">
          {([
            { id: "catalog", label: "Catalog", icon: Folder, color: "text-brand-cyan" },
            { id: "chat", label: "Chat", icon: Bot, color: "text-brand-violet" },
            { id: "blueprint", label: "Brief", icon: Sparkles, color: "text-brand-cyan" }
          ] as const).map((panel) => {
            const isActive = mobileActivePanel === panel.id;
            const PanelIcon = panel.icon;
            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => setMobileActivePanel(panel.id)}
                className={`flex-1 relative py-3 px-1 rounded-xl text-[10px] font-mono font-bold tracking-tight uppercase flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer z-10 ${
                  isActive 
                    ? "text-white" 
                    : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-mobile-panel-tab"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-lg"
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                <PanelIcon className={`w-4 h-4 transition-colors ${isActive ? panel.color : "text-zinc-650"}`} />
                <span className="leading-tight text-center">{panel.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3-Column Unified Tab-Free Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="unified-terminal-grid">
          
          {/* Column 1: Workspace controls & Catalog (lg:col-span-3) */}
          <div 
            className={`${mobileActivePanel === "catalog" ? "flex" : "hidden lg:flex"} lg:col-span-3 flex-col gap-5`} 
            id="left-workspace-panel"
          >
            
            {/* Context & Repository Map */}
            <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-brand-blue" />
                  Codebase Catalog
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">{filteredRepositories.length} of {repositories.length} Shown</span>
              </div>

              {/* Add repository interactive block */}
              {isAddingRepo ? (
                <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex flex-col gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Repo URL or Path</label>
                    <input
                      type="text"
                      placeholder="owner/repo (e.g. facebook/react)"
                      value={customRepoUrl}
                      onChange={(e) => setCustomRepoUrl(e.target.value)}
                      className="bg-black border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-blue w-full"
                      id="input-custom-repo"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">GitHub PAT (Optional)</label>
                      <button
                        type="button"
                        onClick={() => setShowTokenHelp(!showTokenHelp)}
                        className="text-[9px] text-brand-blue hover:underline font-mono"
                      >
                        {showTokenHelp ? "Hide Guide" : "Get Token Key 🔑"}
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="Paste Github Personal Access Token"
                      value={customRepoToken}
                      onChange={(e) => setCustomRepoToken(e.target.value)}
                      className="bg-black border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-blue w-full font-mono placeholder:text-zinc-650"
                      id="input-custom-repo-token"
                    />
                  </div>

                  {showTokenHelp && (
                    <div className="bg-[#0e0e12] border border-white/5 rounded p-2.5 text-[10px] text-zinc-400 space-y-1.5 mt-0.5 leading-relaxed font-sans">
                      <p className="font-bold text-brand-blue">Private Repository Connection Steps:</p>
                      <p className="text-[9.5px]">1. Open <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-brand-cyan hover:underline font-semibold">GitHub Settings &gt; Developer settings &gt; Personal access tokens</a>.</p>
                      <p className="text-[9.5px]">2. Create a high-security <span className="text-zinc-300 font-medium">Fine-Grained Token</span> OR a <span className="text-zinc-300 font-medium">Classic Token</span>.</p>
                      <p className="text-[9.5px]">3. Grant the token <span className="text-zinc-300 font-medium">"repo" scope</span> (classic) or read permissions for <span className="text-zinc-300 font-medium">"Contents" and "Metadata"</span> (fine-grained).</p>
                      <p className="text-[9.5px]">4. Paste your token in the field above to allow the secure sandbox to map private files.</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={handleAddCustomRepo}
                      className="bg-brand-blue px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 cursor-pointer w-full"
                      id="btn-confirm-add"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => { setIsAddingRepo(false); setAddingError(""); setShowTokenHelp(false); }}
                      className="bg-zinc-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer w-full"
                      id="btn-cancel-add"
                    >
                      Cancel
                    </button>
                  </div>
                  {addingError && (
                    <span className="text-[10px] text-red-400 mt-1 block leading-tight">{addingError}</span>
                  )}
                  <div className="flex items-center gap-1.5 justify-center mt-2 pt-2 border-t border-white/5 text-[10px] text-brand-cyan font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
                    <span>Safe Clientside Private Token Transfer</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingRepo(true)}
                  className="w-full py-2 rounded-lg bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-tight"
                  id="btn-map-repo-init"
                >
                  + Map Custom Repo
                </button>
              )}

              {/* Search & Filters block */}
              <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                    className="w-full bg-[#050507] border border-white/10 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/15 transition-all text-xs"
                    id="input-catalog-search"
                  />
                  {repoSearch && (
                    <button
                      onClick={() => setRepoSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-[10px] transition-colors"
                      type="button"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-550 font-bold font-mono">Visibility</span>
                    <select
                      value={visibilityFilter}
                      onChange={(e) => setVisibilityFilter(e.target.value as any)}
                      className="bg-[#050507] border border-white/10 rounded-lg px-2 py-1.5 text-zinc-300 focus:outline-none focus:border-brand-blue cursor-pointer text-[10px]"
                    >
                      <option value="all">All</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-550 font-bold font-mono">Status</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="bg-[#050507] border border-white/10 rounded-lg px-2 py-1.5 text-zinc-300 focus:outline-none focus:border-brand-blue cursor-pointer text-[10px]"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="analyzing">Analyzing</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Repositories Quick Selector List */}
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                {filteredRepositories.length === 0 ? (
                  <div className="text-center py-6 px-2 border border-dashed border-white/5 bg-white/[0.01] rounded-lg">
                    <p className="text-[11px] text-zinc-500">No matching repositories found.</p>
                    <button 
                      onClick={() => {
                        setRepoSearch("");
                        setVisibilityFilter("all");
                        setStatusFilter("all");
                      }}
                      className="text-[10px] text-brand-blue hover:underline font-medium mt-1 cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  filteredRepositories.map((repo: any) => {
                    const isSelected = selectedRepo === repo.name;
                    return (
                      <div
                        key={repo.id}
                        onClick={() => setSelectedRepo(repo.name)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? `bg-brand-blue/10 border-brand-blue/30 text-white` 
                            : `bg-white/[0.01] border-white/5 hover:bg-white/[0.03] text-zinc-400`
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {repo.status === "analyzing" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue inline-block shrink-0" />
                          ) : repo.status === "failed" ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 inline-block shrink-0" />
                          ) : (
                            <GitBranch className="w-3.5 h-3.5 text-zinc-500 inline-block shrink-0" />
                          )}
                          <div className="flex flex-col truncate">
                            <span className={`truncate font-semibold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{repo.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-zinc-500">
                              <span className="flex items-center gap-0.5 capitalize">
                                {repo.visibility === "private" ? <Lock className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                                {repo.visibility || "public"}
                              </span>
                              <span>•</span>
                              <span className={`capitalize ${repo.status === 'completed' ? 'text-emerald-500' : repo.status === 'analyzing' ? 'text-brand-blue' : 'text-red-400'}`}>
                                {repo.status === 'analyzing' ? 'syncing' : repo.status}
                              </span>
                            </div>
                            {repo.tags && repo.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {repo.tags.slice(0, 3).map((tag: string) => (
                                  <span 
                                    key={tag} 
                                    className={`text-[8.5px] font-mono px-1 rounded border leading-none py-0.5 ${
                                      isSelected
                                        ? "bg-brand-blue/20 border-brand-blue/35 text-white"
                                        : "bg-white/5 border-white/5 text-zinc-400"
                                    }`}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleReanalyzeRepo(repo.id, repo.name)}
                            disabled={repo.status === "analyzing"}
                            className="p-1 rounded text-zinc-500 hover:text-white transition-colors disabled:opacity-30"
                            title="Sync index"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRemoveRepo(repo.id, repo.name)}
                            disabled={repo.status === "analyzing"}
                            className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-30"
                            title="Remove context"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Specialist Agents Hub */}
            <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c] flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-brand-violet" />
                  Specialist Roster
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">Active</span>
              </div>

              <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
                {DEVELOPER_AGENTS.map((agent) => {
                  const isSelected = activeAgentId === agent.id;
                  const AgentIcon = agent.icon;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setActiveAgentId(agent.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex gap-2.5 cursor-pointer items-start ${
                        isSelected 
                          ? `bg-white/[0.03] border-brand-blue border-opacity-70 shadow-lg` 
                          : `bg-black/20 border-white/5 hover:bg-white/[0.01]`
                      }`}
                    >
                      <div className={`p-1.5 rounded-md shrink-0 ${
                        isSelected 
                          ? `bg-brand-blue/15 text-brand-blue` 
                          : `bg-zinc-800 text-zinc-400`
                      }`}>
                        <AgentIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className={`font-semibold text-xs transition-colors ${isSelected ? 'text-white' : 'text-zinc-350'}`}>
                          {agent.name}
                        </h5>
                        <p className="text-[10px] text-zinc-500 leading-normal line-clamp-2">{agent.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.01] text-[10px] text-zinc-500 leading-normal">
                Selecting a Specialist Roster item immediately updates the AI Code Agent's credentials, prompts, and preset interactions on the fly.
              </div>
            </div>

          </div>

          {/* Column 2: Live AI Developer Agent Chat Console (lg:col-span-5) */}
          <div 
            className={`${mobileActivePanel === "chat" ? "flex" : "hidden lg:flex"} lg:col-span-5 flex-col rounded-xl border border-white/10 bg-[#0a0a0c] overflow-hidden min-h-[600px]`} 
            id="center-chat-panel"
          >
            
            {/* Top Workspace status bar */}
            <div className="p-3.5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 max-w-[70%]">
                <div className="w-7 h-7 rounded-md bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 text-brand-blue animate-pulse">
                  <CurrentAgentIcon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5 leading-none mb-1">
                    {currentAgent.roleName}
                  </h3>
                  <p className="text-[10px] text-zinc-500 truncate">Connected: {selectedRepo}</p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setChatHistory([])}
                  className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5 transition-all cursor-pointer"
                >
                  Clear Chat
                </button>
              </div>
            </div>

            {/* Scroller logs segment */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3.5 h-[400px]">
              {chatHistory.length === 0 && (
                <div className="text-center py-10 px-4 flex flex-col justify-center items-center h-full">
                  <CurrentAgentIcon className="w-10 h-10 text-zinc-700 mb-3" />
                  <h4 className="text-zinc-300 font-semibold mb-1 text-sm">{currentAgent.name} Context Active</h4>
                  <p className="text-xs text-zinc-500 max-w-sm leading-relaxed mb-4">
                    Send a query about {selectedRepo} system parameters or click any of the specialized prompt presets below.
                  </p>
                </div>
              )}

              <>
                {chatHistory.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 max-w-[90%] ${h.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${h.role === 'user' ? 'bg-brand-blue/15 border-brand-blue/20 text-brand-blue' : 'bg-brand-violet/15 border-brand-violet/20 text-brand-violet'}`}>
                      {h.role === 'user' ? <UserIcon className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                    </div>
                    
                    <div className={`p-3 rounded-lg text-xs leading-relaxed font-sans ${h.role === 'user' ? 'bg-brand-blue/10 border border-brand-blue/20 text-zinc-250' : 'bg-white/[0.02] border border-white/5 text-zinc-300'}`}>
                      <div className="prose prose-invert prose-xs max-w-none break-words">
                        <Markdown components={markdownComponents}>{h.content}</Markdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>

              {loadingChat && (
                <div className="flex gap-2.5 max-w-[90%]">
                  <div className="w-6 h-6 rounded-md bg-brand-violet/10 border border-brand-violet/20 text-brand-violet flex items-center justify-center shrink-0">
                    <Loader2 className="w-3 animate-spin" />
                  </div>
                  <div className="p-4 rounded-lg border border-white/5 bg-white/[0.01] w-72 flex flex-col gap-2.5 animate-pulse">
                     <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-brand-violet animate-pulse shrink-0" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-violet/80 font-mono">Formulating codebase guidance...</span>
                     </div>
                     <div className="h-2.5 w-11/12 bg-white/10 rounded" />
                     <div className="h-2.5 w-4/5 bg-white/10 rounded" />
                     <div className="h-2.5 w-3/4 bg-white/5 rounded" />
                     <div className="h-2.5 w-1/2 bg-white/5 rounded" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Specialized prompt presets inside the chat module */}
            <div className="p-3 border-t border-white/5 bg-white/[0.01] flex flex-col gap-1.5 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-brand-violet" />
                Specialist Prompt Presets
              </span>
              <div className="grid grid-cols-3 gap-2">
                {promptPresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAgentMessage(p.text)}
                    disabled={loadingChat}
                    className="p-2 text-left rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all text-[10px] text-zinc-350 hover:text-white leading-normal cursor-pointer disabled:opacity-40"
                  >
                    <div className="font-bold text-zinc-300 truncate mb-0.5 tracking-tight flex items-center gap-1 text-brand-blue">
                      <Sparkles className="w-2.5 h-2.5" />
                      {p.label}
                    </div>
                    <span className="text-[9px] text-zinc-500 line-clamp-1 block leading-tight">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input form segment */}
            <div className="p-3.5 border-t border-white/5 bg-white/[0.02] shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAgentMessage()}
                  placeholder={`Ask ${currentAgent.name} about ${selectedRepo}...`}
                  disabled={loadingChat}
                  className="w-full bg-black/60 border border-white/10 rounded-lg pl-3 pr-10 py-3 text-xs text-white focus:outline-none focus:border-brand-blue placeholder:text-zinc-500 focus:ring-1 focus:ring-brand-blue/10"
                />
                <button
                  onClick={() => handleSendAgentMessage()}
                  disabled={loadingChat || !chatMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-md transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Column 3: Live Codebase Analysis Brief & Blueprint (lg:col-span-4) */}
          <div 
            className={`${mobileActivePanel === "blueprint" ? "flex" : "hidden lg:flex"} lg:col-span-4 flex-col rounded-xl border border-white/10 bg-[#0a0a0c] overflow-hidden min-h-[600px]`} 
            id="right-blueprint-panel"
          >
            
            {/* Top segment control / status */}
            <div className="p-3.5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-xs font-semibold text-zinc-100 uppercase tracking-wider">
                  Live Codebase brief
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => {
                    const rawSummary = activeRepo.analysisData?.summary || activeRepo.context || "";
                    const rawArchitecture = activeRepo.analysisData?.architecture || "N/A";
                    const rawOnboarding = activeRepo.analysisData?.onboarding || "N/A";
                    const markdownContent = `
# CodeBaseIQ Architectural Analysis & Exploration Report

**Repository**: ${activeRepo.name}  
**Date generated**: ${new Date().toLocaleDateString()}

---

## 🚀 1. Executive Codebase Summary
${rawSummary}

---

## 🏛️ 2. Comprehensive System Architecture
${rawArchitecture}

---

## 📦 3. Developer Onboarding Document
${rawOnboarding}

---
*Report exported safely via CodeBaseIQ.*
`.trim();

                    const blob = new Blob([markdownContent], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${activeRepo.name.replace("/", "-")}-blueprint.md`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/5 font-mono text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Download dynamic context report"
                >
                  <Download className="w-3 h-3" /> Report
                </button>
                <button
                  onClick={() => {
                    const rawSummary = activeRepo.analysisData?.summary || activeRepo.context || "";
                    navigator.clipboard.writeText(rawSummary);
                    setCopiedSection(true);
                    setTimeout(() => setCopiedSection(false), 2000);
                  }}
                  className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/5 font-mono text-[10px] flex items-center gap-0.5 transition-all"
                >
                  {copiedSection ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSection ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Complete, Scrollable Analysis Blueprint briefing */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-5 h-[530px]" id="scrolling-dynamic-brief">
              
              {/* Repo status warnings if not ready */}
              {activeRepo.status === "analyzing" ? (
                <div className="h-full flex flex-col justify-center items-center py-20 text-center px-4">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-blue mb-3" />
                  <h4 className="text-zinc-300 font-semibold text-xs uppercase tracking-widest animate-pulse">Scanning Code directories...</h4>
                  <p className="text-[10.5px] text-zinc-500 mt-2 max-w-xs leading-relaxed">
                    Connecting to GitHub API metadata streams to map directories pattern, code declarations, and topological structure.
                  </p>
                </div>
              ) : activeRepo.status === "failed" ? (
                <div className="h-full flex flex-col justify-center items-center py-20 text-center px-4">
                  <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
                  <h4 className="text-red-400 font-semibold text-xs uppercase tracking-wider">Analysis Failed</h4>
                  <p className="text-[10.5px] text-zinc-400 mt-2 leading-relaxed">
                    {activeRepo.context}
                  </p>
                  <button 
                    onClick={() => handleReanalyzeRepo(activeRepo.id, activeRepo.name)}
                    className="mt-4 px-3 py-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin-slow" /> Retry Analysis
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs text-zinc-350 flex flex-col h-full">
                  
                  {/* Scope Label Badge */}
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between shrink-0">
                    <div>
                      <span className="text-[9.5px] uppercase font-bold tracking-widest text-zinc-500 block mb-0.5">Active Target Repo Context</span>
                      <strong className="text-white text-xs font-semibold font-mono">{activeRepo.name}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] px-2.5 py-1 rounded bg-[#0f1115] text-brand-cyan border border-brand-cyan/20 uppercase tracking-widest font-bold">ACTIVE BRIEF</span>
                    </div>
                  </div>

                  {/* Tab Selector Buttons with Framer Motion layoutId */}
                  <div className="p-1 bg-zinc-950/80 border border-white/5 rounded-xl flex gap-1 shrink-0 select-none overflow-x-auto hide-scrollbar" id="blueprint-tab-selector">
                    {([
                      { id: "overview", label: "Overview", icon: BookOpen },
                      { id: "architecture", label: "Architecture", icon: Network },
                      { id: "onboarding", label: "Onboarding", icon: Cpu },
                      { id: "dependency", label: "Dependency", icon: Layers },
                      { id: "refactor", label: "Refactor Lab", icon: Sparkles }
                    ] as const).map((tab) => {
                      const isActive = activeTab === tab.id;
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`whitespace-nowrap shrink-0 relative py-2.5 px-3 rounded-lg text-[10px] font-mono font-bold tracking-tight uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer z-10 ${
                            isActive 
                              ? "text-white" 
                              : "text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="active-blueprint-tab"
                              className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg shadow-md"
                              transition={{ type: "spring", stiffness: 430, damping: 28 }}
                              style={{ zIndex: -1 }}
                            />
                          )}
                          <TabIcon className={`w-3.5 h-3.5 transition-colors ${isActive ? "text-brand-cyan" : "text-zinc-500"}`} />
                          <span className="leading-none">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Smooth Fluid View Transition container */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview-tab"
                        initial={{ opacity: 0, y: 10, scale: 0.995 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="space-y-4"
                      >
                        {/* 1. Directory File Structure view */}
                        <div className="space-y-2 border-b border-white/5 pb-4">
                          <h4 className="font-semibold text-xs text-brand-blue uppercase flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5" />
                            1. Repository Structure Map
                          </h4>
                          <div className="p-3 bg-[#050507] border border-white/5 rounded-lg max-h-[160px] overflow-y-auto custom-scrollbar font-mono text-[10px] text-zinc-400 space-y-1">
                            {(activeRepo.fileTree || [ "📁 src/", "📄 src/App.tsx", "📄 package.json" ]).map((file: string, idx: number) => (
                              <div key={idx} className={`truncate ${file.includes('📁') ? 'text-brand-blue' : 'text-zinc-300'}`}>
                                {file}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Executive Codebase Summary briefing */}
                        <div className="space-y-2 pb-1">
                          <h4 className="font-semibold text-xs text-brand-cyan uppercase flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            2. Codebase Highlights & Stack
                          </h4>
                          <div className="prose prose-invert prose-xs text-zinc-300 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar pr-1 bg-white/[0.01] border border-white/5 p-3 rounded-lg font-sans">
                            {activeRepo.analysisData?.summary ? (
                              <Markdown components={markdownComponents}>{activeRepo.analysisData.summary}</Markdown>
                            ) : (
                              <p>{activeRepo.context}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "architecture" && (
                      <motion.div
                        key="architecture-tab"
                        initial={{ opacity: 0, y: 10, scale: 0.995 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="space-y-4 text-left"
                      >
                        {/* Selector Subheader for View Toggle */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-brand-violet animate-ping" />
                            <h4 className="font-semibold text-xs text-brand-violet uppercase tracking-wider font-mono">
                              System Topology Suite
                            </h4>
                          </div>

                          <div className="flex bg-[#05060a] border border-white/10 p-0.5 rounded-lg shrink-0 gap-0.5 font-mono text-[10px]">
                            <button
                              type="button"
                              onClick={() => setArchViewMode("docs")}
                              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                archViewMode === 'docs' 
                                  ? 'bg-zinc-800 text-white font-bold' 
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              Static Blueprint
                            </button>
                            <button
                              type="button"
                              onClick={() => setArchViewMode("sandbox")}
                              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                                archViewMode === 'sandbox' 
                                  ? 'bg-brand-violet/20 border border-brand-violet/40 text-brand-cyan font-bold' 
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              <Zap className="w-2.5 h-2.5 active:animate-bounce text-brand-cyan fill-brand-cyan/20" />
                              Chaos Sandbox
                            </button>
                          </div>
                        </div>

                        {archViewMode === "docs" ? (
                          <div className="space-y-4">
                            {/* 3. Logical System Architecture & Patterns briefings */}
                            <div className="space-y-2 border-b border-white/5 pb-4">
                              <h4 className="font-semibold text-xs text-brand-violet uppercase flex items-center gap-1">
                                <Network className="w-3.5 h-3.5" />
                                3. Component Topologies & Diagrams
                              </h4>
                              <div className="prose prose-invert prose-xs text-zinc-300 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar pr-1 bg-white/[0.01] border border-white/5 p-3 rounded-lg font-sans">
                                {activeRepo.analysisData?.architecture ? (
                                  <Markdown components={markdownComponents}>{activeRepo.analysisData.architecture}</Markdown>
                                ) : (
                                  <p className="text-zinc-500 italic">No complex architecture model compiled for this brief yet. Force a sync refresh to compile details.</p>
                                )}
                              </div>
                            </div>

                            {/* 5. Dynamic Execution Walkthrough briefings */}
                            <div className="space-y-2 pb-1">
                              <h4 className="font-semibold text-xs text-rose-400 uppercase flex items-center gap-1">
                                <Compass className="w-3.5 h-3.5" />
                                5. Operational Runtime Map
                              </h4>
                              <div className="prose prose-invert prose-xs text-zinc-300 leading-relaxed max-h-[220px] overflow-y-auto custom-scrollbar pr-1 bg-white/[0.01] border border-white/5 p-3 rounded-lg font-sans">
                                {activeRepo.analysisData?.walkthrough ? (
                                  <Markdown components={markdownComponents}>{activeRepo.analysisData.walkthrough}</Markdown>
                                ) : (
                                  <p className="text-zinc-500 italic">Force a sync call above to run deeper sequence trace scenarios.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Chaos Sandbox Interactive Dashboard Layout */
                          <div className="grid lg:grid-cols-12 gap-4 items-stretch">
                            
                            {/* Controls Column (col-span-5) */}
                            <div className="lg:col-span-5 p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between gap-5 text-left select-none leading-none">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Chaos Controls</span>
                                  <span className="text-[10px] font-mono text-zinc-500">TPS Meter</span>
                                </div>

                                {/* Dynamic Heath SLA Counter */}
                                <div className="p-3 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-between leading-none">
                                  <div>
                                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Estimated Cluster SLA</span>
                                    <strong className={`text-base font-mono font-bold block ${
                                      simTrafficRate > 1000 && !rateLimitActive 
                                        ? "text-red-400" 
                                        : simTrafficRate > 500 && !rateLimitActive 
                                        ? "text-amber-400 animate-pulse" 
                                        : "text-emerald-400"
                                    }`}>
                                      {simTrafficRate > 1500 && !rateLimitActive 
                                        ? "76.4% (Degraded SLA)" 
                                        : simTrafficRate > 600 && !rateLimitActive 
                                        ? "94.2% (Moderate Load)" 
                                        : "99.99% (Optimal Health)"}
                                    </strong>
                                  </div>
                                  <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center bg-black">
                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                      simTrafficRate > 1000 && !rateLimitActive ? "bg-red-500 animate-ping" : "bg-emerald-400"
                                    }`} />
                                  </div>
                                </div>

                                {/* Slider for Traffic Stream rate */}
                                <div className="space-y-1.5 pt-1">
                                  <div className="flex items-center justify-between text-[10px] font-mono">
                                    <span className="text-zinc-400 uppercase font-bold">Simulated Traffic Rate</span>
                                    <span className="text-brand-cyan font-bold">{simTrafficRate} req/sec</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="10"
                                    max="2500"
                                    value={simTrafficRate}
                                    onChange={(e) => setSimTrafficRate(parseInt(e.target.value))}
                                    className="w-full accent-brand-violet h-1 bg-zinc-800 rounded-lg cursor-pointer"
                                  />
                                  <span className="text-[8px] text-zinc-500 block leading-tight font-mono">Drag to shift node processing tasks and trigger automatic auto-scaling.</span>
                                </div>

                                {/* Defensive Action Switches */}
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold mb-1.5">Load Mitigation Controls</span>
                                  
                                  {/* Rate Limiting Toggle */}
                                  <label className="flex items-center justify-between p-2 rounded bg-black/60 border border-white/5 cursor-pointer selection:bg-transparent">
                                    <div className="text-left leading-tight min-w-0 pr-2">
                                      <span className="block text-[10.5px] font-mono text-zinc-350 font-semibold">Cloud Armor Rate Limiter</span>
                                      <span className="text-[8.5px] text-zinc-500 block mt-1">Drops redundant requests over 500 req/sec</span>
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={rateLimitActive}
                                      onChange={(e) => setRateLimitActive(e.target.checked)}
                                      className="rounded border-zinc-800 bg-[#050505] text-brand-violet focus:ring-opacity-40 cursor-pointer w-4 h-4 shrink-0"
                                    />
                                  </label>

                                  {/* Circuit Breaker Toggle */}
                                  <label className="flex items-center justify-between p-2 rounded bg-black/60 border border-white/5 cursor-pointer selection:bg-transparent">
                                    <div className="text-left leading-tight min-w-0 pr-2">
                                      <span className="block text-[10.5px] font-mono text-zinc-350 font-semibold">Transaction Circuit Breaker</span>
                                      <span className="text-[8.5px] text-zinc-500 block mt-1">Fault-tolerant fallback responses instantly</span>
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={circuitBreakerActive}
                                      onChange={(e) => setCircuitBreakerActive(e.target.checked)}
                                      className="rounded border-zinc-800 bg-[#050505] text-brand-violet focus:ring-opacity-40 cursor-pointer w-4 h-4 shrink-0"
                                    />
                                  </label>
                                </div>
                              </div>

                              {/* Instants trigger keys */}
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSimTrafficRate(2200);
                                    setSimLogs((prev) => [`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ⚠️ CRITICAL: Massive traffic surge simulation injected (2200 reqs/s).`, ...prev]);
                                  }}
                                  className="py-1.5 px-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/50 text-[10px] text-red-400 font-mono font-bold rounded-lg transition-all cursor-pointer truncate"
                                >
                                  💥 Inject DDoS Surge
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSimTrafficRate(85);
                                    setRateLimitActive(false);
                                    setCircuitBreakerActive(false);
                                    setSimLogs((prev) => [`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] CONSOLE: Chaos state reset. Clusters aligned back to baseline.`, ...prev]);
                                  }}
                                  className="py-1.5 px-2 bg-zinc-900 border border-white/10 hover:border-white/20 text-[10px] text-zinc-300 font-mono rounded-lg transition-all cursor-pointer truncate"
                                >
                                  🔄 Reset Metrics
                                </button>
                              </div>
                            </div>

                            {/* Node Vis Map & Event Stream Terminal Column (col-span-7) */}
                            <div className="lg:col-span-7 p-4 rounded-xl bg-black border border-white/5 flex flex-col justify-between gap-4" style={{ minHeight: "330px" }}>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/5 pb-2 shrink-0">
                                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Dynamic Node Status Map</span>
                                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Healthy
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" /> Load Warning
                                  </div>
                                </div>

                                {/* Flow Nodes list */}
                                <div className="space-y-2 text-left">
                                  {nodesState.map((node) => {
                                    const isWarning = node.cpu > 75;
                                    let percentageWidth = `${node.cpu}%`;

                                    return (
                                      <div 
                                        key={node.id} 
                                        className={`p-2.5 rounded-lg border transition-all ${
                                          isWarning 
                                            ? "bg-red-950/10 border-red-500/30 text-white" 
                                            : "bg-[#040407] border-white/5 text-zinc-300"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-1.5">
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                                              isWarning ? "bg-red-500 animate-ping" : "bg-emerald-400"
                                            }`} />
                                            <span className="text-[11px] font-mono font-bold truncate leading-none">{node.name}</span>
                                          </div>
                                          <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono text-zinc-500 leading-none">
                                            <span className={isWarning ? "text-red-400 font-bold" : ""}>CPU: {node.cpu}%</span>
                                            <span>•</span>
                                            <span className={node.latency > 150 ? "text-amber-400" : ""}>{node.latency}ms</span>
                                          </div>
                                        </div>

                                        {/* Status meter graph bar */}
                                        <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden">
                                          <div 
                                            className={`h-full transition-all duration-300 ${
                                              isWarning ? "bg-red-500" : "bg-brand-violet"
                                            }`} 
                                            style={{ width: percentageWidth }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Live Console Logs Stream */}
                              <div className="space-y-1 text-left leading-none shrink-0">
                                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1 pl-1">Operational sandbox output log</span>
                                <div className="p-2.5 rounded bg-black/90 border border-white/5 font-mono text-[9px] text-zinc-400 leading-relaxed overflow-y-auto h-[100px] flex flex-col-reverse custom-scrollbar">
                                  {simLogs.map((log, idx) => (
                                    <div key={idx} className="truncate">
                                      <span className="text-zinc-650 mr-1.5">✦</span>
                                      <span className={
                                        log.includes("⚠️") ? "text-red-400" :
                                        log.includes("CONSOLE") ? "text-brand-cyan" :
                                        log.includes("DB") ? "text-brand-blue" : "text-zinc-400"
                                      }>
                                        {log}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "onboarding" && (
                      <motion.div
                        key="onboarding-tab"
                        initial={{ opacity: 0, y: 10, scale: 0.995 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="space-y-4"
                      >
                        {/* 4. Onboarding Checklist / prerequisites briefings */}
                        <div className="space-y-2 pb-1">
                          <h4 className="font-semibold text-xs text-amber-500 uppercase flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5" />
                            4. Local Developer Onboarding Document
                          </h4>
                          <div className="prose prose-invert prose-xs text-zinc-300 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar pr-1 bg-white/[0.01] border border-white/5 p-3 rounded-lg font-sans">
                            {activeRepo.analysisData?.onboarding ? (
                              <Markdown components={markdownComponents}>{activeRepo.analysisData.onboarding}</Markdown>
                            ) : (
                              <p className="text-zinc-500 italic">No onboarding document compiled in current manifest block.</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "dependency" && (
                      <motion.div
                        key="dependency-tab"
                        initial={{ opacity: 0, y: 10, scale: 0.995 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="space-y-4"
                      >
                        {/* 6. High Resolution Imports Dependency connections schema */}
                        <div className="space-y-2.5 pb-1">
                          <h4 className="font-semibold text-xs text-emerald-400 uppercase flex items-center gap-1 pb-1">
                            <Layers className="w-3.5 h-3.5" />
                            6. Relational Dependency Connectors
                          </h4>
                          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                            <DependencyMap relations={activeRepo.analysisData?.dependencyMap || []} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "refactor" && (
                      <motion.div
                        key="refactor-tab"
                        initial={{ opacity: 0, y: 10, scale: 0.995 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="space-y-5 text-left"
                      >
                        {/* Title and Intro */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                          <div>
                            <h4 className="font-semibold text-xs text-brand-cyan uppercase flex items-center gap-1 font-mono">
                              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                              Interactive AI Refactoring Laboratory
                            </h4>
                            <p className="text-[10px] text-zinc-500 mt-1">
                              Load industrial anti-patterns, choose an AI optimization strategy, and perform real-time restructured code safety patches.
                            </p>
                          </div>
                          
                          {/* Demo Templates Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider">Load Template:</span>
                            <select
                              onChange={(e) => {
                                const idx = parseInt(e.target.value);
                                if (!isNaN(idx) && DIRTY_TEMPLATES[idx]) {
                                  setRefactorCodeInput(DIRTY_TEMPLATES[idx].code);
                                  setRefactorLanguage(DIRTY_TEMPLATES[idx].language);
                                }
                              }}
                              className="bg-[#0c0d12] border border-white/10 rounded-md px-2.5 py-1.5 text-[10.5px] text-zinc-300 focus:outline-none focus:border-brand-cyan cursor-pointer font-sans"
                            >
                              {DIRTY_TEMPLATES.map((t, idx) => (
                                <option key={idx} value={idx}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Split Input/Output Layout */}
                        <div className="grid lg:grid-cols-12 gap-5 items-stretch">
                          {/* Input Section (Left col-span-5) */}
                          <div className="lg:col-span-5 flex flex-col justify-between gap-4 p-4 rounded-xl bg-black/40 border border-white/5 text-left">
                            <div className="space-y-4 flex-1 flex flex-col">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Source Sandbox Code</span>
                                <span className="text-[10px] font-mono text-brand-blue uppercase">{refactorLanguage}</span>
                              </div>

                              <textarea
                                value={refactorCodeInput}
                                onChange={(e) => setRefactorCodeInput(e.target.value)}
                                className="w-full h-[260px] bg-[#030305] border border-white/5 rounded-lg p-3 font-mono text-[10.5px] text-zinc-300 focus:outline-none focus:border-brand-blue resize-none custom-scrollbar outline-none flex-1"
                                placeholder="// Paste or type your messy component or backend service code here..."
                              />

                              {/* Optimization Strategy Modes Selector */}
                              <div>
                                <label className="text-[9.5px] text-zinc-500 font-mono block mb-2 uppercase tracking-wider font-bold">Optimization Strategy Mode</label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                                  {([
                                    { id: 'solid', label: 'SOLID', desc: 'Enforce modular, single-responsibility functions' },
                                    { id: 'performance', label: 'Speed', desc: 'Optimize loops, allocations & performance' },
                                    { id: 'typesafe', label: 'Typesafe', desc: 'Harden dynamic declarations to static safety' },
                                    { id: 'security', label: 'Secure', desc: 'Audit parameter inputs & SQLi vulnerabilities' },
                                    { id: 'unittests', label: 'Tests', desc: 'Generate complete Vitest/Jest unit suites' }
                                  ] as const).map((modeItem) => (
                                    <button
                                      key={modeItem.id}
                                      type="button"
                                      onClick={() => setRefactorMode(modeItem.id)}
                                      title={modeItem.desc}
                                      className={`p-2 rounded-lg border text-[10px] font-bold text-center transition-all cursor-pointer truncate font-mono ${
                                        refactorMode === modeItem.id 
                                          ? 'bg-brand-blue/10 border-brand-blue/70 text-brand-cyan shadow-sm shadow-brand-blue/5' 
                                          : 'bg-transparent border-white/5 text-zinc-500 hover:border-white/15 hover:text-zinc-300'
                                      }`}
                                    >
                                      {modeItem.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={async () => {
                                setLoadingRefactor(true);
                                setRefactorError("");
                                setRefactorResult(null);
                                try {
                                  const res = await fetch("/api/refactor", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      code: refactorCodeInput,
                                      language: refactorLanguage,
                                      mode: refactorMode
                                    })
                                  });
                                  const data = await res.json();
                                  if (!res.ok) {
                                    throw new Error(data.error || "Failed to complete refactoring compilation");
                                  }
                                  setRefactorResult(data);
                                } catch (err: any) {
                                  setRefactorError(err.message || "An error occurred during refactoring");
                                } finally {
                                  setLoadingRefactor(false);
                                }
                              }}
                              disabled={loadingRefactor || !refactorCodeInput.trim()}
                              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-blue to-cyan-500 text-black font-mono font-bold text-xs hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                            >
                              {loadingRefactor ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Compiling Refactored Solution...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Execute AI Refactor</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Output Sections (Right col-span-7) */}
                          <div className="lg:col-span-7 p-4 rounded-xl bg-black/60 border border-white/5 flex flex-col justify-between" style={{ minHeight: "410px" }}>
                            {loadingRefactor ? (
                              <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
                                <div className="space-y-1.5 text-center font-mono text-[10px] text-zinc-500">
                                  <p className="animate-pulse">📂 Injecting static analyzer models...</p>
                                  <p className="animate-pulse animate-delay-150">🔍 Parsing abstract syntax tree structure...</p>
                                  <p className="animate-pulse animate-delay-300">⚡ Applying dynamic refactor schemas ({refactorMode.toUpperCase()})...</p>
                                </div>
                              </div>
                            ) : refactorError ? (
                              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-red-400">
                                <AlertCircle className="w-8 h-8 mb-2 animate-bounce" />
                                <h5 className="font-semibold text-xs uppercase tracking-wider">Refactor Operation Failed</h5>
                                <p className="text-[10px] text-zinc-400 mt-1 max-w-sm">{refactorError}</p>
                              </div>
                            ) : refactorResult ? (
                              <div className="flex-1 flex flex-col justify-between gap-4">
                                {/* Metrics Cards Row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left select-none leading-none">
                                  <div className="p-2.5 bg-[#0a0c10] border border-white/5 rounded-lg flex flex-col justify-between">
                                    <span className="text-[8.5px] uppercase font-mono tracking-wider text-zinc-500 block leading-tight">Complexity Before</span>
                                    <strong className="text-[10px] font-mono text-zinc-350 block mt-1 leading-tight">{refactorResult.complexityBefore || "High"}</strong>
                                  </div>
                                  <div className="p-2.5 bg-[#090e0c]/60 border border-emerald-500/15 rounded-lg flex flex-col justify-between">
                                    <span className="text-[8.5px] uppercase font-mono tracking-wider text-emerald-500 block leading-tight">After Code-Patch</span>
                                    <strong className="text-[10px] font-mono text-emerald-400 block mt-1 leading-tight">{refactorResult.complexityAfter || "Low"}</strong>
                                  </div>
                                  <div className="p-2.5 bg-[#0d0910]/60 border border-brand-violet/15 rounded-lg flex flex-col justify-between font-sans">
                                    <span className="text-[8.5px] uppercase font-mono tracking-wider text-brand-violet block leading-tight font-mono">Readability Index</span>
                                    <strong className="text-[10px] text-brand-cyan block mt-1 leading-tight font-bold">{refactorResult.readabilityRating || "A+"}</strong>
                                  </div>
                                  <div className="p-2.5 bg-[#0d0d10] border border-[#a2a9b3]/10 rounded-lg flex flex-col justify-between">
                                    <span className="text-[8.5px] uppercase font-mono tracking-wider text-zinc-500 block leading-tight">Performance Gain</span>
                                    <strong className="text-[10px] font-mono text-white block mt-1 leading-tight truncate" title={refactorResult.performanceGain}>{refactorResult.performanceGain || "Optimized"}</strong>
                                  </div>
                                </div>

                                {/* Applied patches check */}
                                {refactorResult.remediations && refactorResult.remediations.length > 0 && (
                                  <div className="p-3 bg-[#05060a]/75 border border-white/5 rounded-lg text-left">
                                    <span className="text-[8.5px] font-mono text-zinc-400 uppercase tracking-wider block font-bold mb-1.5">Applied Refactoring Patches:</span>
                                    <ul className="space-y-1">
                                      {refactorResult.remediations.map((rem: string, rIdx: number) => (
                                        <li key={rIdx} className="text-[10.5px] text-zinc-400 flex items-start gap-1.5 leading-tight">
                                          <span className="text-brand-cyan shrink-0">✦</span>
                                          <span>{rem}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Output Code Preview with syntax highlight */}
                                <div className="text-left flex-1 flex flex-col justify-between gap-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Optimized Output Solution</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (refactorResult?.refactoredCode) {
                                          navigator.clipboard.writeText(refactorResult.refactoredCode);
                                        }
                                      }}
                                      className="text-[9.5px] font-mono text-brand-blue hover:underline cursor-pointer"
                                    >
                                      Copy Crafted Code
                                    </button>
                                  </div>
                                  
                                  <div className="flex-1 max-h-[190px] overflow-y-auto custom-scrollbar border border-[#0d59ff]/15 rounded-lg bg-black/80 p-1">
                                    <SyntaxHighlighter
                                      style={vscDarkPlus as any}
                                      language={refactorLanguage}
                                      PreTag="div"
                                      className="!bg-transparent text-[10px] !m-0 !p-2"
                                    >
                                      {refactorResult.refactoredCode || "// Output generated..."}
                                    </SyntaxHighlighter>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                                <Sparkles className="w-10 h-10 text-zinc-700 animate-pulse mb-2" />
                                <p className="text-[11px] font-mono max-w-sm leading-relaxed">
                                  Configure your source code on the left (or load a dynamic anti-pattern template) and click "Execute AI Refactor" to witness our compile-safe refactoring.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

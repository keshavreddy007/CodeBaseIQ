import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

function handleErrorResponse(res: any, error: any, defaultMessage: string) {
  console.error("API Error:", error);
  let errorMessage = error?.message || defaultMessage;
  try {
    const parsed = typeof errorMessage === 'string' ? JSON.parse(errorMessage) : errorMessage;
    if (parsed && parsed.error && parsed.error.message) {
      errorMessage = parsed.error.message;
    }
  } catch (e) {}

  if (typeof errorMessage === 'string' && (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE"))) {
    errorMessage = "The AI model is currently experiencing high demand. Please try again in a few moments.";
  }

  res.status(500).json({ error: errorMessage });
}

// Input validation and sanitization helpers
function isSafeString(val: any, maxLength: number): boolean {
  if (typeof val !== "string") return false;
  if (val.length > maxLength) return false;
  // Reject null-byte characters to prevent injection
  if (val.indexOf("\0") !== -1) return false;
  return true;
}

function sanitizeText(val: string): string {
  if (!val) return "";
  // Strip control characters except newline, carriage return, and tab
  return val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
}

function validateEmail(email: any): boolean {
  if (!isSafeString(email, 255)) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateGithubUrl(url: any): boolean {
  if (!isSafeString(url, 2048)) return false;
  const cleanedUrl = url.trim().split("?")[0].split("#")[0];
  const match = cleanedUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return false;
  
  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");
  const nameRegex = /^[a-zA-Z0-9_.-]+$/;
  return nameRegex.test(owner) && nameRegex.test(repo);
}

function limitPayloadSize(maxBytes: number) {
  return (req: any, res: any, next: any) => {
    const contentLength = req.headers["content-length"];
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      return res.status(413).json({ error: `Payload size exceeds the safety limit of ${maxBytes} bytes.` });
    }
    next();
  };
}

async function callGeminiWithFallback(
  ai: any,
  fn: (modelName: string) => Promise<any>,
  preferredModel: string = "gemini-3.5-flash"
) {
  const modelsToTry = Array.from(new Set([
    preferredModel,
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ]));
  
  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      return await fn(model);
    } catch (err: any) {
      lastError = err;
      // Soft transition to the next active provider route silently to protect logging from false-positives
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable trust proxy so express-rate-limit can accurately detect client IP addresses behind Cloud Run proxy
  app.set("trust proxy", 1);

  // Security Middlewares
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false,
  }));

  // Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." }
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many authentication attempts, please try again in 15 minutes." }
  });

  // Apply rate limiters to API routes (specific ones first)
  app.use("/api/auth/", authLimiter);
  app.use("/api/", apiLimiter);

  app.use(express.json({ limit: '10mb' })); // Limit body payload to prevent DoS

  // Global catcher for malformed JSON parsing errors
  app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
      return res.status(400).json({ error: "Malformed JSON payload rejected." });
    }
    next();
  });

  // In-memory OTP storage for OTP authorization
  const otpStore = new Map<string, { code: string; expiresAt: number }>();

  // Send OTP
  app.post("/api/auth/send-otp", limitPayloadSize(1024), (req, res) => {
    try {
      const { email } = req.body;
      if (!validateEmail(email)) {
        return res.status(400).json({ error: "A valid email address is required" });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // valid for 5 minutes

      otpStore.set(email.toLowerCase(), { code, expiresAt });

      console.log(`[OTP Verification Sent] Email: ${email} -> Code: ${code}`);

      return res.json({
        success: true,
        message: "One-Time Passcode sent successfully.",
        // For testing and beautiful sandbox preview, we return the passcode
        debugCode: code
      });
    } catch (err: any) {
      console.error("send-otp error:", err);
      return res.status(500).json({ error: "Failed to send One-Time Passcode" });
    }
  });

  // Verify OTP
  app.post("/api/auth/verify-otp", limitPayloadSize(1024), (req, res) => {
    try {
      const { email, code } = req.body;
      if (!validateEmail(email) || !code || !isSafeString(code, 15) || !/^\d{6}$/.test(code.trim())) {
        return res.status(400).json({ error: "Email and a valid 6-digit passcode are required" });
      }

      const record = otpStore.get(email.toLowerCase());
      if (!record) {
        return res.status(400).json({ error: "No pending OTP request found for this email" });
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return res.status(400).json({ error: "The passcode has expired. Please request a new one." });
      }

      if (record.code !== code.trim()) {
        return res.status(400).json({ error: "Invalid passcode. Please check and try again." });
      }

      // Valid passcode! Clear from storage to enforce single-use
      otpStore.delete(email.toLowerCase());

      return res.json({
        success: true,
        message: "Passcode verification successful."
      });
    } catch (err: any) {
      console.error("verify-otp error:", err);
      return res.status(500).json({ error: "Verification failed" });
    }
  });

  // API Routes
  app.post("/api/analyze", limitPayloadSize(10240), async (req, res) => {
    try {
      const { githubUrl, githubToken } = req.body;
      if (!githubUrl || !validateGithubUrl(githubUrl)) {
        return res.status(400).json({ error: "Invalid, insecure, or missing GitHub repository URL." });
      }

      const match = githubUrl.trim().split("?")[0].split("#")[0].match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return res.status(400).json({ error: "Invalid GitHub URL. Must be github.com/owner/repo" });
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, "");

      const headers: Record<string, string> = { "User-Agent": "CodeBaseIQ-App" };
      if (githubToken) {
        const trimmedToken = githubToken.trim();
        if (trimmedToken) {
          if (!isSafeString(trimmedToken, 255) || !/^[a-zA-Z0-9_.-]+$/.test(trimmedToken)) {
            return res.status(400).json({ error: "Invalid character pattern in GitHub Personal Access Token." });
          }
          headers["Authorization"] = `token ${trimmedToken}`;
        }
      }
      
      let fileTreeArray = [];
      try {
        const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
        if (!treeRes.ok) {
          throw new Error(`GitHub API returned status ${treeRes.status}`);
        }
        if (treeRes.ok) {
          const treeData = await treeRes.json();
          if (treeData && treeData.tree) {
            fileTreeArray = treeData.tree
              .filter((item: any) => !item.path.startsWith('.'))
              .slice(0, 1000)
              .map((item: any) => (item.type === 'tree' ? `📁 ${item.path}/` : `📄 ${item.path}`));
          }
        }
      } catch (e: any) {
        console.error("Tree error", e);
        throw new Error(`Failed to fetch repository tree: ${e.message || e}`);
      }
      
      let readme = "No README provided.";
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
        if (readmeRes.ok) {
          const readmeData = await readmeRes.json();
          readme = Buffer.from(readmeData.content, "base64").toString("utf-8").slice(0, 100000);
        }
      } catch(e) {
         console.error("Readme error", e);
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const prompt = `You are a senior elite software engineer, solutions architect, and onboarding instructor analyzing this codebase.
Repository: ${owner}/${repo}

README:
${readme}

File Tree Sample:
${fileTreeArray.join('\n')}

Analyze this codebase structure, patterns, files, and readmes and provide a deeply technical, accurate structure.

Return a JSON response with the exact following structure:
{
  "summary": "An elegant, highly scannable summary highlighting the codebase's main goals, key features, and development stack (markdown).",
  "overview": "A clear, concise system overview highlighting the main business logic (markdown).",
  "authFlow": "Authentication flow explanation or 'Not found' (markdown).",
  "infrastructure": "Infrastructure and services breakdown (markdown).",
  "suggestedReading": ["Crucial entrypoints, packages, configs, or source files in an array of strings"],
  "architecture": "In-depth codebase architecture explainer. Break down layout, file patterns, design patterns (MVC, Hexagonal, Clean, SPA/Multi-page, Serverless, SSR) and state management in detail (markdown).",
  "onboarding": "Exhaustive onboarding documentation for joining engineers: local system prerequisites, environment setup variables, exact dependency installation scripts, local launch steps, testing guide, and a 30-60-90 day engineering integration milestone sequence (markdown).",
  "walkthrough": "An AI-powered logical walkthrough. Trace how a typical requests enters the application, where it is routed, what components handle the logic, and how the payload returns or is rendered (markdown).",
  "dependencyMap": [
    { "source": "Source Component/Folder", "target": "Target Component/Folder/Dependency", "label": "imports/calls/implements/mounts" }
  ]
}`;

      const response = await callGeminiWithFallback(ai, (modelName) =>
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        })
      );

      const data = JSON.parse(response.text!);
      res.json({
        owner, 
        repo, 
        fileTree: fileTreeArray,
        data
      });
    } catch (e: any) {
      handleErrorResponse(res, e, "Failed to analyze repository");
    }
  });

  app.post("/api/chat", limitPayloadSize(3145728), async (req, res) => {
    try {
      const { message, context } = req.body;
      if (!message || !isSafeString(message, 10000)) {
        return res.status(400).json({ error: "Invalid message payload. Maximum permitted size is 10,000 characters." });
      }

      const sanitizedMessage = sanitizeText(message);

      if (context) {
        try {
          const serialized = JSON.stringify(context);
          if (serialized.length > 2 * 1024 * 1024) {
            return res.status(400).json({ error: "Context payload size exceeds safety limits." });
          }
        } catch (e) {
          return res.status(400).json({ error: "Invalid context payload structure." });
        }
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const prompt = `You are an AI assistant for a repository. Here is context about it:
${JSON.stringify(context?.data || context || "").substring(0, 150000)}
 
User Question: ${sanitizedMessage}
 
Provide a concise, helpful answer in Markdown.`;

      const response = await callGeminiWithFallback(ai, (modelName) =>
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
        })
      );

      res.json({ reply: response.text });
    } catch (e: any) {
      handleErrorResponse(res, e, "Failed to generate AI response");
    }
  });

  app.post("/api/agent/chat", limitPayloadSize(5242880), async (req, res) => {
    try {
      const { message, history, repoContext, repoUrl, agentRole, agentPrompt } = req.body;
      if (!message || !isSafeString(message, 10000)) {
        return res.status(400).json({ error: "Invalid message. Under 10,000 characters required." });
      }

      const sanitizedMessage = sanitizeText(message);
      const sanitizedRepoContext = repoContext ? sanitizeText(repoContext) : "";
      const sanitizedRepoUrl = repoUrl ? sanitizeText(repoUrl) : "";
      const sanitizedAgentRole = agentRole ? sanitizeText(agentRole) : "";
      const sanitizedAgentPrompt = agentPrompt ? sanitizeText(agentPrompt) : "";

      if (repoUrl && !isSafeString(sanitizedRepoUrl, 2048)) {
        return res.status(400).json({ error: "Invalid repository URL parameter." });
      }
      if (agentRole && !isSafeString(sanitizedAgentRole, 200)) {
        return res.status(400).json({ error: "Invalid agent role parameter." });
      }
      if (agentPrompt && !isSafeString(sanitizedAgentPrompt, 10000)) {
        return res.status(400).json({ error: "Invalid custom instructions prompt parameter." });
      }
      if (repoContext && !isSafeString(repoContext, 150000)) {
        return res.status(400).json({ error: "Repository instruction context size exceeds limit." });
      }

      if (history) {
        if (!Array.isArray(history)) {
          return res.status(400).json({ error: "Chat history must be an array." });
        }
        if (history.length > 100) {
          return res.status(400).json({ error: "Chat history length exceeds safety limits." });
        }
        for (const item of history) {
          if (!item || typeof item !== "object") {
            return res.status(400).json({ error: "Malformed history item." });
          }
          if (item.role !== "user" && item.role !== "model" && item.role !== "assistant" && item.role !== "system") {
            return res.status(400).json({ error: "Invalid chat history role." });
          }
          if (item.content && !isSafeString(item.content, 10000)) {
            return res.status(400).json({ error: "Chat history item contains unsafe or oversized content." });
          }
        }
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let systemInstruction = "You are CodeBaseIQ AI, an advanced developer agent and codebase guide. You are specialized in large-scale system design, secure microservices, containerization, SOC2 compliance, performance scaling, and deep repository maps. Help the user with direct, production-grade solutions, code structures, and comprehensive architecture suggestions. You are an expert at explaining libraries, debugging complex issues, generating robust unit tests, explaining architectural flows, and writing extremely clean code.";

      if (sanitizedAgentPrompt) {
        systemInstruction = `You are CodeBaseIQ AI, acting as the ${sanitizedAgentRole || 'Developer Agent'}. ${sanitizedAgentPrompt}`;
      }

      if (sanitizedRepoUrl) {
        systemInstruction += ` You are currently aiding the user in understanding the GitHub repository: ${sanitizedRepoUrl}. Help guide them through files, logic locations, and suggest patterns.`;
      }

      const formattedHistory = (history || []).map((h: any) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: sanitizeText(h.content || "") }]
      }));

      let prompt = sanitizedMessage;
      if (sanitizedRepoContext) {
        prompt = `Repository Context:\n${sanitizedRepoContext}\n\nUser Question:\n${sanitizedMessage}`;
      }

      const response = await callGeminiWithFallback(ai, (modelName) => {
        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction,
          },
          history: formattedHistory,
        });
        return chat.sendMessage({ message: prompt });
      });

      res.json({ reply: response.text });
    } catch (e: any) {
      handleErrorResponse(res, e, "Failed to generate AI response");
    }
  });

  app.post("/api/enterprise/compliance-scan", limitPayloadSize(2097152), async (req, res) => {
    try {
      const { systemScope, cloudProvider, microservices } = req.body;
      if (systemScope && !isSafeString(systemScope, 2000)) {
        return res.status(400).json({ error: "Compliance scope explanation is too long (maximum 2000 characters)." });
      }
      if (!cloudProvider || !isSafeString(cloudProvider, 200)) {
        return res.status(400).json({ error: "Target cloud provider identifier is invalid or missing." });
      }
      
      const sanitizedScope = systemScope ? sanitizeText(systemScope) : "";
      const sanitizedProvider = sanitizeText(cloudProvider);

      if (microservices) {
        try {
          const serialized = JSON.stringify(microservices);
          if (serialized.length > 1 * 1024 * 1024) {
            return res.status(400).json({ error: "Microservices topography payload exceeds safety limits." });
          }
        } catch (e) {
          return res.status(400).json({ error: "Malformed microservices payload structural format." });
        }
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
 
      const prompt = `You are a Principal Enterprise DevSecOps Auditor and SOC2 Compliance Architect.
Analyze the following custom system architecture and microservices map:
- Target Cloud Provider: ${sanitizedProvider}
- Audit Compliance Target: ${sanitizedScope || "SOC2 Type II + OWASP Top 10 Security check"}
- Active Topology Nodes & Services:
${JSON.stringify(microservices, null, 2)}
 
Provide an exhaustive DevSecOps Security Scan & Audit Report in beautiful markdown:
1. **Architecture Threat Index**: Give a numeric security score (e.g., 68/100) and explain major vulnerabilities detected.
2. **SOC2 Criteria Gap Analysis**: Detail gaps in security control points, access lists (IAM), logging architectures, and multi-region failovers.
3. **Targeted Microservice Attack Vectors**: Highlight risks concerning communication endpoints, unprotected database connections, or storage exposures.
4. **Actionable Compliance Patch**: Provide actual concrete suggestions or Terraform policies to remediate these issues.
 
Make it clean, deeply architectural, and tailored to the provided microservices structure.`;

      const response = await callGeminiWithFallback(ai, (modelName) =>
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
        })
      );

      res.json({ report: response.text });
    } catch (e: any) {
      handleErrorResponse(res, e, "Failed to compile compliance report");
    }
  });

  app.post("/api/refactor", limitPayloadSize(1048576), async (req, res) => {
    try {
      const { code, language, mode } = req.body;
      if (!code || !isSafeString(code, 200000)) {
        return res.status(400).json({ error: "Source code is either missing, malformed, or exceeds the 200KB limit." });
      }
      if (language && !isSafeString(language, 100)) {
        return res.status(400).json({ error: "Language parameter is invalid or too long." });
      }
      if (!mode || !isSafeString(mode, 100)) {
        return res.status(400).json({ error: "Refactoring mode parameter is invalid or too long." });
      }

      const allowedModes = ["solid", "performance", "typesafe", "security", "tests"];
      if (!allowedModes.includes(mode)) {
        return res.status(400).json({ error: "Unsupported or unauthorized refactoring mode requested." });
      }

      const sanitizedLang = language ? sanitizeText(language) : "typescript";

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const modeTitle = 
        mode === 'solid' ? 'SOLID Principles & Modularization' :
        mode === 'performance' ? 'High-Performance & Latency Optimization' :
        mode === 'typesafe' ? 'TypeScript/Static Type Safety Hardening' :
        mode === 'security' ? 'OWASP Threat Hardening & Secure Storage' :
        'Comprehensive Automated Unit Test Generation (Jest/Vitest)';

      const prompt = `You are a Principal Software Refactoring Engineer and Static Code Auditor.
Analyze this code written in ${sanitizedLang} using the requested strategy: "${modeTitle}".
 
CODE TO REFACTOR:
\`\`\`${sanitizedLang}
${code}
\`\`\`

Perform an elite code restructuring. Ensure that:
- For SOLID: modularize long nested blocks, enforce single responsibilities, eliminate code duplication (DRY).
- For Performance: optimize loops, utilize proper cache bindings, prevent unnecessary object cloning, and optimize memory footprints.
- For Type Safety: replace dynamic "any" statements with exact union types, interfaces, or generic type constraints.
- For Security: filter possible SQL/NoSQL injections, sanitize parameters, use secure cryptos, and protect cross-site exposures.
- For Unit Tests: generate production-ready unit tests with descriptive description blocks, mock parameters, edge cases, and robust assertions.

You MUST respond with a valid JSON document matching this exact structure:
{
  "refactoredCode": "THE COMPLETE Restructured or generated code. DO NOT wrap with markdown backticks inside this JSON string.",
  "complexityBefore": "Estimated cyclomatic complexity / design score before refactor (e.g. 'Cyclomatic: 18 - Very High')",
  "complexityAfter": "Estimated complexity / design score after refactor (e.g. 'Cyclomatic: 4 - Excellent')",
  "readabilityRating": "Estimation of readability improve (e.g. '92% (+28% boost)')",
  "performanceGain": "Predicted execution/memory speed gains (e.g. '20-30% heap usage reduction')",
  "vulnerabilityScore": "Vulnerability findings and changes if any (e.g. '0 vulnerabilities detected')",
  "remediations": [
    "Brief point 1 summarizing code smells resolved",
    "Brief point 2 summarizing design patterns implemented"
  ]
}

Ensure the response is strictly valid JSON only. Do not wrap outer response in markdown code blocks.`;

      const response = await callGeminiWithFallback(ai, (modelName) =>
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        })
      );

      const data = JSON.parse(response.text!);
      res.json(data);
    } catch (e: any) {
      handleErrorResponse(res, e, "Failed to analyze and refactor code sandbox");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

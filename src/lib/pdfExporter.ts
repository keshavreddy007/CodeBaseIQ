import { jsPDF } from "jspdf";

export interface PDFExportData {
  owner: string;
  repo: string;
  data: {
    summary?: string;
    overview?: string;
    architecture?: string;
    onboarding?: string;
    walkthrough?: string;
    dependencyMap?: Array<{ source: string; target: string; label?: string }>;
    authFlow?: string;
    infrastructure?: string;
    suggestedReading?: string[];
  };
}

export function generateStyledPDF(displayData: PDFExportData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  // Page size info
  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2); // 170

  let yPos = 25;

  // Helper check for page overflow
  function checkPageOverflow(neededHeight: number) {
    if (yPos + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      yPos = 25; // Reset to top margin on next page
      drawPageBackground();
    }
  }

  // Draw elegant background framing / header for non-cover pages
  function drawPageBackground() {
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    // Top border line
    doc.line(margin, 16, pageWidth - margin, 16);
    
    // Tiny header tag
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`CodeBaseIQ Analysis — ${displayData.owner}/${displayData.repo}`, margin, 12);
  }

  // Cover Page
  // Accent gradient block on top
  doc.setFillColor(37, 99, 235); // Brand Blue (RGB 37, 99, 235)
  doc.rect(0, 0, pageWidth, 12, "F");

  // Subtle logo & label
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(37, 99, 235);
  doc.text("CODEBASEIQ REPORT" , margin, 28);
  
  doc.setFont("Helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text("  |  System Blueprint & Security Graph Summary", margin + 44, 28);

  yPos = 45;

  // Repo name
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42); // slate-900 (off black)
  doc.text(`${displayData.owner} / ${displayData.repo}`, margin, yPos);
  yPos += 12;

  // Subtitle
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text("Comprehensive Codebase Audit, Logic Topologies, and Dependencies Mapping Vector Summary", margin, yPos);
  yPos += 14;

  // Metadata block
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, yPos, contentWidth, 24, 3, 3, "FD");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("REPORT METADATA", margin + 6, yPos + 7);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleDateString()} / ${new Date().toLocaleTimeString()}`, margin + 6, yPos + 14);
  doc.text(`Core Capability: Static Structural Source Parsing & Multi-Section Analysis Blueprint`, margin + 6, yPos + 19);
  yPos += 36;

  // Draw separator line
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 12;

  // Render Section Helper
  function renderMarkdownSection(title: string, markdownText: string, accentColor: [number, number, number]) {
    checkPageOverflow(22);
    
    // Draw Section Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(title, margin, yPos);
    
    // Subtle line below section header
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, yPos + 2.5, margin + 25, yPos + 2.5);
    yPos += 10;

    if (!markdownText) {
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("No documentation generated for this section.", margin, yPos);
      yPos += 8;
      return;
    }

    const lines = markdownText.split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Code Block Detection
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          inCodeBlock = false;
          drawCodeBox(codeContent);
          codeContent = [];
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(lines[i]);
        continue;
      }

      if (line === "") {
        yPos += 2.5;
        continue;
      }

      // Parse headers
      if (line.startsWith("#")) {
        let level = 0;
        while (line.startsWith("#")) {
          level++;
          line = line.substring(1);
        }
        line = line.trim();
        const headerSize = level === 1 ? 13 : level === 2 ? 11.5 : 10;
        checkPageOverflow(headerSize + 4);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(headerSize);
        doc.setTextColor(30, 41, 59); // slate-800
        doc.text(line, margin, yPos);
        yPos += (headerSize / 1.5) + 2;
        continue;
      }

      // Parse bullet lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const cleanedText = line.substring(2).trim();
        checkPageOverflow(8);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85); // slate-700
        
        // Draw real circular bullet
        doc.setFillColor(71, 85, 105);
        doc.circle(margin + 2.5, yPos - 1.2, 0.7, "F");

        const bulletWidth = contentWidth - 6;
        const splitText = doc.splitTextToSize(cleanedText, bulletWidth);
        for (const lineSegment of splitText) {
          checkPageOverflow(5);
          doc.text(lineSegment, margin + 6, yPos);
          yPos += 4.5;
        }
        continue;
      }

      // Standard Paragraph
      checkPageOverflow(8);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85); // slate-700
      
      // Clean markdown tags
      let processedLine = line
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1");
        
      const splitText = doc.splitTextToSize(processedLine, contentWidth);
      for (const segment of splitText) {
        checkPageOverflow(5);
        doc.text(segment, margin, yPos);
        yPos += 4.5;
      }
      yPos += 1;
    }

    yPos += 6;
  }

  // Draw Code Block Panel helper
  function drawCodeBox(lines: string[]) {
    // Basic formatting constraint to limit height of code blocks inside PDF to prevent infinite overflow
    const parsedLines = lines.slice(0, 18);
    const boxHeight = (parsedLines.length * 4) + 6;
    checkPageOverflow(boxHeight + 4);

    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.roundedRect(margin, yPos, contentWidth, boxHeight, 1.5, 1.5, "FD");

    doc.setFont("Courier", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    let innerY = yPos + 5;
    for (const codeLine of parsedLines) {
      const truncatedLine = codeLine.substring(0, 95);
      doc.text(truncatedLine, margin + 5, innerY);
      innerY += 3.8;
    }
    
    yPos += boxHeight + 4;
  }

  // --- SECTION DATA PIPELINE ---

  // Section 1: Executive Summary
  renderMarkdownSection(
    "1. Executive Summary & Overview", 
    displayData.data.summary || displayData.data.overview || "", 
    [37, 99, 235] // Brand Blue
  );

  // Section 2: System Architecture
  const authPart = displayData.data.authFlow ? `### Authentication Protocol & Session Control\n${displayData.data.authFlow}` : "";
  const infraPart = displayData.data.infrastructure ? `### Infrastructure & Deployment Protocol\n${displayData.data.infrastructure}` : "";
  const fullArchContent = `${displayData.data.architecture || ""}\n\n${authPart}\n\n${infraPart}`;
  
  renderMarkdownSection(
    "2. System Architecture & Topology", 
    fullArchContent.trim(), 
    [124, 58, 237] // Brand Violet
  );

  // Section 3: Developer Onboarding
  renderMarkdownSection(
    "3. Developer Onboarding Instructions", 
    displayData.data.onboarding || "", 
    [217, 119, 6] // Amber Accent
  );

  // Section 4: Execution Walkthrough
  renderMarkdownSection(
    "4. System Execution & Data Pathway Walkthrough", 
    displayData.data.walkthrough || "", 
    [8, 145, 178] // Cyan Accent
  );

  // Section 5: Dependency Mappings Tree
  const relations = displayData.data.dependencyMap || [];
  if (relations.length > 0) {
    checkPageOverflow(32);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text("5. Extracted Dependencies Relations", margin, yPos);
    
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.4);
    doc.line(margin, yPos + 2.5, margin + 25, yPos + 2.5);
    yPos += 10;

    // Draw table header
    doc.setFillColor(240, 253, 250); // emerald-50 bg
    doc.setDrawColor(204, 251, 241); // emerald-100 border
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, yPos, contentWidth, 8, 1, 1, "FD");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Source Module/Path", margin + 4, yPos + 5.5);
    doc.text("Connection Logic", margin + 70, yPos + 5.5);
    doc.text("Target Module/Path", margin + 115, yPos + 5.5);
    yPos += 8;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    for (const rel of relations) {
      checkPageOverflow(9);
      
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(241, 245, 249);
      doc.rect(margin, yPos, contentWidth, 8, "FD");

      const label = rel.label || "references";
      const sourceCut = rel.source.length > 32 ? rel.source.substring(0, 30) + "..." : rel.source;
      const targetCut = rel.target.length > 32 ? rel.target.substring(0, 30) + "..." : rel.target;

      doc.text(sourceCut, margin + 4, yPos + 5.5);
      
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text(label, margin + 70, yPos + 5.5);
      
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(targetCut, margin + 115, yPos + 5.5);
      
      yPos += 8;
    }
  }

  // --- COMPILING TOTAL PAGE NUMBERS & WATERMARKS ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("Report compiled securely via CodeBaseIQ", margin, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 10);
  }

  doc.save(`${displayData.owner}-${displayData.repo}-master-architecture.pdf`);
}

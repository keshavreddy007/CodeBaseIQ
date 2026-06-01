const fs = require('fs');
const { execSync } = require('child_process');
const files = execSync('find src -name "*.tsx"').toString().split('\n').filter(Boolean);
for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('AnimatePresence')) {
    content = content.replace(/import\s*\{\s*([^}]*?),\s*AnimatePresence\s*\}\s*from\s*"motion\/react";/g, 'import { $1 } from "motion/react";');
    content = content.replace(/import\s*\{\s*AnimatePresence\s*,\s*([^}]*?)\s*\}\s*from\s*"motion\/react";/g, 'import { $1 } from "motion/react";');
    content = content.replace(/import\s*\{\s*AnimatePresence\s*\}\s*from\s*"motion\/react";/g, '');
    content = content.replace(/<AnimatePresence\b[^>]*>/g, '<>');
    content = content.replace(/<\/AnimatePresence>/g, '</>');
    fs.writeFileSync(file, content);
    console.log('Removed AnimatePresence from', file);
  }
}

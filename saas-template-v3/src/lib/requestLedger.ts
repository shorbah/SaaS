import saveAs from 'file-saver';

export interface RequestLedgerEntry {
  id: string;
  timestamp: string;
  author: string;
  raw_prompt: string;
  intent_category: 'architecture' | 'feature' | 'bugfix' | 'preference' | 'refactor' | string;
  decisions_made: string[];
  corrections_given: string[];
  candidate_rule?: string;
}

/**
 * Format ledger entries into clean, readable Arabic Markdown document
 */
export function formatLedgerAsMarkdown(entries: RequestLedgerEntry[]): string {
  let md = `# 📜 سجل الطلبات والقرارات المعمارية للمشروع\n\n`;
  md += `> تم تصدير هذا التقرير تلقائياً بتاريخ: ${new Date().toLocaleString('ar-SA')}\n\n---\n\n`;

  entries.forEach((entry, idx) => {
    md += `### ${idx + 1}. [${entry.intent_category.toUpperCase()}] ${entry.id}\n`;
    md += `- **التاريخ:** ${entry.timestamp}\n`;
    md += `- **الكاتب:** ${entry.author}\n\n`;
    md += `#### 💬 نص الطلب الأصلي:\n> "${entry.raw_prompt}"\n\n`;

    if (entry.decisions_made && entry.decisions_made.length > 0) {
      md += `#### 🏛️ القرارات المعمارية المعتمدة:\n`;
      entry.decisions_made.forEach(d => {
        md += `- ${d}\n`;
      });
      md += `\n`;
    }

    if (entry.corrections_given && entry.corrections_given.length > 0) {
      md += `#### ⚠️ التوجيهات والتصحيحات الصادرة:\n`;
      entry.corrections_given.forEach(c => {
        md += `- ${c}\n`;
      });
      md += `\n`;
    }

    if (entry.candidate_rule) {
      md += `#### 🧠 القاعدة المستخلصة للمستقبل:\n\`\`\`markdown\n${entry.candidate_rule}\n\`\`\`\n\n`;
    }

    md += `---\n\n`;
  });

  return md;
}

/**
 * Trigger in-browser download of the requests ledger
 */
export function downloadLedgerFile(entries: RequestLedgerEntry[], format: 'md' | 'json' = 'md') {
  if (format === 'json') {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json;charset=utf-8' });
    saveAs(blob, `project_requests_ledger_${new Date().toISOString().slice(0, 10)}.json`);
  } else {
    const mdContent = formatLedgerAsMarkdown(entries);
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `project_requests_ledger_${new Date().toISOString().slice(0, 10)}.md`);
  }
}

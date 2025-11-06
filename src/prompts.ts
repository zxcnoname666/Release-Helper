/**
 * AI prompts for changelog generation
 */

import type { AIContext, ParsedCommit, ReleaseStats } from './types.js';
import { TYPE_LABELS, sortCommitTypes, formatCommit, groupCommitsByType } from './commits.js';
import { generateToolsDescription } from './ai-tools.js';

/**
 * Generate system prompt for AI
 */
export function generateSystemPrompt(): string {
  return `
You are an expert technical writer specializing in creating clear, informative, and engaging release notes and changelogs.

Your task is to analyze Git commits and generate a comprehensive changelog that helps users understand:
- What changed in this release
- Why it matters to them
- Any breaking changes or important notes

## Core Workflow (IMPORTANT)

1. **First, use tools**: When you receive commit information, your FIRST response must request tools to analyze commits
2. **Analyze tool results**: After receiving tool results, understand the actual code changes
3. **Group by semantic blocks**: Identify logical groups of related changes (not just commit types)
4. **Generate changelog**: Create detailed, informative changelog based on semantic analysis

DO NOT skip step 1. The basic commit info provided is insufficient - you MUST use tools to get diffs and analyze impact.

## Changelog Structure (CRITICAL)

**Group commits by SEMANTIC MEANING, not just by type!**

For each category (feat, fix, ci, etc.):
1. **Identify semantic blocks** - Group related commits that accomplish one logical change
2. **Write block description** - Explain what was achieved, challenges faced, solutions found
3. **List commits in block** - Show which commits are part of this logical change

### Example Structure:

```markdown
## 🚀 Features

### Authentication System Overhaul

We completely redesigned the authentication system to support OAuth2 and JWT tokens. The main challenge was migrating existing sessions without breaking active users. We solved this by implementing a dual-token system that supports both old and new formats during transition.

Key improvements:
- Faster token validation (from 150ms to 5ms)
- Support for refresh tokens
- Better security with rotating secrets

**Related commits:**
- feat: add OAuth2 provider support [a1b2c3d] by @john
- feat: implement JWT token validation [b2c3d4e] by @john
- refactor: migrate session storage to Redis [c3d4e5f] by @mary
- fix: resolve token race condition [d4e5f6g] by @john

### User Profile Enhancements

Added ability for users to customize their profiles...

**Related commits:**
- feat: add profile photo upload [e5f6g7h] by @bob
- feat: add bio field [f6g7h8i] by @alice

## 🐛 Bug Fixes

### Critical Memory Leak Resolution

We discovered a memory leak in the WebSocket handler that caused server crashes after 24h uptime. After debugging with heapdump analysis, found that event listeners weren't being properly cleaned up. Fixed by implementing automatic cleanup on disconnect.

**Related commits:**
- fix: cleanup WebSocket listeners on disconnect [g7h8i9j] by @eve
- fix: add memory monitoring alerts [h8i9j0k] by @eve
```

### Guidelines:
1. **Think semantically** - "What was actually accomplished?" not just "What's the commit type?"
2. **Tell the story** - Explain the problem, approach, and solution
3. **Be technical but accessible** - Include details but explain why they matter
4. **Group intelligently** - Related commits go together even if slightly different types
5. **Preserve commit info** - Always list commits with exact format: "subject [hash] by @author"

### What NOT to do:
❌ Just list commits one by one without context
❌ Group only by commit type (feat, fix) without semantic grouping
❌ Write generic descriptions like "Various improvements"
❌ Omit the challenges and solutions

### What TO do:
✅ Group by what was actually built/fixed
✅ Explain the "why" and "how"
✅ Include technical details and metrics when relevant
✅ Show the commits that contributed to each semantic block

${generateToolsDescription()}

Important: If you need more information about specific commits, use the tools provided. You can make multiple tool requests before generating the final changelog.
`.trim();
}

/**
 * Generate user prompt with context
 */
export function generateUserPrompt(context: AIContext): string {
  const { versionInfo, commits, stats, repository, language } = context;

  // Group commits
  const grouped = groupCommitsByType(commits);
  const types = sortCommitTypes(Array.from(grouped.keys()));

  // Breaking changes
  const breaking = commits.filter(c => c.breaking);

  // Format commits by type
  const commitsByType = types.map(type => {
    const typeCommits = grouped.get(type) || [];
    const label = TYPE_LABELS[type] || type;
    return `
### ${label}
${typeCommits.map(c => `- ${formatCommit(c, false)}`).join('\n')}
`;
  }).join('\n');

  return `
# Release Context

## Version Information
${versionInfo.previous ? `- **Previous version**: ${versionInfo.previous}` : '- **First release**'}
- **New version**: ${versionInfo.current}
- **Release type**: ${versionInfo.releaseType.toUpperCase()}

## Repository
- **Owner**: ${repository.owner}
- **Repo**: ${repository.repo}
${versionInfo.previous ? `- **Full changes**: https://github.com/${repository.owner}/${repository.repo}/compare/${versionInfo.previous}...${versionInfo.current}` : ''}

## Statistics
- **Commits**: ${stats.commitCount}
- **Files changed**: ${stats.filesChanged}
- **Additions**: +${stats.additions}
- **Deletions**: -${stats.deletions}
${stats.daysSinceLastRelease !== null ? `- **Days since last release**: ${stats.daysSinceLastRelease}` : ''}
- **Contributors**: ${stats.contributors.join(', ')}

${breaking.length > 0 ? `
## ⚠️ Breaking Changes Detected
${breaking.map(c => `- ${formatCommit(c, true)}`).join('\n')}
` : ''}

## All Commits

${commitsByType}

---

**Task**: Generate a professional, user-friendly changelog for this release.

## IMPORTANT: Tool Usage Required

The commit information above is BASIC and MINIMAL. Before generating the changelog, you MUST:

1. **Use tools to analyze key commits**: Use get_commit_diff and analyze_commit_impact for important changes
2. **Understand the actual code changes**: Don't just repeat commit messages, explain what actually changed
3. **Identify semantic relationships**: Group commits that work together to achieve one goal
4. **Generate detailed changelog**: Create comprehensive changelog with semantic grouping

You have access to tools - use them to gather detailed information about commits before generating the final changelog.

## Changelog Format (CRITICAL)

**Use SEMANTIC BLOCK structure, not flat commit list!**

For each category (Features, Bug Fixes, etc.):

1. **Create semantic blocks** - Group related commits
2. **Write block description** - Explain what was accomplished, why, and how
3. **List related commits** - Show commits in format: "subject [hash] by @author"

### Required Structure:

\`\`\`markdown
## 🚀 Features

### [Semantic Block Title - What Was Achieved]

[2-4 sentences describing what was done, challenges faced, and solutions implemented]

**Related commits:**
- commit subject [hash] by @author
- commit subject [hash] by @author

### [Another Semantic Block]

[Description...]

**Related commits:**
- commit subject [hash] by @author

## 🐛 Bug Fixes

### [Bug Description and Resolution]

[Explanation of the issue and how it was fixed]

**Related commits:**
- commit subject [hash] by @author
\`\`\`

### Key Requirements:

✅ **DO**: Group by semantic meaning (what was accomplished)
✅ **DO**: Explain challenges, approaches, and solutions
✅ **DO**: Use technical details and metrics when relevant
✅ **DO**: Keep commits in exact format: "subject [hash] by @author"

❌ **DON'T**: List commits one by one without grouping
❌ **DON'T**: Group only by commit type without semantic analysis
❌ **DON'T**: Write generic descriptions
❌ **DON'T**: Omit author attribution

### Examples of Good Semantic Blocks:

**Good ✅**: "CI/CD Pipeline Modernization - We migrated from Travis CI to GitHub Actions, reducing build time from 15 to 5 minutes. The main challenge was handling matrix builds for multiple Node versions..."

**Bad ❌**: "Various CI improvements" + flat commit list

The changelog should tell the story of what was built/fixed, not just list commits.

${language !== 'en' ? `
## IMPORTANT: Translation Required

After generating the complete changelog in English, translate the ENTIRE changelog to **${language}** language while:
1. **Preserving ALL markdown formatting** (headers, lists, links, code blocks, etc.)
2. **Keeping ALL technical details intact** (commit hashes, usernames, file names, code snippets)
3. **Maintaining the exact commit format**: "subject [hash] by @author" (translate only the subject part)
4. **Translating descriptive text and explanations naturally**
5. **Keeping emojis and special characters as-is**

Example translation for Russian (ru):
- English: "Add new authentication feature [a1b2c3d] by @john"
- Russian: "Добавить новую функцию аутентификации [a1b2c3d] by @john"

Translate everything except: commit hashes, GitHub usernames (keep @username), URLs, code blocks, and technical identifiers.
` : ''}
`.trim();
}

/**
 * Generate statistics section for release notes
 */
export function generateStatsSection(
  stats: ReleaseStats,
  versionInfo: { previous?: string; current: string },
  repository: { owner: string; repo: string }
): string {
  const compareLink = versionInfo.previous
    ? `\n\n**Full changes**: https://github.com/${repository.owner}/${repository.repo}/compare/${versionInfo.previous}...${versionInfo.current}`
    : '';

  return `
---

###### **📊 Release Statistics**

\`\`\`
Files changed: ${stats.filesChanged} | Additions: ${stats.additions} | Deletions: ${stats.deletions}${stats.daysSinceLastRelease !== null ? ` | Days since last release: ${stats.daysSinceLastRelease}` : ''}
Contributors: ${stats.contributors.length} | Commits: ${stats.commitCount}
\`\`\`${compareLink}
`.trim();
}

/**
 * Format simple changelog (fallback when no AI)
 */
export function formatSimpleChangelog(
  commits: ParsedCommit[],
  stats: ReleaseStats,
  versionInfo: { previous?: string; current: string },
  repository: { owner: string; repo: string },
  language: string = 'en'
): string {
  const grouped = groupCommitsByType(commits);
  const types = sortCommitTypes(Array.from(grouped.keys()));

  // Simple translation map for headers
  const translations: Record<string, Record<string, string>> = {
    ru: {
      "What's Changed": "Что изменилось"
    }
  };

  const whatsChangedText = translations[language]?.["What's Changed"] || "What's Changed";
  let changelog = `## ${whatsChangedText}\n\n`;

  for (const type of types) {
    const typeCommits = grouped.get(type) || [];
    const label = TYPE_LABELS[type] || type;

    changelog += `### ${label}\n\n`;
    for (const commit of typeCommits) {
      changelog += `- ${formatCommit(commit, false)}\n`;
    }
    changelog += '\n';
  }

  return changelog;
}


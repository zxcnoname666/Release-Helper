# 🚀 Auto Release /w AI Summary

<p align="center">
  <img src="https://img.shields.io/badge/node-20%2B-brightgreen?logo=node.js&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/typescript-5.6-blue?logo=typescript&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/github/v/release/Shiro-nn/release-helper?label=latest&style=for-the-badge" alt="Latest Release" />
  <img src="https://img.shields.io/github/actions/workflow/status/Shiro-nn/release-helper/bundle.yml?style=for-the-badge" alt="CI" />
</p>

---

## ✨ Overview

**Auto Release** is an advanced GitHub Action that revolutionizes release automation with:

- 🤖 **AI-Powered Changelog Generation** - Uses OpenAI with intelligent tools to analyze commits and generate comprehensive release notes
- 🧠 **Smart Commit Analysis** - Parses Conventional Commits and extracts multiple change types from single commits
- 📊 **Rich Release Statistics** - Tracks files changed, additions, deletions, contributors, and time since last release
- 🔧 **Built-in Tools for AI** - Provides AI with tools to inspect diffs, analyze impact, and understand changes deeply
- ⚡ **Fast & Efficient** - Built with Node.js, TypeScript, and esbuild for optimal performance
- 🎯 **SemVer Automation** - Automatic version bumping based on commit messages

---

## 🎯 What's New in v2.0

### 🔥 Major Improvements

1. **Complete Rewrite on Node.js + TypeScript**
   - Migrated from Deno to Node.js for better ecosystem compatibility
   - Full TypeScript support with strict type checking
   - Modular architecture with separated concerns

2. **Advanced AI Tools System**
   - `get_commit_details` - Get comprehensive commit information
   - `get_commit_diff` - View changes with automatic truncation for large diffs
   - `get_changed_files` - List all files modified in a commit
   - `get_commits_by_type` - Filter commits by conventional type
   - `analyze_commit_impact` - Assess the scope and impact of changes

3. **Enhanced Changelog Generation**
   - AI can now request additional information before generating changelog
   - Multi-iteration tool use for better context understanding
   - Automatic categorization with emoji headers
   - Breaking change detection and highlighting

4. **Rich Statistics**
   - Files changed count
   - Lines added/deleted
   - Days since last release
   - Contributor list
   - Commit count

5. **Smart Commit Parsing**
   - Handles multiple conventional commit types in one commit
   - Example: `feat: add feature\n\nchore: update deps` → 2 separate changes
   - Only uses first line of each type (excludes descriptions)

6. **Better Performance**
   - esbuild for fast bundling
   - Optimized Git operations
   - Efficient token usage with smart truncation

---

## 📥 Installation

Add this action to your workflow:

```yaml
name: Release

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Auto Release
        uses: Shiro-nn/release-helper@v2
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          BUILD_COMMAND: "npm run build"
          LINT_AND_TESTS_COMMAND: "npm test"
          DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
```

---

## ⚙️ Configuration

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `GITHUB_TOKEN` | ✅ | - | GitHub token for creating releases and tags |
| `OPENAI_API_KEY` | ❌ | - | OpenAI API key for AI-powered changelog generation |
| `OPENAI_API_MODEL` | ❌ | `gpt-4` | OpenAI model to use |
| `OPENAI_API_BASE_URL` | ❌ | `https://api.openai.com/v1` | OpenAI API endpoint |
| `BUILD_COMMAND` | ❌ | - | Command to build your project |
| `LINT_AND_TESTS_COMMAND` | ❌ | - | Command to run linting and tests |
| `ASSET_PATTERNS` | ❌ | - | Glob patterns for release assets (e.g., `dist/**/*.zip`) |
| `ALLOWED_BRANCH` | ❌ | `main` | Branch allowed for releases |
| `DRAFT_RELEASE` | ❌ | `false` | Create as draft release |
| `PRERELEASE` | ❌ | `false` | Mark as pre-release |
| `DISCORD_WEBHOOK` | ❌ | - | Discord webhook URL for notifications |

---

## 🚀 Usage

### Triggering a Release

Add a release command to your commit message:

```bash
# Patch release (0.0.x)
git commit -m "fix: resolve critical bug

!release: patch"

# Minor release (0.x.0)
git commit -m "feat: add new feature

!release: minor"

# Major release (x.0.0)
git commit -m "feat!: breaking change

!release: major"
```

### Example Commit for Multiple Changes

```bash
git commit -m "feat: add user authentication
chore: update dependencies
docs: improve README

!release: minor"
```

This will be parsed as 3 separate changes in the changelog:
- ✨ Features: add user authentication
- 🔧 Chores: update dependencies
- 📝 Documentation: improve README

---

## 🧠 How AI Tools Work

When AI generates the changelog, it has access to these tools:

```typescript
// Example: AI can request commit details
{
  "tool": "get_commit_details",
  "arguments": { "sha": "abc123" }
}

// Response includes:
// - Full commit message
// - Author info
// - Change statistics
// - Parsed change types
// - Breaking change indicators
```

The AI can:
1. Analyze commit impact before writing
2. Request diffs for unclear changes
3. Group related changes intelligently
4. Highlight important changes
5. Explain breaking changes clearly

---

## 📊 Example Release Output

```markdown
## What's Changed

This release focuses on improving performance and adding new features.

### ✨ Features
- **auth**: add OAuth2 support [`a1b2c3d`] by @username
- **api**: implement rate limiting [`e4f5g6h`] by @contributor

### 🐛 Bug Fixes
- **core**: fix memory leak in event loop [`i7j8k9l`] by @developer

### 📝 Documentation
- **readme**: add API examples [`m0n1o2p`] by @writer

---

###### 📊 Release Statistics

```
Files changed: 24 | Additions: 342 | Deletions: 156 | Days since last release: 7
Contributors: 4 | Commits: 15
```
```

---

## 🎨 Architecture

```
src/
├── index.ts          # Main entry point
├── types.ts          # TypeScript type definitions
├── version.ts        # Version management & semver
├── git.ts            # Git operations
├── commits.ts        # Commit parsing & analysis
├── github.ts         # GitHub API integration
├── ai.ts             # AI integration
├── ai-tools.ts       # Tool definitions for AI
├── prompts.ts        # System & user prompts
└── utils.ts          # Utility functions
```

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run type-check
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🔗 Related Actions

| Action | Description |
|--------|-------------|
| [**AI Commit Fixer**](https://github.com/Shiro-nn/ai-commit-fixer) | 🛠️ Automatically fix commit messages using AI |
| [**AI Code Reviewer**](https://github.com/Shiro-nn/ai-code-reviewer) | 👀 Automated PR reviews with AI recommendations |

---

<p align="center">Made with ❤️ by <a href="https://github.com/Shiro-nn">Shiro-nn</a></p>

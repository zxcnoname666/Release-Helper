# 🚀 Auto Release /w AI Summary

<p align="center">
  <img src="https://img.shields.io/badge/node-20%2B-brightgreen?logo=node.js&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/typescript-5.6-blue?logo=typescript&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/github/v/release/zxcnoname666/release-helper?label=latest&style=for-the-badge" alt="Latest Release" />
  <img src="https://img.shields.io/github/actions/workflow/status/zxcnoname666/release-helper/bundle.yml?style=for-the-badge" alt="CI" />
</p>

---

## Overview

Advanced GitHub Action for automated release management with AI-powered changelog generation. Streamlines version bumping, changelog creation, and release publishing with intelligent commit analysis.

### Key Features

- 🤖 **AI-Powered Changelogs** - Generates comprehensive release notes using OpenAI with context-aware tools
- 📊 **Rich Statistics** - Tracks files changed, line changes, contributors, and time metrics
- 🧠 **Smart Commit Parsing** - Extracts multiple conventional commit types from single commits
- 🔧 **AI Tools System** - Provides AI with tools to inspect diffs, analyze impact, and understand changes
- 🎯 **SemVer Automation** - Automatic version bumping based on commit messages
- ⚡ **Fast Build** - Built with TypeScript and esbuild for optimal performance
- 🔔 **Discord Notifications** - Rich embeds with release information

---

## Installation

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
        uses: zxcnoname666/release-helper@main
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          BUILD_COMMAND: "pnpm run build"
          LINT_AND_TESTS_COMMAND: "pnpm test"
          DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
```

---

## Configuration

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `GITHUB_TOKEN` | ✅ | - | GitHub token for creating releases and tags |
| `OPENAI_API_KEY` | ❌ | - | OpenAI API key for AI-powered changelog generation |
| `OPENAI_API_MODEL` | ❌ | `gpt-4` | OpenAI model to use (gpt-4, gpt-4-turbo, gpt-3.5-turbo) |
| `OPENAI_API_BASE_URL` | ❌ | `https://api.openai.com/v1` | OpenAI API endpoint (supports custom endpoints) |
| `BUILD_COMMAND` | ❌ | - | Command to build your project before release |
| `LINT_AND_TESTS_COMMAND` | ❌ | - | Command to run linting and tests before release |
| `ASSET_PATTERNS` | ❌ | - | Glob patterns for release assets (e.g., `dist/**/*.zip dist/**/*.tar.gz`) |
| `ALLOWED_BRANCH` | ❌ | `main` | Branch allowed for releases |
| `DRAFT_RELEASE` | ❌ | `false` | Create as draft release |
| `PRERELEASE` | ❌ | `false` | Mark as pre-release |
| `DISCORD_WEBHOOK` | ❌ | - | Discord webhook URL for release notifications |

---

## Usage

### Triggering Releases

Add a release command to your commit message to trigger a release:

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

### Conventional Commits

The action follows [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `style:` - Code style changes
- `perf:` - Performance improvements
- `test:` - Test updates
- `build:` - Build system changes
- `ci:` - CI configuration changes

### Multiple Changes in One Commit

You can include multiple conventional commit types in a single commit. Each type will be parsed as a separate change in the changelog:

```bash
git commit -m "feat: add user authentication
chore: update dependencies
docs: improve README

!release: minor"
```

This generates:
- ✨ **Features**: add user authentication
- 🔧 **Chores**: update dependencies
- 📝 **Documentation**: improve README

---

## AI Tools System

When generating changelogs, the AI has access to specialized tools for deeper analysis:

### Available Tools

- **get_commit_details** - Get comprehensive commit information including stats and parsed types
- **get_commit_diff** - View file changes with automatic truncation for large diffs
- **get_changed_files** - List all files modified in a commit grouped by directory
- **get_commits_by_type** - Filter commits by conventional type (feat, fix, etc.)
- **analyze_commit_impact** - Assess the scope and impact of changes (minor/moderate/major)

### How It Works

The AI can request additional context before generating the changelog:

```typescript
// Example: AI requests commit details
{
  "tool": "get_commit_details",
  "arguments": { "sha": "abc123" }
}

// Response includes full context:
// - Complete commit message
// - Author information
// - Change statistics (+additions/-deletions)
// - Parsed conventional commit types
// - Breaking change indicators
```

This allows the AI to:
1. Understand the full context of changes
2. Group related commits intelligently
3. Highlight important changes
4. Explain breaking changes with migration notes
5. Generate more accurate and helpful release notes

---

## Release Output

Generated releases include:

### Changelog Structure

```markdown
## What's Changed

Brief summary highlighting key changes.

### ✨ Features
- **auth**: add OAuth2 support [`a1b2c3d`] by @username
- **api**: implement rate limiting [`e4f5g6h`] by @contributor

### 🐛 Bug Fixes
- **core**: fix memory leak [`i7j8k9l`] by @developer

---

###### 📊 Release Statistics

```
Files changed: 24 | Additions: 342 | Deletions: 156 | Days since last release: 7
Contributors: 4 | Commits: 15
```

**Full changes**: https://github.com/owner/repo/compare/1.0.0...1.1.0
```

### Discord Notifications

Rich embeds with:
- Release version and type
- Commit count and contributors
- Files changed
- Breaking change warnings
- Direct link to release

---

## Architecture

```
src/
├── index.ts          # Main entry point and orchestration
├── types.ts          # TypeScript type definitions
├── version.ts        # Version management and semver operations
├── git.ts            # Git operations (commits, diffs, stats)
├── commits.ts        # Commit parsing and conventional commits
├── github.ts         # GitHub API integration
├── ai.ts             # AI integration and changelog generation
├── ai-tools.ts       # Tool definitions and execution for AI
├── prompts.ts        # System and user prompts for AI
└── utils.ts          # Utility functions
```

Built with:
- **Node.js 20+** - Modern JavaScript runtime
- **TypeScript 5.6** - Type-safe development
- **esbuild** - Fast bundling (~180ms)
- **Conventional Commits** - Structured commit parsing
- **OpenAI API** - AI-powered content generation

---

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Type check
pnpm run type-check
```

---

## Related Projects

| Project | Description |
|---------|-------------|
| [**AI Commit Fixer**](https://github.com/zxcnoname666/ai-commit-fixer) | Automatically fix commit messages using AI |
| [**AI Code Reviewer**](https://github.com/zxcnoname666/ai-code-reviewer) | Automated PR reviews with AI recommendations |

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">Made with ❤️ by <a href="https://github.com/zxcnoname666">zxcnoname666</a></p>

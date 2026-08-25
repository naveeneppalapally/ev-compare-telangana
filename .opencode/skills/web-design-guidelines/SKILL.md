---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Read the vendored guidelines at `.opencode/skills/web-design-guidelines/guidelines.md` (pinned snapshot of vercel-labs/web-interface-guidelines `command.md`, vendored 2026-08-24 so reviews work offline and stay reproducible)
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the vendored guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source (upstream)

To refresh the vendored rules, fetch and replace `guidelines.md` beside this file:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

## Usage

When a user provides a file or pattern argument:
1. Read the vendored guidelines first
2. Read the specified files
3. Apply all rules from the guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.

For this project, default review scope: `src/components/*.tsx`, `src/App.tsx`.

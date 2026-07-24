# git-guardrails-claude-code

Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. Use when user wants to prevent destructive git operations, add git safety hooks, or block git push/reset in Claude Code.

## Install

Copy this folder to `~/.claude/skills/git-guardrails-claude-code/` on the target machine (or run `install.sh` from the repo root).

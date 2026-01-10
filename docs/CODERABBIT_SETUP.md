# CodeRabbit AI Code Review Setup

This document provides instructions for setting up and using CodeRabbit for AI-powered code reviews in the TAC Cargo project.

## Overview

CodeRabbit provides two modes of operation:
1. **PR Reviews** - Automatic AI reviews on pull requests (primary method)
2. **CLI Reviews** - Local code reviews before committing (requires WSL on Windows)

## Quick Start - GitHub PR Reviews

### Step 1: Install CodeRabbit GitHub App

1. Visit [CodeRabbit Login](https://app.coderabbit.ai/login)
2. Click **Login with GitHub**
3. Authorize CodeRabbit for your organization
4. Select repositories to enable (or select "All repositories")
5. Complete installation

### Step 2: Create a Pull Request

Once installed, CodeRabbit automatically reviews every PR:

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat(tracking): add new tracking feature"

# Push and create PR
git push origin feature/my-feature
```

### Step 3: Interact with CodeRabbit

In your PR comments, you can:

| Command | Description |
|---------|-------------|
| `@coderabbitai review` | Request a new review |
| `@coderabbitai summary` | Generate PR summary |
| `@coderabbitai resolve` | Resolve all comments |
| `@coderabbitai pause` | Pause reviews for this PR |
| `@coderabbitai resume` | Resume reviews |
| `@coderabbitai help` | Show all commands |

## CLI Setup (Windows WSL)

The CodeRabbit CLI runs on WSL for Windows users.

### Prerequisites

1. **Install WSL** (if not already installed):
   ```powershell
   # Run in PowerShell as Administrator
   wsl --install
   ```
   Restart your computer when prompted.

2. **Launch WSL** and set up your Linux user account.

### Installation

```bash
# In WSL terminal
curl -fsSL https://cli.coderabbit.ai/install.sh | sh

# Restart shell
source ~/.bashrc

# Verify installation
coderabbit --version
```

### Authentication

```bash
# Start authentication
coderabbit auth login

# Follow the URL in your browser to authenticate
# Paste the token back in terminal

# Verify
coderabbit auth status
```

### Usage

```bash
# Navigate to project (WSL path to Windows files)
cd /mnt/c/tac-saas/tac-cargo

# Review all changes
coderabbit

# Review only uncommitted changes
coderabbit --type uncommitted

# Review only committed changes
coderabbit --type committed

# Plain text output (for AI agents)
coderabbit --plain

# Prompt-only mode (for AI coding assistants)
coderabbit --prompt-only
```

## Integration with AI Coding Assistants

### Windsurf/Cursor Integration

Use CodeRabbit CLI with your AI coding assistant:

```
Please implement the feature and then run coderabbit --prompt-only,
let it run in the background, and fix any issues it finds.
```

### Example Workflow

1. **Implement Feature**: Let AI generate code
2. **Review**: Run `coderabbit --prompt-only`
3. **Fix Issues**: Have AI fix critical issues
4. **Verify**: Run CodeRabbit again
5. **Commit**: Once clean, commit and push

## Configuration

The project uses `.coderabbit.yaml` for configuration. Key settings:

### Review Profile

```yaml
reviews:
  profile: "chill"  # Less nitpicky reviews
  # profile: "assertive"  # More detailed feedback
```

### Path-Specific Instructions

The configuration includes specialized review instructions for:
- `app/api/**` - API security and validation
- `app/actions/**` - Server action best practices
- `components/**` - React/accessibility standards
- `lib/supabase/**` - Database security
- `hooks/**` - React hook patterns
- `database/**` - SQL and RLS policies

### Excluded Paths

These paths are excluded from reviews:
- `node_modules/`, `.next/`, `dist/`
- Lock files (`package-lock.json`, etc.)
- Static assets (`*.svg`, `*.json`)
- Generated files

## Security Tools Enabled

CodeRabbit runs these security scanners:
- **Semgrep** - Static analysis for security vulnerabilities
- **Gitleaks** - Secret detection in code
- **OSV Scanner** - Dependency vulnerability scanning
- **ESLint** - Code quality and security rules

## Learnings

CodeRabbit learns from your feedback:

1. **Reply to comments** with corrections or preferences
2. CodeRabbit remembers and applies to future reviews
3. Learnings are shared across the organization

Example:
> CodeRabbit suggests 4-space indentation
> You reply: "We use 2-space indentation in this project"
> CodeRabbit applies this to all future reviews

## Troubleshooting

### PR Reviews Not Appearing

1. Check CodeRabbit is installed on the repository
2. Verify the PR is not in draft mode (drafts are skipped by default)
3. Check if files match `path_filters` exclusions

### CLI Not Found (WSL)

```bash
# Add to PATH manually
echo 'export PATH="$HOME/.coderabbit/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Authentication Issues

```bash
# Re-authenticate
coderabbit auth logout
coderabbit auth login
```

### Slow Performance on Windows Files

For better performance, clone repos into WSL's Linux filesystem:
```bash
cd ~
git clone https://github.com/your-org/tac-cargo.git
```

## Resources

- [CodeRabbit Documentation](https://docs.coderabbit.ai)
- [Configuration Reference](https://docs.coderabbit.ai/reference/configuration)
- [WSL Setup Guide](https://docs.coderabbit.ai/cli/wsl-windows)
- [YAML Validator](https://coderabbit.ai/integrations/validator)

## Support

- **Discord**: [CodeRabbit Community](https://discord.gg/coderabbit)
- **Email**: support@coderabbit.ai

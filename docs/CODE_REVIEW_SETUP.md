# Code Review Setup Guide

## TAC Cargo - Optimal Code Review Configuration

This document outlines the recommended code review strategy using both **SonarQube/SonarCloud** and **CodeRabbit** for comprehensive coverage.

---

## Tool Comparison

| Feature | SonarQube/SonarCloud | CodeRabbit |
|---------|---------------------|------------|
| **Type** | Static Analysis | AI-Powered Review |
| **Scope** | Code quality, bugs, security | Context-aware suggestions |
| **When** | CI/CD + IDE (real-time) | PR-based |
| **Strengths** | Rules-based, consistent, metrics | Natural language, architectural |
| **Weaknesses** | No context understanding | Can miss edge cases |
| **Cost** | Free tier + paid | Free tier + paid |

---

## Recommended Strategy: **Hybrid Approach**

Use **both tools together** for defense-in-depth:

### Layer 1: SonarQube for IDE (Real-time)
- **Purpose**: Catch issues as you code
- **Catches**: Syntax errors, code smells, security hotspots, bugs
- **Feedback**: Immediate, in-editor

### Layer 2: SonarCloud (CI/CD)
- **Purpose**: Quality gate enforcement
- **Catches**: Code coverage, duplication, maintainability
- **Feedback**: On push/PR

### Layer 3: CodeRabbit (PR Review)
- **Purpose**: AI-powered contextual review
- **Catches**: Logic errors, missing edge cases, architectural issues
- **Feedback**: On PR creation/update

---

## Configuration Files

### 1. SonarCloud (`sonar-project.properties`)

```properties
sonar.projectKey=tacwarp_tac-cargo
sonar.organization=tacwarp
sonar.sources=app,lib,components,hooks
sonar.exclusions=**/node_modules/**,**/.next/**,**/dist/**,**/*.test.ts,**/*.spec.ts
sonar.tests=__tests__,testsprite_tests
sonar.test.inclusions=**/*.test.ts,**/*.spec.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.tsconfigPath=tsconfig.json
```

### 2. CodeRabbit (`.coderabbit.yaml`)

Already configured with:
- Path-specific review instructions
- Security tool integrations (gitleaks, semgrep)
- Auto-review on main/develop branches
- Knowledge base learning enabled

### 3. GitHub Actions Integration

```yaml
# .github/workflows/code-quality.yml
name: Code Quality

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## Quality Gates

### SonarCloud Quality Gate
| Metric | Condition |
|--------|-----------|
| Security Hotspots | 0 new |
| Code Duplication | ≤ 3% on new code |
| Reliability | A rating |
| Maintainability | A rating |
| Coverage | ≥ 80% on new code |

### CodeRabbit Pre-merge Checks
- Enabled via `.coderabbit.yaml`
- Blocks merge on critical issues
- Suggests improvements inline

---

## IDE Setup (SonarLint)

### Connected Mode
1. Install SonarLint extension in VS Code/Windsurf
2. Connect to SonarCloud project
3. Token: Use generated token from SonarCloud
4. Benefits:
   - Same rules as CI/CD
   - Real-time feedback
   - Issue synchronization

### Key Rules to Watch
- `typescript:S7772` - Use `node:` protocol for Node.js imports
- `typescript:S6582` - Use optional chaining (`?.`)
- `typescript:S1066` - Collapsible if statements
- `typescript:S4043` - Array mutation methods

---

## Workflow Summary

```
Developer writes code
        ↓
   [SonarLint/IDE]  ← Real-time feedback
        ↓
   git commit & push
        ↓
   [SonarCloud CI]  ← Quality gate check
        ↓
   Create/Update PR
        ↓
   [CodeRabbit AI]  ← Contextual review
        ↓
   Human review + merge
```

---

## Best Practices

1. **Fix SonarLint issues before commit** - Reduces CI noise
2. **Address CodeRabbit suggestions** - Use `@coderabbitai resolve` when fixed
3. **Don't ignore security hotspots** - Review and mark as safe or fix
4. **Keep duplication < 3%** - Refactor shared logic into utilities
5. **Maintain A ratings** - Address tech debt proactively

---

## Commands Reference

### CodeRabbit PR Commands
```
@coderabbitai review      # Request review
@coderabbitai summary     # Generate summary
@coderabbitai resolve     # Mark issue resolved
@coderabbitai help        # Show all commands
```

### SonarCloud
```bash
# Local analysis (requires sonar-scanner)
npx sonar-scanner
```

---

## Conclusion

The hybrid approach provides:
- **Speed**: SonarLint catches issues instantly
- **Consistency**: SonarCloud enforces standards
- **Intelligence**: CodeRabbit provides contextual insights
- **Coverage**: Multiple perspectives reduce blind spots

Both tools are configured and active on this project.

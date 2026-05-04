# GitHub Actions CI/CD Standards & Best Practices

> **Version:** 1.0.0  
> **Last Updated:** May 2026  
> **Audience:** DevOps Engineers, QA Engineers, Developers

---

## 📋 Table of Contents

1. [Workflow Organization](#workflow-organization)
2. [Naming Conventions](#naming-conventions)
3. [Security Standards](#security-standards)
4. [Performance Optimization](#performance-optimization)
5. [Error Handling & Reliability](#error-handling--reliability)
6. [Testing & Validation](#testing--validation)
7. [Documentation Requirements](#documentation-requirements)
8. [Deployment Standards](#deployment-standards)
9. [Monitoring & Observability](#monitoring--observability)
10. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
11. [Code Review Checklist](#code-review-checklist)

---

## 🗂️ Workflow Organization

### File Structure

```
.github/
├── workflows/
│   ├── ci.yml                    # Main CI pipeline
│   ├── deploy-staging.yml        # Staging deployment
│   ├── deploy-production.yml     # Production deployment
│   ├── pr-checks.yml             # PR validation
│   ├── release.yml               # Release automation
│   ├── scheduled-tests.yml       # Scheduled jobs
│   └── reusable/
│       ├── build.yml             # Reusable build workflow
│       ├── test.yml              # Reusable test workflow
│       └── deploy.yml            # Reusable deploy workflow
├── actions/
│   ├── setup-node-cache/         # Custom composite action
│   │   └── action.yml
│   └── deploy-app/
│       └── action.yml
└── scripts/
    ├── deploy.sh
    └── health-check.sh
```

### ✅ DO: Organize by Purpose

```yaml
# ✅ GOOD - Clear, single-purpose workflows
name: CI Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  build:
    name: Build Application
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
```

### ❌ DON'T: Create Monolithic Workflows

```yaml
# ❌ BAD - Everything in one massive workflow
name: Do Everything
on: [push, pull_request, release, schedule]

jobs:
  everything:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - run: ./deploy.sh
      - run: ./send-notifications.sh
      # ... 50 more steps
```

---

## 🏷️ Naming Conventions

### Workflow Names

```yaml
# ✅ GOOD - Descriptive, action-oriented names
name: Deploy to Production
name: Run E2E Tests
name: Build and Push Docker Image
name: Security Scan

# ❌ BAD - Vague or unclear names
name: Workflow 1
name: Main
name: Do Stuff
```

### Job Names

```yaml
jobs:
  # ✅ GOOD - Clear job names
  build-frontend:
    name: Build Frontend Application

  test-api:
    name: Run API Integration Tests

  deploy-staging:
    name: Deploy to Staging Environment

  # ❌ BAD - Unclear job names
  job1:
    name: Job

  do-stuff:
    name: Stuff
```

### Step Names

```yaml
steps:
  # ✅ GOOD - Descriptive step names
  - name: Install dependencies
  - name: Run unit tests with coverage
  - name: Upload test results to Codecov
  - name: Deploy to AWS S3
  - name: Invalidate CloudFront cache

  # ❌ BAD - Generic or missing step names
  - run: npm ci
  - run: npm test
  - name: Do it
```

### Environment Names

```yaml
# ✅ GOOD - Standard environment names
environment: development
environment: staging
environment: production
environment: qa

# ❌ BAD - Inconsistent or unclear names
environment: prod
environment: stage
environment: env1
```

---

## 🔒 Security Standards

### 1. Minimal Permissions (CRITICAL)

```yaml
# ✅ GOOD - Explicit minimal permissions
permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - run: npm run build

# ❌ BAD - Overly permissive or undefined
permissions: write-all  # NEVER DO THIS

jobs:
  build:
    runs-on: ubuntu-latest
    # No permissions defined - uses defaults
```

### 2. Pin Actions to Full SHA (CRITICAL)

```yaml
# ✅ GOOD - Pinned to full commit SHA
- uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608 # v4.1.0
- uses: actions/setup-node@60edb5dd545a775178f52524783378180af0d1f8 # v4.0.0

# ⚠️ ACCEPTABLE - Pinned to major version (less secure)
- uses: actions/checkout@v4
- uses: actions/setup-node@v4

# ❌ BAD - Unpinned or using branches
- uses: actions/checkout@main
- uses: some-org/action@latest
- uses: third-party/action # No version at all
```

### 3. Secret Management

```yaml
# ✅ GOOD - Secrets in environment variables
- name: Deploy to AWS
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  run: |
    aws s3 sync ./dist s3://my-bucket

# ❌ BAD - Secrets in command line or logs
- name: Deploy
  run: |
    echo "Deploying with key: ${{ secrets.API_KEY }}"  # LOGGED!
    curl -H "Authorization: Bearer ${{ secrets.TOKEN }}" https://api.example.com  # VISIBLE IN LOGS!
```

### 4. Script Injection Prevention

```yaml
# ✅ GOOD - Use environment variables for user input
- name: Comment on PR
  env:
    PR_TITLE: ${{ github.event.pull_request.title }}
    PR_BODY: ${{ github.event.pull_request.body }}
  run: |
    echo "Title: $PR_TITLE"
    echo "Body: $PR_BODY"

# ❌ BAD - Direct interpolation of user input
- name: Comment on PR
  run: |
    echo "Title: ${{ github.event.pull_request.title }}"  # INJECTION RISK!
```

### 5. Use OIDC Instead of Long-Lived Credentials

```yaml
# ✅ GOOD - OIDC authentication
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: us-east-1

# ❌ BAD - Long-lived access keys
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### 6. Environment Protection Rules

```yaml
# ✅ GOOD - Use environment protection for production
jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - run: ./deploy.sh production

# Configure in GitHub Settings:
# - Required reviewers: 2+ approvals
# - Wait timer: 5 minutes
# - Deployment branches: main only
```

---

## ⚡ Performance Optimization

### 1. Caching Dependencies

```yaml
# ✅ GOOD - Use built-in caching
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"

- uses: actions/setup-python@v5
  with:
    python-version: "3.11"
    cache: "pip"

# ✅ GOOD - Manual caching with proper keys
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules
      .next/cache
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-

# ❌ BAD - No caching
- run: npm ci # Downloads everything every time
```

### 2. Concurrency Control

```yaml
# ✅ GOOD - Cancel outdated runs
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# ✅ GOOD - Prevent concurrent deployments
concurrency:
  group: production-deploy
  cancel-in-progress: false
```

### 3. Job Dependencies

```yaml
# ✅ GOOD - Parallel jobs where possible
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    needs: [lint, test]  # Only wait for what's necessary
    runs-on: ubuntu-latest
    steps:
      - run: npm run build

# ❌ BAD - Unnecessary sequential execution
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    needs: lint  # Unnecessary dependency
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### 4. Artifacts Management

```yaml
# ✅ GOOD - Short retention for temporary artifacts
- uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/
    retention-days: 7 # Don't keep forever

# ✅ GOOD - Only upload what's needed
- uses: actions/upload-artifact@v4
  with:
    name: coverage
    path: coverage/
    if-no-files-found: error

# ❌ BAD - Upload everything with long retention
- uses: actions/upload-artifact@v4
  with:
    name: everything
    path: . # Uploads entire workspace!
    retention-days: 90
```

---

## 🛡️ Error Handling & Reliability

### 1. Timeouts

```yaml
# ✅ GOOD - Set reasonable timeouts
jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Run tests
        timeout-minutes: 20
        run: npm test

# ❌ BAD - No timeouts (can hang forever)
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### 2. Conditional Execution

```yaml
# ✅ GOOD - Always upload logs, even on failure
- name: Upload logs
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: logs
    path: logs/

# ✅ GOOD - Notify only on failure
- name: Notify team
  if: failure()
  run: ./notify-failure.sh

# ✅ GOOD - Deploy only on success
- name: Deploy
  if: success() && github.ref == 'refs/heads/main'
  run: ./deploy.sh
```

### 3. Retry Logic

```yaml
# ✅ GOOD - Retry flaky operations
- name: Deploy with retry
  uses: nick-fields/retry-action@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    retry_wait_seconds: 30
    command: ./deploy.sh

# ✅ GOOD - Workflow-level retries
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
    steps:
      - run: npm test
```

### 4. Health Checks

```yaml
# ✅ GOOD - Verify deployment health
- name: Deploy application
  run: ./deploy.sh

- name: Wait for deployment
  run: sleep 30

- name: Health check
  run: |
    for i in {1..10}; do
      if curl -f https://example.com/health; then
        echo "Health check passed"
        exit 0
      fi
      echo "Attempt $i failed, retrying..."
      sleep 10
    done
    echo "Health check failed"
    exit 1

- name: Rollback on failure
  if: failure()
  run: ./rollback.sh
```

---

## 🧪 Testing & Validation

### 1. Test Before Deploy

```yaml
# ✅ GOOD - Comprehensive testing pipeline
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  unit-test:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:unit

  integration-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
    steps:
      - run: npm run test:integration

  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:e2e

  deploy:
    needs: [lint, unit-test, integration-test, e2e-test]
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### 2. Matrix Testing

```yaml
# ✅ GOOD - Test across multiple versions
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [18, 20, 21]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm test
```

### 3. Smoke Tests After Deployment

```yaml
# ✅ GOOD - Verify deployment with smoke tests
- name: Deploy to staging
  run: ./deploy.sh staging

- name: Run smoke tests
  run: |
    npm run smoke-test -- --url=https://staging.example.com

- name: Rollback on smoke test failure
  if: failure()
  run: ./rollback.sh staging
```

---

## 📝 Documentation Requirements

### 1. Workflow Documentation

```yaml
# ✅ GOOD - Well-documented workflow
name: Deploy to Production

# This workflow deploys the application to production after:
# 1. Running all tests
# 2. Building the application
# 3. Getting manual approval
# 4. Deploying to staging first
# 5. Running smoke tests
#
# Triggers:
# - Manual via workflow_dispatch
# - On release publication
#
# Required secrets:
# - AWS_ROLE_ARN: IAM role for deployment
# - SLACK_WEBHOOK_URL: For notifications
#
# Environment protection:
# - Requires 2 approvals
# - 5 minute wait timer

on:
  workflow_dispatch:
    inputs:
      version:
        description: "Version to deploy"
        required: true
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy application
        run: ./deploy.sh
```

### 2. Step Comments

```yaml
# ✅ GOOD - Complex steps have explanations
- name: Configure AWS credentials
  # Use OIDC to assume role instead of long-lived credentials
  # Role must have permissions for S3 and CloudFront
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
    aws-region: us-east-1

- name: Deploy to S3
  # Sync dist folder to S3, deleting removed files
  # --cache-control sets browser caching headers
  run: |
    aws s3 sync ./dist s3://my-bucket \
      --delete \
      --cache-control "public, max-age=31536000, immutable"
```

---

## 🚀 Deployment Standards

### 1. Environment Strategy

```yaml
# ✅ GOOD - Progressive deployment through environments
jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    environment: development
    steps:
      - run: ./deploy.sh dev

  deploy-staging:
    needs: deploy-dev
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - run: ./deploy.sh staging
      - run: npm run smoke-test

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - run: ./deploy.sh production
      - run: npm run smoke-test
```

### 2. Rollback Strategy

```yaml
# ✅ GOOD - Automated rollback on failure
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Get current version
        id: current
        run: |
          CURRENT=$(./get-deployed-version.sh)
          echo "version=$CURRENT" >> $GITHUB_OUTPUT

      - name: Deploy new version
        id: deploy
        run: ./deploy.sh ${{ github.sha }}

      - name: Health check
        id: health
        run: ./health-check.sh

      - name: Rollback on failure
        if: failure() && steps.deploy.outcome == 'success'
        run: |
          echo "Deployment failed, rolling back to ${{ steps.current.outputs.version }}"
          ./deploy.sh ${{ steps.current.outputs.version }}
```

### 3. Deployment Notifications

```yaml
# ✅ GOOD - Notify team of deployment status
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        id: deploy
        run: ./deploy.sh

      - name: Notify success
        if: success()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "✅ Deployment to production succeeded",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Deployment Successful*\n*Version:* ${{ github.sha }}\n*By:* ${{ github.actor }}\n*URL:* https://example.com"
                  }
                }
              ]
            }

      - name: Notify failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "❌ Deployment to production failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Deployment Failed*\n*Version:* ${{ github.sha }}\n*By:* ${{ github.actor }}\n*Logs:* ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
                  }
                }
              ]
            }
```

---

## 📊 Monitoring & Observability

### 1. Workflow Metrics

```yaml
# ✅ GOOD - Track deployment metrics
- name: Record deployment
  run: |
    curl -X POST https://metrics.example.com/deployments \
      -H "Content-Type: application/json" \
      -d '{
        "service": "my-app",
        "version": "${{ github.sha }}",
        "environment": "production",
        "deployed_by": "${{ github.actor }}",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
      }'
```

### 2. Status Badges

```markdown
# ✅ GOOD - Add status badges to README

![CI](https://github.com/org/repo/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/org/repo/actions/workflows/deploy.yml/badge.svg?branch=main)
```

### 3. Workflow Insights

```yaml
# ✅ GOOD - Log important information
- name: Deployment summary
  run: |
    echo "### Deployment Summary" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "- **Environment:** Production" >> $GITHUB_STEP_SUMMARY
    echo "- **Version:** ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
    echo "- **Deployed by:** ${{ github.actor }}" >> $GITHUB_STEP_SUMMARY
    echo "- **URL:** https://example.com" >> $GITHUB_STEP_SUMMARY
```

---

## ⚠️ Anti-Patterns to Avoid

### 1. Hardcoded Values

```yaml
# ❌ BAD - Hardcoded values
- name: Deploy
  run: |
    aws s3 sync ./dist s3://my-production-bucket
    curl https://api.example.com/deploy

# ✅ GOOD - Use variables and secrets
- name: Deploy
  env:
    S3_BUCKET: ${{ vars.S3_BUCKET }}
    API_URL: ${{ vars.API_URL }}
  run: |
    aws s3 sync ./dist s3://$S3_BUCKET
    curl $API_URL/deploy
```

### 2. Ignoring Errors

```yaml
# ❌ BAD - Ignoring errors
- name: Deploy
  run: ./deploy.sh || true # NEVER DO THIS

# ✅ GOOD - Handle errors properly
- name: Deploy
  id: deploy
  run: ./deploy.sh
  continue-on-error: true

- name: Handle deployment failure
  if: steps.deploy.outcome == 'failure'
  run: |
    echo "Deployment failed, investigating..."
    ./collect-logs.sh
    exit 1
```

### 3. Overly Complex Workflows

```yaml
# ❌ BAD - 500 line workflow with complex logic
jobs:
  everything:
    runs-on: ubuntu-latest
    steps:
      # ... 100 steps with nested conditionals

# ✅ GOOD - Break into reusable workflows
jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml

  test:
    uses: ./.github/workflows/reusable-test.yml

  deploy:
    needs: [build, test]
    uses: ./.github/workflows/reusable-deploy.yml
```

### 4. Using Self-Hosted Runners for Public Repos

```yaml
# ❌ BAD - Self-hosted runner on public repo
jobs:
  build:
    runs-on: self-hosted  # SECURITY RISK!

# ✅ GOOD - GitHub-hosted runners for public repos
jobs:
  build:
    runs-on: ubuntu-latest
```

### 5. Not Using Environments for Production

```yaml
# ❌ BAD - Direct production deployment
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy-to-production.sh

# ✅ GOOD - Use environment protection
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - run: ./deploy-to-production.sh
```

---

## ✅ Code Review Checklist

### Security

- [ ] Permissions are minimal (`contents: read` by default)
- [ ] Actions are pinned to full commit SHA
- [ ] No secrets in logs or command line
- [ ] User input is sanitized (use env vars)
- [ ] OIDC is used instead of long-lived credentials
- [ ] Environment protection rules are configured for production
- [ ] No `pull_request_target` unless absolutely necessary

### Performance

- [ ] Dependencies are cached
- [ ] Concurrency control is configured
- [ ] Jobs run in parallel where possible
- [ ] Artifacts have appropriate retention periods
- [ ] Only necessary files are uploaded as artifacts

### Reliability

- [ ] Timeouts are set for jobs and steps
- [ ] Error handling is implemented
- [ ] Health checks verify deployments
- [ ] Rollback strategy is in place
- [ ] Retry logic for flaky operations

### Testing

- [ ] Tests run before deployment
- [ ] Matrix testing for multiple versions/platforms
- [ ] Smoke tests after deployment
- [ ] Test results are uploaded as artifacts

### Documentation

- [ ] Workflow has descriptive name and comments
- [ ] Required secrets are documented
- [ ] Trigger conditions are clear
- [ ] Complex steps have explanations
- [ ] README has status badges

### Deployment

- [ ] Progressive deployment through environments
- [ ] Manual approval for production
- [ ] Deployment notifications configured
- [ ] Metrics/logging implemented
- [ ] Rollback tested and documented

### Code Quality

- [ ] No hardcoded values
- [ ] Reusable workflows for common patterns
- [ ] Consistent naming conventions
- [ ] No overly complex workflows
- [ ] No anti-patterns present

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Awesome Actions](https://github.com/sdras/awesome-actions)
- [GitHub Actions Toolkit](https://github.com/actions/toolkit)

---

## 📝 Version History

| Version | Date     | Changes         |
| ------- | -------- | --------------- |
| 1.0.0   | May 2026 | Initial release |

---

**Maintained by:** DevOps Team  
**Questions?** Open an issue or contact the DevOps team on Slack

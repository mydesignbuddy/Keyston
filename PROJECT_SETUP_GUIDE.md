# GitHub Project Setup Guide

This guide explains how to set up the GitHub Project, Milestones, and Issues for the Keyston MVP.

## Quick Start

### Option 1: Using the Script (Recommended)

Run the automated setup script:

```bash
# 1. Install GitHub CLI if you haven't already
# macOS: brew install gh
# Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
# Windows: https://github.com/cli/cli#windows

# 2. Authenticate with GitHub
gh auth login

# 3. Run the setup script
./setup-github-project.sh
```

This will create:
- 9 Milestones (Sprint 0 through Sprint 7)
- Issues for Sprint 0, Sprint 1, and Sprint 3 (with examples for other sprints)

### Option 2: Manual Setup

Use the `GITHUB_ISSUES.md` file to manually create issues:

1. Go to your repository on GitHub
2. Click "Issues" → "New Issue"
3. Copy the content from `GITHUB_ISSUES.md`
4. Create each issue one by one

### Option 3: Using GitHub CLI Individually

You can create milestones and issues individually using commands from the script:

```bash
# Create a milestone
gh issue milestone create "Sprint 0: Project Setup" \
  --repo "mydesignbuddy/Keyston" \
  --description "Week 1-2: Establish development environment" \
  --due-date "2025-11-24"

# Create an issue
gh issue create \
  --repo "mydesignbuddy/Keyston" \
  --title "[Sprint 0] Initialize Ionic + React project" \
  --body "See GITHUB_ISSUES.md for full content" \
  --milestone "Sprint 0: Project Setup" \
  --label "sprint-0,setup"
```

## Files Created

### 1. `.github/ISSUE_TEMPLATE/`
Issue templates for consistent issue creation:
- `sprint-task.md` - Template for sprint tasks
- `bug-report.md` - Template for bug reports
- `feature-request.md` - Template for feature requests

### 2. `setup-github-project.sh`
Automated script that creates:
- All 9 milestones with due dates
- Sample issues for Sprint 0, Sprint 1, and Sprint 3
- Properly labeled and assigned to milestones

### 3. `GITHUB_ISSUES.md`
Complete reference document with:
- All milestones defined
- Detailed issue descriptions for Sprints 0, 1, and 3
- Templates for creating issues for remaining sprints
- Recommended labels and project board setup

## Project Structure

### Milestones (7 Sprints)

1. **Sprint 0: Project Setup** (Week 1-2) - Foundation
2. **Sprint 0.5: Design & Planning** (Week 3) - Design finalization
3. **Sprint 1: Food Diary Core** (Week 4-5) - Basic food logging
4. **Sprint 2: Food Diary Enhancement** (Week 6) - Trends & goals
5. **Sprint 3: Food Search** (Week 7-8) - Multi-database search
6. **Sprint 4: Barcode Scanner** (Week 9) - Camera integration
7. **Sprint 5: Workout Tracker** (Week 10-11) - Workout logging
8. **Sprint 6: Integration & Testing** (Week 12-13) - QA & optimization
9. **Sprint 7: Polish & Launch** (Week 14) - Final polish & submission

### Issue Labels

Create these labels in your repository:

**Sprint Labels:**
- `sprint-0`, `sprint-1`, `sprint-2`, `sprint-3`, `sprint-4`, `sprint-5`, `sprint-6`, `sprint-7`

**Component Labels:**
- `setup`, `design`, `ui`, `feature`, `data`, `api`, `cache`, `state`, `qa`, `testing`
- `capacitor`, `branding`, `charts`, `privacy`

**Type Labels:**
- `bug`, `enhancement`, `documentation`

## Setting Up GitHub Projects

### Create a Project Board

1. Go to your repository on GitHub
2. Click the "Projects" tab
3. Click "New Project"
4. Choose "Board" layout
5. Name it "Keyston MVP Development"

### Set Up Columns

Create these columns:
- **Backlog** - All issues not yet started
- **Sprint N** - Current sprint issues (e.g., "Sprint 0")
- **In Progress** - Actively being worked on
- **Review** - Awaiting code review or testing
- **Done** - Completed and verified

### Add Issues to Project

1. Click "Add items" in your project
2. Select all issues
3. Drag Sprint 0 issues to "Sprint 0" column
4. Keep others in Backlog

## Timeline

Based on `DEVELOPMENT_ROADMAP.md`:

- **Week 1-2**: Sprint 0 - Project Setup
- **Week 3**: Sprint 0.5 - Design & Planning
- **Week 4-5**: Sprint 1 - Food Diary Core
- **Week 6**: Sprint 2 - Food Diary Enhancement
- **Week 7-8**: Sprint 3 - Food Search
- **Week 9**: Sprint 4 - Barcode Scanner
- **Week 10-11**: Sprint 5 - Workout Tracker
- **Week 12-13**: Sprint 6 - Integration & Testing
- **Week 14**: Sprint 7 - Polish & Launch

## Next Steps

1. ✅ Run the setup script or create issues manually
2. Create GitHub Project board
3. Create all necessary labels
4. Assign team members to issues
5. Start Sprint 0!
6. Update issue status as work progresses
7. Create issues for remaining sprints as needed

## Additional Resources

- **DEVELOPMENT_ROADMAP.md** - Complete sprint breakdown with tasks
- **ARCHITECTURE.md** - Technical architecture details
- **MVP_PROPOSAL.md** - Project overview and timeline
- **FEATURE_SPECIFICATIONS.md** - Detailed feature requirements

## Privacy Reminder

All issues and project planning should respect the privacy-first architecture:
- ✅ No user accounts or authentication
- ✅ All data stored locally in IndexedDB
- ✅ Optional Google Drive backup (user-controlled)
- ✅ No analytics or tracking
- ✅ Zero backend infrastructure

---

**Questions?** Review the `GITHUB_ISSUES.md` file for complete issue descriptions or check `DEVELOPMENT_ROADMAP.md` for task details.

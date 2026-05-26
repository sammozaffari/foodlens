---
name: feature-factory
description: Use when building any new feature. Orchestrates the 7-agent software factory chain with human checkpoints at story approval, brief approval, and PR review.
---

# Feature Factory

Build features through a structured 7-agent chain with human checkpoints.

## The Chain

### Step 1: Research
Run the **Researcher** agent to map the codebase.
"Research the codebase for context needed to build: [feature description]"

### Step 2: User Story → HUMAN CHECKPOINT
Run the **Story Writer** agent with the research report.
Present the user story to Sam for approval.
⏸ **PAUSE: Sam approves the story before proceeding.**

### Step 3: Technical Brief → HUMAN CHECKPOINT
Run the **Spec Writer** agent with the approved story + research report.
Present the technical brief to Sam for approval.
⏸ **PAUSE: Sam approves the brief before proceeding.**

### Step 4: Backend Build
Run the **Backend Builder** agent with the approved brief + research report.
Wait for completion. Collect the summary (files changed, API contract).

### Step 5: Frontend Build
Run the **Frontend Builder** agent with the approved brief + backend summary.
Wait for completion. Collect the summary.

### Step 6: Acceptance Tests
Run the **Test Verifier** agent with the user story + brief + both summaries.
If tests fail → loop back to the appropriate builder.

### Step 7: Validation
Run the **Validator** agent to compare implementation against story + brief.
If critical issues → loop back to the appropriate builder.
If clean → proceed to commit.

### Step 8: Commit → HUMAN CHECKPOINT
Stage changes, create commit, present diff to Sam.
⏸ **PAUSE: Sam reviews and approves the PR.**

## Rules
- Never skip a step
- Never skip a human checkpoint
- If any agent raises an open question, pause and ask Sam
- Log the build process to `docs/build-log/[feature-name].md`

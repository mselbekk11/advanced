# AI Workflow: PRD → Plan → Ralph Loop

How we use Claude Code to go from a feature idea to committed, tested code. There are three stages:

```
write-a-prd  ──►  prd-to-plan  ──►  Ralph loop (or do-work)
 (what & why)     (phases)          (build one phase per commit)
```

Each stage writes a file to `plans/`, and the next stage reads that file. Because the Ralph loop works out what's already done from git history, you can stop at any point and pick up later.

---

## 1. `write-a-prd`: spec the feature

**Skill:** `.claude/skills/write-a-prd/SKILL.md`
**Run it:** in Claude Code, type `/write-a-prd`, or just say "let's write a PRD for …".

What Claude does:

1. Asks you for a long, detailed description of the problem and any solution ideas.
2. Explores the codebase to check your assumptions against the real code.
3. **Interviews you** about every open decision, one branch at a time, until there are no gaps left. Expect lots of questions; that's the point.
4. Writes the PRD to `plans/<prd-name>.md`.

The PRD contains:

- **Problem Statement** and **Solution**, from the user's point of view
- **User Stories**: a long, numbered list ("As a doctor, I want …, so that …")
- **Implementation Decisions**: modules, schema changes, API contracts and so on (no file paths or code, since those go stale)
- **Out of Scope** and **Further Notes**

> Tip: spend your effort here. A vague PRD produces a vague plan, and Ralph will happily build the wrong thing.

---

## 2. `prd-to-plan`: break it into phases

**Skill:** `.claude/skills/prd-to-plan/SKILL.md`
**Run it:** `/prd-to-plan`, pointing it at the PRD file (e.g. "turn `plans/rx-form-v2.md` into a plan").

What Claude does:

1. Reads the PRD and explores the codebase.
2. Pulls out **durable architectural decisions** (routes, schema shape, key models, auth, third-party boundaries) into the plan header so every phase shares them.
3. Splits the work into **tracer-bullet vertical slices**. Each phase is a thin, end-to-end path through every layer (schema → API → UI → tests) that can be demoed on its own. It does *not* split by layer ("do all the DB work, then all the UI").
4. Shows you the list of phases and the user stories each one covers, and asks whether the granularity is right. You iterate until you approve it.
5. Writes the plan to `plans/<feature-name>.md`, with a checklist of acceptance criteria for each phase.

> Tip: prefer many thin phases over a few thick ones. Each Ralph iteration does exactly one task, so smaller phases mean smaller, safer commits.

---

## 3. Building it

You now have a PRD and a plan. There are three ways to implement them.

### Option A: `do-work` (interactive, one phase at a time)

**Skill:** `.claude/skills/do-work/SKILL.md`
**Run it:** `/do-work phase 1 of plans/<feature>.md`

Claude reads the plan, implements the phase, runs `npm run typecheck` and `npm run test` until both pass, then commits. You stay in the conversation and can steer it. Use this when you want to watch closely.

### Option B: `ralph/once.sh` (one Ralph iteration, supervised)

```bash
./ralph/once.sh "plans/<feature>-prd.md plans/<feature>.md"
```

Starts an interactive Claude Code session with the Ralph prompt. File edits are auto-accepted (`--permission-mode acceptEdits`), but other actions, such as running commands, still ask for permission. Good for checking that the loop behaves before you leave it alone.

### Option C: `ralph/afk.sh` (fully autonomous loop)

```bash
./ralph/afk.sh "plans/<feature>-prd.md plans/<feature>.md" 10
```

Runs up to `10` iterations back to back with no supervision ("away from keyboard"). Each iteration runs Claude inside a **Docker sandbox** (`docker sandbox run claude`), so it can run commands without permission prompts and without access to the rest of your machine. Claude's output streams to your terminal as it works.

The loop stops early once Claude reports that every task is finished.

---

## How a Ralph iteration works

Both scripts build the same prompt each time:

```
Previous commits: <last 5 git commits: hash, date, full message>
Plan and PRD:     <the text you passed as the first argument>
<contents of ralph/prompt.md>
```

The first argument is just text. Claude sees the file paths in it and reads the files itself.

`ralph/prompt.md` tells Claude to:

1. **Read** the PRD and plan, and review the recent commits to see what's already done.
2. If nothing is left, reply `<promise>NO MORE TASKS</promise>`. `afk.sh` watches for this exact string and exits.
3. **Explore** the repo.
4. **Implement a single task**, and only one.
5. **Run the feedback loops** before committing:
   - `npm run test` (Vitest)
   - `npm run typecheck` (`tsc --noEmit`)
6. **Commit**, with a message that includes key decisions, files changed, and blockers or notes for the next iteration.

### Why the commit messages matter

Each iteration starts with a fresh context and has **no memory** of earlier runs. The only thing that carries over is git history: the next iteration reads the last 5 commit messages to work out where things stand. That's why the prompt asks for detailed messages with notes for the next iteration. They are Ralph's memory.

### Why the feedback loops matter

The tests and type checker are the only thing stopping an unattended loop from committing broken code. The more real tests the project has, the safer Ralph is. Ask for tests as part of each phase's acceptance criteria.

---

## Project setup (already done)

| Piece | Where |
|---|---|
| Skills | `.claude/skills/write-a-prd`, `prd-to-plan`, `do-work`, `write-a-skill` |
| Ralph scripts | `ralph/once.sh`, `ralph/afk.sh`, `ralph/prompt.md` |
| `npm run typecheck` | `tsc --noEmit` (script in `package.json`) |
| `npm run test` | `vitest run`, configured in `vitest.config.mts` (supports the `@/` alias) |
| Starter test | `lib/utils.test.ts` |

Test files go next to the code they test, named `*.test.ts` / `*.test.tsx`.

### Requirements

- **Run scripts from the repo root.** They read `ralph/prompt.md` using a relative path.
- **Git:** the project must be a git repo. Commit any setup work before starting, since Ralph reads commit history.
- **`once.sh`:** needs the `claude` CLI.
- **`afk.sh`:** also needs `jq` (to stream output and detect completion) and Docker Desktop with Docker Sandboxes. On the first run you'll have to log Claude in inside the sandbox.

### Changing the checks

To add or change what Ralph verifies before each commit, edit the **FEEDBACK LOOPS** section of `ralph/prompt.md` (and step 4 of `do-work/SKILL.md` to match). For example, add `npm run lint`.

---

## Typical session

```bash
# 1. In Claude Code
/write-a-prd          # interview → plans/rx-form-v2-prd.md
/prd-to-plan          # phases    → plans/rx-form-v2.md

# 2. Commit the PRD and plan
git add plans && git commit -m "Add RX form v2 PRD and plan"

# 3. Try one iteration and check the result
./ralph/once.sh "plans/rx-form-v2-prd.md plans/rx-form-v2.md"
git log -1

# 4. Let it run
./ralph/afk.sh "plans/rx-form-v2-prd.md plans/rx-form-v2.md" 10

# 5. Review what it did
git log --stat
```

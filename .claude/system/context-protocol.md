# Context protocol (v1)

A shared contract for how agents create, validate, render, persist, and share context.

## artifact locations
- JSON-first artifacts: write to `.claude/context/artifacts/<artifact>.json`.
- Rendered Markdown: write to `.claude/context/artifacts/<artifact>.md`.
- Reasoning logs (shallow, auditable): `.claude/context/history/reasoning/<workflow>/<step>-<agent>.json`.
- Gate records: `.claude/context/history/gates/<workflow>/<artifact-or-step>.json`.

## validation and rendering
- Validate every artifact against its schema using the gate tool:
  - `node .claude/tools/gates/gate.mjs --schema <schema> --input <json> --gate <gatefile> --autofix 1`
- Only after a pass, render Markdown for humans using the renderer:
  - `node .claude/tools/renderers/bmad-render.mjs <type> <json> > <md>`
- Before a PR, run the sweep:
  - `node .claude/tools/ci/validate-all.mjs`

## session updates
- Orchestrator owns `.claude/context/session.json`.
- Persist `route_decision`, `project.workflow`, and `current_context.current_step`.
- Append generated artifact filenames into `artifacts.generated` and list schemas into `artifacts.schemas_used`.

## naming conventions
- Use kebab-case for filenames; keep consistent artifact names per schema:
  - project-brief.json, prd.json, ux-spec.json, system-architecture.json, test-plan.json, review-notes.json
- Prefer one canonical JSON name per schema; keep legacy aliases only where workflows require.

## directory creation
- Create parent directories before writing; tools already mkdir recursively.

## handoff and escalation
- Handoffs use workflow `depends_on` and `escalate_to`.
- On failure after auto-fix, escalate per workflow and record in gate file.

## context reading
- Agents read previous artifacts from `.claude/context/artifacts/` and do not re-ask for information already present.

## reasoning logs (shallow)
- keys: `assumptions`, `decision_criteria`, `tradeoffs`, `open_questions`, `final_decision`.
- Do not include chain-of-thought in main artifacts.

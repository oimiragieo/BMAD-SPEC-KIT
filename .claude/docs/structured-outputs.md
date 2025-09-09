# Structured Outputs (JSON‑First)

This system produces artifacts as validated JSON first, then renders readable Markdown. This keeps outputs machine‑checkable, deterministic, and easy to diff.

## Requirements
- Node.js 18+ (for local validation and rendering scripts)

## Artifacts & Schemas
- Project Brief: `.claude/schemas/project_brief.schema.json`
- PRD: `.claude/schemas/product_requirements.schema.json`
- System Architecture: `.claude/schemas/system_architecture.schema.json`
- UX Spec: `.claude/schemas/ux_spec.schema.json`
- Test Plan: `.claude/schemas/test_plan.schema.json`
- User Story: `.claude/schemas/user_story.schema.json`
- Epic: `.claude/schemas/epic.schema.json`
- Backlog: `.claude/schemas/backlog.schema.json`
- Review Notes: `.claude/schemas/review_notes.schema.json`
- Enhancement Classification: `.claude/schemas/enhancement_classification.schema.json`

Store raw JSON in `.claude/context/artifacts/` using clear names, e.g.: `project_brief.json`, `prd.json`, `architecture.json`.

## Authoring Pattern (All Agents)
1) Produce JSON that conforms to the relevant schema (no prose).
2) Save to `.claude/context/artifacts/<artifact>.json`.
3) Render Markdown from the JSON for human consumption.

## Render Markdown
Use the built‑in renderer (no dependencies):

```
node .claude/tools/renderers/bmad-render.mjs <type> <path/to/input.json> > output.md

# Examples
node .claude/tools/renderers/bmad-render.mjs project-brief .claude/examples/outputs/project_brief.example.json > PROJECT_BRIEF.md
node .claude/tools/renderers/bmad-render.mjs prd .claude/examples/outputs/product_requirements.example.json > PRD.md
node .claude/tools/renderers/bmad-render.mjs story .claude/examples/outputs/user_story.example.json > US-001.md
node .claude/tools/renderers/bmad-render.mjs epic .claude/examples/outputs/epic.example.json > EPIC.md
node .claude/tools/renderers/bmad-render.mjs backlog .claude/examples/outputs/backlog.example.json > BACKLOG.md
```

## Validation
The renderer validates inputs against the schema (required fields, types, enums). CI should treat validation errors as failures. For more, see `.claude/orchestrator/validation-protocol.md`.

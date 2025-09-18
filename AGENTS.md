# Repository Guidelines

## Project Structure & Module Organization
The orchestrator logic lives in `.claude/`, with agent playbooks under `.claude/agents/`, reusable tasks in `.claude/tasks/`, and workflow automation scripts inside `.claude/tools/`. Runtime artifacts and validation history are kept in `.claude/context/`; keep generated JSON there so the CI validators can discover them. Reference material for contributors sits in `docs/` (see `docs/README.md` for navigation), while GitHub Actions and shared issue templates reside in `.github/`.

## Build, Test, and Development Commands
Run `node .claude/tools/ci/validate-all.mjs` before every commit; it sweeps all artifacts against the schemas and mirrors the `Validate Artifacts` workflow. Use `node .claude/tools/gates/gate.mjs --schema <schema> --input <artifact> --gate <gate>` when touching a specific gate, e.g., `node .claude/tools/gates/gate.mjs --schema .claude/schemas/product_requirements.schema.json --input .claude/context/artifacts/prd.json --gate .claude/context/history/gates/greenfield-fullstack/02-pm.json --autofix 1`. Render human-readable reports with `node .claude/tools/renderers/bmad-render.mjs <type> <json> > <md>`.

## Coding Style & Naming Conventions
Match existing kebab-case directory names (`bmad-orchestrator`, `system-architecture`), and keep filenames lowercase with hyphens. YAML in `config.yaml` uses two-space indentation; mirror that in any new configuration. JSON artifacts must remain minified-friendly, double-quoted, and schema-compliant. Markdown documents favor sentence-case headings and descriptive bullet lists—ensure long lists stay scannable.

## Testing Guidelines
Treat schema validation as the test suite: every artifact change requires a green run of `validate-all.mjs`. Store new fixtures under `.claude/context/artifacts/` and schemas in `.claude/schemas/`; name tests after the schema they exercise (e.g., `ux_spec.schema.json`). When introducing a schema, add at least one representative artifact and, if behavior differs by workflow, capture each route in `.claude/context/history/gates/`.

## Commit & Pull Request Guidelines
Commits follow lightweight Conventional Commits (`feat:`, `Build:`, `documentation updates`); keep the first line under 72 characters and prefer imperative verbs (“Add”, “Update”). For pull requests, include a concise change summary, validation evidence (paste the `validate-all.mjs` output), and links to relevant issues or workflow runs. Screenshots or rendered Markdown are required when modifying artifact renderers or documentation meant for stakeholders.

## Security & Configuration Tips
Never commit API keys or tenant-specific data; redact sensitive context before placing files in `.claude/context/`. Configuration defaults live in `.claude/config.yaml`; extend them via environment variables or layered YAML files rather than hardcoding values. When sharing examples, use anonymized project names and neutral sample data to keep the enterprise presets reusable.

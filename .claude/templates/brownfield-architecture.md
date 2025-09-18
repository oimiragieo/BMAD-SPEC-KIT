# Brownfield integration architecture template

Use this for enhancing existing systems. Emphasize safety, compatibility, and controlled rollout.

## current state analysis
- existing architecture summary and key hotspots
- tech stack versions, ownership, SLAs, compliance obligations

## enhancement scope & impact
- functional changes, affected domains, and non-functional deltas
- blast radius analysis (components, data, integrations)

## compatibility strategy
- API contracts (breaking vs non-breaking), versioning plan
- schema migrations (expand-migrate-contract-shrink pattern)
- feature toggles and gradual enablement

## target architecture deltas
- new/changed components (responsibilities, tech)
- updated data model and migration plan

## integration plan
- dependency graph and sequencing
- rollback strategy and safe-guard rails (canary, shadow traffic)

## deployment & release plan
- environments, pipelines, approvals
- incremental rollout, monitoring gates, rollback triggers

## security & compliance
- risk assessment, new threat surfaces, mitigations
- data handling changes and audit requirements

## performance & observability
- expected load/latency changes and capacity plan
- dashboards, alerts, and success criteria for rollout

## test strategy (risk-based)
- regression scope, contract tests, migration tests
- performance, accessibility, and security checks

## risks & mitigations
- prioritized list with owners and timelines


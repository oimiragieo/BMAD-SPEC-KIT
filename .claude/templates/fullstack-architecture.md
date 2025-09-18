# Full-stack architecture template

Use this template to produce the System Architecture JSON and the human-readable Markdown for new applications. Keep language specific, measurable, and actionable. Reference the PRD and UX spec.

## context
- problem statement and business context (1–3 sentences)
- scope assumptions and explicit non-goals
- constraints (tech, compliance, budget, timeline)

## architecture decisions (ADRs)
- ADR-001: <decision> — rationale, alternatives considered, status
- ADR-002: <decision> — rationale, alternatives considered, status

## system overview
- high-level diagram (Mermaid recommended)
- major boundaries: frontend, backend, data, integrations
- data flow narrative (request → process → persist → respond)

## components
- <component name> (technology): responsibilities, key interfaces
- <component name> (technology): responsibilities, key interfaces

## data model
- entities with attributes and relationships (cardinality, ownership)
- migration/seed strategy and multi-env data handling

## api design
- protocol(s): REST/GraphQL/eventing; versioning and error contract
- key endpoints/operations, idempotency and pagination patterns

## integration
- external systems, protocol, direction, authentication, rate limits
- retry, backoff, and circuit-breaking strategy

## deployment
- target environment(s): dev/stage/prod
- packaging (Docker images), orchestration (Kubernetes/Compose), CI/CD
- config and secrets management; rollout and rollback strategy

## security
- threats (STRIDE) and controls (OWASP ASVS alignment)
- authN/authZ model, secrets storage, audit logging

## performance
- targets (P95 latency, throughput, error rate)
- caching layers and capacity planning notes

## observability
- logging, metrics, traces; dashboards and alerts
- SLOs and error budgets

## reliability & recovery
- redundancy, health checks, graceful degradation
- backup/restore and disaster recovery objectives

## risks & mitigations
- top risks with impact/likelihood and mitigation plan

## implementation guidance
- code structure conventions; DX and lint/test gates
- phased delivery plan and tech debt notes


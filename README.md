# Insurance Agentic Layer

An enterprise insurance agentic layer that acts as a single-window intelligent channel across core insurance functions, including underwriting, claims, distribution, sales, actuarial, policy servicing, compliance, and operations.

The goal of this repository is to provide a reusable foundation for orchestrating AI agents, tools, workflows, and enterprise system access across the insurance value chain.

## Current Prototype

This repo now includes a lightweight browser shell for accessing multiple insurance systems from one window. The experience includes:

- A chat-style command panel.
- Natural-language routing, such as `take me to the underwriting system`.
- A system shortcut dock for direct navigation.
- An embedded workspace that loads the configured endpoint for each system.
- Animated layout movement when switching from one system to another.
- `.env` endpoint configuration for each enterprise system.

## Run Locally

This prototype uses Node.js only and does not require package installation.

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## System Endpoints

Configure enterprise system endpoints in `.env`:

```text
UNDERWRITING_SYSTEM_ENDPOINT=/systems/underwriting
CLAIMS_SYSTEM_ENDPOINT=/systems/claims
DISTRIBUTION_SYSTEM_ENDPOINT=/systems/distribution
SALES_SYSTEM_ENDPOINT=/systems/sales
ACTUARIAL_SYSTEM_ENDPOINT=/systems/actuarial
POLICY_SERVICING_SYSTEM_ENDPOINT=/systems/policy-servicing
COMPLIANCE_SYSTEM_ENDPOINT=/systems/compliance
OPERATIONS_SYSTEM_ENDPOINT=/systems/operations
```

The checked-in `.env` uses local demo endpoints so the portal works immediately. Replace those values with real enterprise system URLs when integrating with production systems. Some third-party or enterprise applications may block iframe embedding through browser security headers; those systems will need embedding enabled or a supported integration approach.

## Vision

Insurance organizations rely on many specialized systems, teams, and decision processes. This agentic layer is intended to sit above those systems as a coordinated interface that can:

- Route user requests to the right domain capability.
- Coordinate workflows across multiple insurance functions.
- Connect to core systems, data services, documents, and operational tools.
- Support human-in-the-loop review for regulated or high-impact decisions.
- Provide consistent governance, observability, and auditability for agent activity.

## Core Business Domains

The layer is designed to support channels into major insurance functions:

- **Underwriting**: risk intake, submission triage, appetite checks, quote preparation, evidence gathering, and decision support.
- **Claims**: first notice of loss, coverage checks, claim summarization, damage assessment support, reserve recommendations, and adjuster assistance.
- **Distribution**: broker and agent enablement, submission support, partner communications, and channel performance insights.
- **Sales**: lead qualification, customer needs analysis, product recommendations, proposal support, and pipeline workflows.
- **Actuarial**: experience analysis, pricing support, portfolio monitoring, loss trend review, and model-assisted research.
- **Policy Servicing**: endorsements, renewals, cancellations, billing questions, document retrieval, and customer service assistance.
- **Compliance and Risk**: policy checks, audit trails, regulatory review support, and controlled escalation paths.

## Conceptual Architecture

```text
Users and Channels
        |
        v
Agentic Orchestration Layer
        |
        +-- Domain Agents
        |     +-- Underwriting Agent
        |     +-- Claims Agent
        |     +-- Distribution Agent
        |     +-- Sales Agent
        |     +-- Actuarial Agent
        |     +-- Servicing Agent
        |
        +-- Shared Capabilities
        |     +-- Tool registry
        |     +-- Workflow orchestration
        |     +-- Retrieval and knowledge access
        |     +-- Human review and approvals
        |     +-- Guardrails and policy enforcement
        |     +-- Monitoring, audit, and telemetry
        |
        v
Enterprise Systems
        |
        +-- Policy administration
        +-- Claims management
        +-- CRM and distribution platforms
        +-- Rating and pricing engines
        +-- Data warehouses and actuarial models
        +-- Document management systems
```

## Design Principles

- **Enterprise ready**: built for security, auditability, observability, and controlled integration with core systems.
- **Domain aware**: each insurance function can have specialized agents, prompts, tools, workflows, and approval rules.
- **Human supervised**: high-impact actions should support review, approval, escalation, and clear accountability.
- **Composable**: tools and workflows should be reusable across domains where appropriate.
- **Extensible**: new lines of business, products, functions, and systems should be easy to add without rewriting the platform.

## Example Use Cases

- Triage a commercial underwriting submission and route it to the correct underwriting team.
- Summarize claim notes, policy coverage, loss details, and next recommended actions.
- Assist a broker with submission requirements and appetite guidance.
- Generate a sales proposal using customer context, product fit, and eligibility rules.
- Help actuarial teams investigate portfolio trends and summarize drivers.
- Coordinate renewal workflows across servicing, underwriting, and distribution.

## Suggested Project Structure

```text
.
+-- public/          # Single-window browser shell
+-- server.js        # Local server and endpoint configuration adapter
+-- agents/          # Domain-specific agent definitions
+-- workflows/       # Cross-functional workflow orchestration
+-- tools/           # Tool adapters for internal and external systems
+-- knowledge/       # Retrieval, document, and knowledge-base components
+-- guardrails/      # Policy, compliance, validation, and review controls
+-- integrations/    # Enterprise system connectors
+-- telemetry/       # Logging, audit, metrics, and tracing
+-- tests/           # Unit, integration, and workflow tests
```

## Getting Started

Implementation details will depend on the selected runtime, model provider, orchestration framework, and enterprise integration targets. A typical next step is to define:

1. The first supported insurance domain, such as underwriting or claims.
2. The initial user channel, such as an API, web app, internal assistant, or broker portal.
3. The core system integrations required for that domain.
4. The governance rules for approvals, audit logs, and human escalation.
5. The first end-to-end workflow to implement and test.

## Contributing

When adding functionality, prefer small, domain-focused modules with clear contracts between agents, tools, workflows, and integrations. For regulated workflows, include tests or documentation that explain approval requirements, system actions, and audit behavior.

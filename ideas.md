# SPX CaseFlow — Design Direction

## Three Initial Directions

### Theme Name: Enterprise Editorial Operations
Very Brief Intro: A high-clarity internal operations console that combines editorial restraint, logistics signals, and dense but breathable data surfaces. It should feel like a mission-control tool already used by a mature operations team.
Probability: 0.07

### Theme Name: Dispatch Ledger
Very Brief Intro: A more utilitarian direction built around ledger lines, compact labels, and visual language borrowed from dispatch rooms and control books. It emphasizes traceability and auditability over expressive decoration.
Probability: 0.03

### Theme Name: Signal Room
Very Brief Intro: A higher-contrast operations environment where risk, aging, and escalation states become a visual signal system. It uses more dark surfaces and alert colors, but keeps the product grounded in workflow clarity.
Probability: 0.05

## Chosen Direction: Enterprise Editorial Operations

### Design Movement
A contemporary enterprise editorial aesthetic: the discipline of Swiss information design softened with logistics-control-room cues and a warm, paper-like workspace. The result is structured, practical, and deliberately more human than a generic admin template.

### Core Principles
1. **Clareza operacional antes de ornamentação.** Every visual treatment must help the user locate a ticket, understand its risk, or choose the next action.
2. **Densidade com respiro.** Data tables can be rich, but their surrounding hierarchy, spacing, and restrained borders must prevent visual fatigue.
3. **Fluxo visível.** The product should constantly communicate where a case is in its lifecycle: received, analyzed, escalated, returned, validated, resolved.
4. **Sinais com significado.** Orange-red is reserved for the SPX flow and critical action moments; green, yellow, and red communicate operational state consistently.

### Color Philosophy
The foundation is warm white and pale stone, chosen to keep long work sessions calm and preserve strong contrast for dense tables. Charcoal replaces pure black for body text and navigation hierarchy, giving the interface a softer editorial tone. The ownable brand color is **SPX Ember**, a vivid orange-red that represents movement through the caseflow rather than generic “danger.” Green represents a verified outcome, yellow an unresolved dependency or approaching SLA, and red a confirmed critical risk. Color is never used alone: labels, icons, and text accompany every state.

### Layout Paradigm
A persistent left rail anchors the application while the main workspace uses an asymmetric editorial composition: a compact title block, a wide operational pulse panel, a secondary rail for attention items, and dense full-width data sections below. Details open in a slide-over or modal context so the user never loses the queue. The page should feel like a workbench rather than a centered marketing grid.

### Signature Elements
1. **Caseflow signal line:** a thin connected path with checkpoint nodes, echoed in KPI accents, timelines, and section dividers.
2. **Attention rail:** a warm-tinted vertical block that surfaces the few tickets that need immediate action without turning the whole dashboard into an alert wall.
3. **Operational stamp labels:** compact uppercase micro-labels such as `SLA`, `RISK SCORE`, `OWNER`, and `REGIONAL SCOPE` that make scanning faster.

### Interaction Philosophy
Interactions should feel like advancing a case, not opening a generic application menu. Hover states expose context, KPI cards invite drill-down, ticket rows are clearly clickable, and role switching updates scope visibly. Mutating actions use explicit confirmation and immediately append a timeline event so the prototype teaches the intended workflow.

### Animation
Use short, purposeful transitions: 160–220ms ease-out for hover and control feedback, 240–320ms for drawers and modals, and 40–60ms staggered entrances for grouped dashboard sections. Charts can reveal through opacity and a small translateY, but no layout dimensions should animate. Timeline nodes may fade in sequentially on ticket detail open. Respect `prefers-reduced-motion` and remove non-essential motion when enabled.

### Typography System
Use **Manrope** for interface copy and **Space Grotesk** for display headings, metrics, and compact operational stamps. Headings are strong but not oversized; the application title uses a tight 1.05 line-height, section titles 1.2, and body copy 1.45. Numeric KPIs use tabular figures, medium-to-bold weight, and enough letter spacing to read as instruments.

### Brand Essence
SPX CaseFlow is the internal ticket treatment command center for Tickets FM, operations, and leadership teams that need to move from issue intake to validated resolution with traceability. Personality: **precise, alert, dependable**.

### Brand Voice
Headlines are direct and operational. CTAs describe the next step, not a vague benefit. Microcopy is short, specific, and acknowledges the user’s working context.

Example line 1: **“A fila está estável. Estes 3 casos quebram o padrão.”**

Example line 2: **“Validar retorno e encerrar o ciclo.”**

### Wordmark & Logo
The symbol is a compact case shape intersected by a forward-moving flow path, suggesting a ticket moving through controlled handoffs. The wordmark should be rendered in a custom-feeling lockup: `SPX` in Space Grotesk ExtraBold with tight tracking and `CaseFlow` in Manrope SemiBold, separated by a small Ember signal bar. Never use the brand name as an unstyled default wordmark.

### Signature Brand Color
**SPX Ember — #F05A3C.** It is warmer and more operational than a standard corporate red, making it ownable as the visual shorthand for case movement, escalation, and the next decisive action.

## Implementation Reminder
Every edited CSS, component, and page file must begin with a brief comment referencing this direction. Keep the following invariant in mind during implementation: *Does this choice reinforce or dilute Enterprise Editorial Operations?*

Generated assets are reserved under the project lifecycle and should be used directly from these URLs:

- `/manus-storage/spx-caseflow-mark_5924dbc5.png`
- `/manus-storage/spx-caseflow-analytics-texture_1085f697.png`
- `/manus-storage/spx-caseflow-route-map_8041965e.png`
- `/manus-storage/spx-caseflow-signal_557caf58.png`

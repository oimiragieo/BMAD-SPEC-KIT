# Advanced Elicitation Task

## Purpose

Provide optional reflective and brainstorming actions to enhance content quality through structured elicitation techniques. Enable deeper exploration of ideas and iterative refinement through multiple analytical perspectives.

## Usage Scenarios

### Scenario 1: Template Document Creation

After outputting a section during document creation:

1. **Section Review**: Ask user to review the drafted section
2. **Offer Elicitation**: Present 9 carefully selected elicitation methods
3. **Simple Selection**: User types a number (0-8) to engage method, or 9 to proceed
4. **Execute & Loop**: Apply selected method, then re-offer choices until user proceeds

### Scenario 2: General Chat Elicitation

User can request advanced elicitation on any agent output:
- User says "do advanced elicitation" or similar
- Agent selects 9 relevant methods for the context
- Same simple 0-9 selection process

## Task Instructions

### 1. Intelligent Method Selection

**Context Analysis**: Before presenting options, analyze:
- **Content Type**: Technical specs, user stories, architecture, requirements, etc.
- **Complexity Level**: Simple, moderate, or complex content
- **Stakeholder Needs**: Who will use this information
- **Risk Level**: High-impact decisions vs routine items
- **Creative Potential**: Opportunities for innovation or alternatives

**Method Selection Strategy**:

1. **Always Include Core Methods** (choose 3-4):
   - Expand or Contract for Audience
   - Critique and Refine
   - Identify Potential Risks
   - Assess Alignment with Goals

2. **Add Context-Specific Methods** (choose 3-4):
   - **For Technical Content**: Tree of Thoughts, Challenge from Critical Perspective
   - **For Requirements**: Stakeholder Round Table, Hindsight Analysis
   - **For Creative Work**: Meta-Analysis, Emergent Collaboration
   - **For Planning**: Agile Team Perspective, Self-Consistency Validation

3. **Include Reasoning Methods** (choose 1-2):
   - Explain Reasoning (Chain of Thought)
   - Analyze Logical Flow and Dependencies

### 2. Present Elicitation Menu

**Format Example**:
```
Here are 9 elicitation methods to enhance this content:

0. Expand or Contract for Audience
1. Critique and Refine from [Role] Perspective
2. Identify Potential Risks and Issues
3. Tree of Thoughts Deep Dive
4. Stakeholder Round Table Analysis
5. Challenge from Critical Perspective
6. Assess Alignment with Overall Goals
7. Explain Reasoning (Chain of Thought)
8. Hindsight Analysis: "If Only..." Reflection

9. Proceed without further elicitation

Please select a number (0-8) to apply that method, or 9 to continue.
```

### 3. Execute Selected Method

When user selects a method:
1. **Apply Method**: Execute the elicitation technique thoroughly
2. **Provide Enhanced Content**: Show improved or analyzed version
3. **Re-offer Menu**: Present the same 9 options again for continued refinement
4. **Continue Loop**: Until user selects "9. Proceed"

### 4. Method Implementation Guidelines

**Expand or Contract for Audience (0)**:
- Ask about target audience: executives, developers, users, compliance
- Adjust technical depth and terminology accordingly
- Ensure appropriate level of detail for decision-making needs

**Critique and Refine (1)**:
- Review from specific role's expertise (PM, Architect, Developer, QA, UX)
- Identify weaknesses and improvement opportunities
- Suggest refined version with domain knowledge

**Identify Potential Risks (2)**:
- Brainstorm risks from multiple perspectives
- Consider technical, business, security, and operational risks
- Highlight implementation challenges and edge cases

**Tree of Thoughts (3)**:
- Break problem into discrete reasoning steps
- Explore multiple solution paths simultaneously
- Evaluate and compare different approaches

**Stakeholder Round Table (4)**:
- Present perspectives from different stakeholders
- Identify conflicts and synergies between viewpoints
- Synthesize into actionable recommendations

**Challenge from Critical Perspective (5)**:
- Play devil's advocate against current approach
- Argue weaknesses and potential failures
- Apply YAGNI principles for scope trimming

**Assess Alignment with Goals (6)**:
- Evaluate contribution to stated objectives
- Identify misalignments or gaps
- Suggest adjustments for better goal achievement

**Explain Reasoning (7)**:
- Walk through step-by-step thinking process
- Reveal assumptions and decision points
- Make reasoning transparent and reviewable

**Hindsight Analysis (8)**:
- Imagine future retrospective scenario
- Identify critical "if only we had..." insights
- Extract actionable learnings for current context

### 5. Quality Guidelines

**Method Relevance**: Select methods that genuinely add value to the content
**Clear Communication**: Explain what each method will do in plain language
**Practical Application**: Focus on actionable improvements and insights
**User Control**: Always let user decide when to stop the elicitation process

### 6. Integration with Agents

**Analyst Agent**: Focus on stakeholder perspectives, risk identification, alignment assessment
**PM Agent**: Emphasize business value, user impact, priority clarification methods
**Architect Agent**: Technical risk analysis, alternative exploration, system thinking methods
**Developer Agent**: Implementation critique, dependency analysis, practical feasibility methods
**UX Expert Agent**: User perspective analysis, journey thinking, accessibility considerations
**QA Agent**: Risk identification, scenario exploration, validation and testing methods

## Success Criteria

- User finds the elicitation methods genuinely helpful for improving content
- Methods lead to concrete improvements and actionable insights
- Process is efficient and doesn't feel like unnecessary overhead
- Different methods provide distinctly different perspectives and value
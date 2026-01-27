---
description: Create a deep dive research document for a protocol
argument-hint: protocol-name
---

# Deep Dive Research Command

Create a comprehensive deep dive document for: **$ARGUMENTS**

## Instructions

1. **Check radar list**: Look in `00-radar/radar-list.docx` to see if this protocol exists and note its current category and details.

2. **Research the protocol**: Use web search to gather current, accurate data on:
   - What the protocol does and how it works
   - Market data (TAM, competitors, market share)
   - Technical architecture and competitive advantages
   - Traction metrics (TVL, volume, revenue, users)
   - Tokenomics (utility, supply, distribution, vesting, value accrual)
   - Team backgrounds and investors
   - Risks (technical, regulatory, competitive, tokenomics)
   - Upcoming catalysts and timeline

3. **Generate the deep dive document**: Create a .docx file at `01-shortlist/[category]/[protocol].docx` using the template structure from `_templates/shortlist-deep-dive-template.docx`. Use the `docx` npm package.

4. **Remove from radar**: If the protocol was on the radar list, remove it from `00-radar/radar-list.docx`.

5. **Report back**: Summarize key findings and confirm the file location.

## Important Guidelines

- Provide **data and facts only** — no investment opinions or recommendations
- Include sources for all data points
- Use clean formatting: Arial font, black text, white background, clear tables
- If you cannot find reliable data for a section, note it as "[Data not available - requires manual research]"
- Ask clarifying questions if the protocol name is ambiguous

# Nomad Research Vault

This is Spencer's personal crypto research system for Nomad Research.

## What This Is

A structured research pipeline with four stages:
- **00-radar/** — Protocols/narratives to investigate (quick capture)
- **01-shortlist/** — Passed initial scan, worth deeper research
- **02-active/** — Live research and published investment theses
- **03-archive/** — Passed on or closed positions

## Templates (in _templates/)

- **quick-scan.md** — 15-20 min initial assessment
- **deep-dive.md** — 1-2 hour thorough analysis
- **investment-thesis.md** — Full publishable report

---

## IMPORTANT: Division of Labor by Stage

### Quick Scan & Deep Dive (Radar & Shortlist)
Claude writes EVERYTHING—full analysis, gut checks, opinions, recommendations. Be thorough and opinionated. These are Spencer's internal working documents to help him decide what's worth pursuing. He wants your full take here.

### Investment Thesis (Active)
This is Spencer's PUBLIC content for Nomad Research. Different rules:

**Claude's Job:**
- Pull metrics: TVL, price, market cap, FDV, token stats
- Summarize whitepapers, docs, and team backgrounds
- Research competitive landscape
- Identify risks, catalysts, key dates
- Create file structure and formatting
- Clean up Spencer's drafts for grammar/clarity

**Spencer's Job (he writes these himself):**
- Executive summary
- "Why now" narrative
- Investment rationale
- Bull/bear/base case analysis
- Conviction level and sizing
- Risk commentary (his take, not just a list)
- Conclusion and recommendation

**Rule: For investment theses, Claude provides the ingredients. Spencer cooks the meal.**

---

## How to Help

**Quick scan request:**
1. Copy `_templates/quick-scan.md` to `00-radar/[protocol-name].md`
2. Use web search to populate ALL sections—stats, analysis, gut check, everything
3. Be opinionated. Give Spencer your full take.

**Deep dive request:**
1. Copy `_templates/deep-dive.md` to `01-shortlist/[protocol-name].md`
2. Research and fill in ALL sections thoroughly—including analysis and recommendations
3. Be thorough and opinionated. This helps Spencer decide if it's thesis-worthy.

**Investment thesis request:**
1. Copy `_templates/investment-thesis.md` to `02-active/[protocol-name].md`
2. Populate all DATA sections (metrics, tokenomics, team, competition, risks)
3. For OPINION sections, write: `<!-- SPENCER: [brief prompt about what to address here] -->`
4. Spencer will write those sections himself—this is his public content

**Moving between stages:**
- When Spencer says "move [protocol] to shortlist/active/archive"
- Create the new file in the destination folder using the appropriate template
- **DELETE the old file** from the previous folder
- One file per protocol, always in its current stage

**Formatting for publishing:**
- Twitter thread: Concise, punchy, numbered posts
- Discord post: More detail, markdown formatting
- Only format content Spencer has written—don't generate new opinions

---

## Spencer's Focus

- All crypto sectors (DeFi, L1s, infrastructure, AI x crypto, etc.)
- Mix of conviction holds and asymmetric bets
- Early-stage narratives + established protocols that keep building
- Building content for Nomad Research community and X audience

---

## Key Commands

- "Quick scan [protocol]" → Create new scan from template
- "Move [protocol] to shortlist" → Relocate file, upgrade to deep-dive
- "Move [protocol] to active" → Create full thesis scaffold
- "Format this for Twitter" → Convert thesis to thread
- "What's in my radar?" → Review current pipeline
- "Tighten this section" → Edit Spencer's writing for clarity

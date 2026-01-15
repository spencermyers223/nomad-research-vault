# Nomad Research Vault

Personal research system for crypto investment research.

---

## Folder Structure

```
nomad-research-vault/
├── 00-radar/          # Protocols you've heard about, need quick scan
├── 01-shortlist/      # Passed initial scan, worth deep dive
├── 02-active/         # Currently researching or have live thesis
├── 03-archive/        # Passed on or closed positions
└── _templates/        # Templates for each research stage
```

---

## Workflow

### 1. Capture → Radar
When you hear about something interesting (Twitter, podcast, Discord):
- Add it to `00-radar/_radar-log.md`
- Include source and why it caught your attention

### 2. Quick Scan (15-20 min)
Weekly, review your radar log and pick 2-3 to scan:
- Tell Claude: "Quick scan on [Protocol]"
- Claude creates the file and pulls in baseline data
- You review and make the call: Shortlist, Pass, or Wait

### 3. Deep Dive (1-2 hours)
For shortlisted protocols:
- Tell Claude: "Move [Protocol] to shortlist"
- Claude upgrades to deep-dive template with expanded data
- You add your analysis and notes throughout
- Decision: Build thesis, Hold, or Archive

### 4. Investment Thesis
For conviction positions:
- Tell Claude: "Move [Protocol] to active"
- Claude populates data sections and creates scaffolding
- **You write all opinion and thesis sections** (see below)
- This becomes your Nomad Research content

### 5. Archive
Protocols you've passed on or positions you've closed:
- Move to `03-archive/` with a note on why

---

## Division of Labor by Stage

### Quick Scan & Deep Dive (Radar & Shortlist)
Claude writes everything—full analysis, opinions, gut checks. These are internal working documents to help you decide what's worth pursuing. Claude should be thorough and opinionated here.

### Investment Thesis (Active)
This is your public-facing content. Different rules apply:

**Claude handles:**
- Pulling metrics: TVL, price, market cap, token stats
- Summarizing docs, whitepapers, team backgrounds
- Competitive landscape research
- Structuring outlines and formatting
- Identifying risks, catalysts, and key dates

**Spencer writes:**
- Executive summary and core thesis
- "Why now" narrative and investment rationale
- Bull/bear/base case scenarios
- Conviction level and position sizing
- Risk assessment commentary (your take, not just a list)
- Final recommendation and conclusion

**Rule: For investment theses, Claude provides the ingredients. Spencer cooks the meal.**

---

## Using Claude Code

In this directory, you can ask Claude to:

- **Start a scan:** "Quick scan on [Protocol]"
- **Pull data:** "Get current TVL and token stats for [Protocol]"
- **Summarize docs:** "Read [URL] and summarize the tokenomics"
- **Move stages:** "Move [Protocol] to shortlist/active/archive"
- **Review pipeline:** "What's in my radar?" or "Show me my shortlist"
- **Format for publishing:** "Turn this thesis into a Twitter thread"
- **Edit your writing:** "Tighten this section" or "Check this for clarity"

---

## Weekly Review Checklist

- [ ] Review radar log — anything to scan?
- [ ] Check shortlist — any catalysts hit?
- [ ] Update active positions — metrics still on track?
- [ ] Capture new protocols from the week


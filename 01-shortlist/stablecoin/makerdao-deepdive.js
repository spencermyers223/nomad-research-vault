const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } = require("docx");
const fs = require("fs");

// Helper functions
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: 300, after: 100 }, children: [new TextRun({ text, bold: true })] });
}
function para(text) {
  return new Paragraph({ spacing: { after: 100 }, children: [new TextRun(text)] });
}
function boldPara(text) {
  return new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text, bold: true })] });
}
function separator() {
  return new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun("═══════════════════════════════════════════════════════════════════")] });
}
function thinSep() {
  return new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun("───────────────────────────────────────────────────────────────────")] });
}
function bulletPoint(text) {
  return new Paragraph({ spacing: { after: 50 }, children: [new TextRun(`• ${text}`)] });
}

function makeTable(headers, rows) {
  const noBorder = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
  const borders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
  const allRows = [headers, ...rows].map((row, ri) =>
    new TableRow({
      children: row.map(cell =>
        new TableCell({
          borders,
          width: { size: 3000, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: cell, bold: ri === 0 })] })]
        })
      )
    })
  );
  return new Table({ rows: allRows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

// MakerDAO Protocol Data
const p = {
  name: "MakerDAO",
  ticker: "$MKR",
  chain: "Ethereum",
  category: "Stablecoin / CDP Lending",
  
  summary: "MakerDAO is the decentralized autonomous organization behind DAI, the largest decentralized stablecoin with ~$5B supply. The protocol pioneered collateralized debt positions (CDPs) where users lock crypto assets to mint DAI. MKR token holders govern risk parameters and serve as the backstop — MKR is diluted to cover bad debt. The protocol has expanded into Real World Assets (RWAs), with $2B+ in US Treasuries and corporate bonds as collateral, generating significant yield.",

  whatIsIt: "MakerDAO operates a collateralized debt position (CDP) system, branded as 'Vaults.' Users deposit crypto collateral (ETH, WBTC, stETH, USDC, RWAs) and can mint DAI stablecoins against it at a minimum 150% collateralization ratio. The system maintains DAI's $1 peg through several mechanisms:\n\n1. Overcollateralization: All DAI is backed by >150% collateral value\n2. Stability Fees: Variable interest rates on borrowed DAI (currently 5-15% depending on vault type)\n3. DAI Savings Rate (DSR): Yield on deposited DAI to manage supply/demand (currently ~5%)\n4. Liquidations: Automated auctions when collateral falls below threshold\n5. Emergency Shutdown: Ultimate backstop allowing DAI holders to redeem collateral\n\nThe protocol is governed by MKR holders who vote on risk parameters, collateral types, fee rates, and protocol upgrades.",

  market: "Total Stablecoin Market: ~$150B (dominated by USDT $95B, USDC $32B)\nDecentralized Stablecoin Market: ~$8B (DAI leads with $5B, 60%+ share)\nDeFi Lending TVL: ~$50B across all protocols\nMakerDAO Market Share: 28% of DeFi lending TVL (second only to Lido in total DeFi TVL)\n\nKey Competitors:\n- Liquity (LUSD): $400M supply, 0% interest, ETH-only collateral\n- Frax (FRAX): $700M supply, partially algorithmic\n- Aave GHO: $100M supply, newer entrant\n- Ethena (USDe): $2B supply, delta-neutral synthetic (different model)\n\nMakerDAO maintains dominance through first-mover advantage, deepest liquidity, widest DeFi integrations, and institutional-grade RWA exposure.",

  howItWorks: "Core Mechanism (Vault System):\n1. User deposits collateral into a Vault (e.g., 10 ETH worth $25,000)\n2. User can mint DAI up to the collateral's borrowing limit (e.g., $15,000 DAI at 150% ratio)\n3. User pays Stability Fee (interest) on outstanding DAI debt\n4. To close vault, user repays DAI + accumulated fees and withdraws collateral\n5. If collateral value drops below liquidation ratio, vault is auctioned\n\nOracle System:\n- Chainlink + MakerDAO's own oracles provide price feeds\n- 1-hour delay on price changes for liquidation (prevents flash crash exploits)\n- Oracle Security Module (OSM) adds additional safety buffer\n\nLiquidation Process:\n- Liquidation ratio varies by collateral (typically 145-175%)\n- Dutch auction system for liquidated collateral\n- 13% liquidation penalty goes to protocol surplus\n- Keepers (bots) compete to trigger liquidations\n\nDAI Stability Mechanisms:\n- DAI > $1: Lower DSR, raise stability fees → reduce DAI demand/increase supply\n- DAI < $1: Raise DSR, lower stability fees → increase DAI demand/reduce supply\n- Peg Stability Module (PSM): Direct 1:1 swap with USDC (controversial but effective)",

  competitiveAdvantage: "1. First Mover & Battle-Tested: Launched 2017, survived multiple market crashes (March 2020 'Black Thursday,' 2022 bear market). No exploits of core protocol.\n\n2. Network Effects: DAI is the most integrated stablecoin in DeFi. Used as base pair on Uniswap, Curve, Aave, Compound. Deep liquidity = low slippage.\n\n3. Decentralization: No admin keys, no off-switch. More decentralized than USDC/USDT (centralized issuers) and algorithmic stables (single points of failure).\n\n4. RWA Innovation: Pioneered bringing US Treasuries on-chain. $2B+ in RWAs generating 4-5% yield, passed to DAI holders via DSR.\n\n5. Institutional Grade: BlockTower, Monetalis, Huntingdon Valley Bank have formal RWA arrangements. Regulatory clarity (not a security per SEC guidance).\n\n6. Governance Legitimacy: Active governance with 50+ MKR holders regularly voting. Delegate system for passive holders. Transparent on-chain execution.",

  metricsRows: [
    ["TVL", "$5.8B", "#2 in DeFi behind Lido ($20B)"],
    ["DAI Supply", "~$5B", "Largest decentralized stablecoin"],
    ["Annual Revenue", "$150M+", "From stability fees + RWA yield"],
    ["Protocol Surplus", "$80M+", "Treasury buffer before MKR burns"],
    ["RWA Collateral", "$2.1B", "US Treasuries, corporate bonds"],
    ["Vault Count", "~15,000", "Active debt positions"],
    ["Market Share", "28%", "Of DeFi lending TVL"],
    ["DSR Deposits", "$1.2B", "DAI earning savings rate"],
  ],

  tokenUtility: "MKR serves three functions:\n\n1. Governance: Vote on all protocol parameters including:\n   - Collateral types and risk parameters\n   - Stability fees and DSR rates\n   - Protocol upgrades and treasury allocation\n   - RWA partner approvals\n\n2. Backstop (Lender of Last Resort): If liquidations don't cover bad debt, new MKR is minted and auctioned to cover the shortfall. This dilutes MKR holders, aligning incentives with proper risk management.\n\n3. Value Accrual: Protocol surplus is used to buy back and burn MKR. This creates deflationary pressure when the protocol is profitable. Over $50M in MKR has been burned historically.",

  distributionRows: [
    ["Initial Distribution (2017)", "1,000,000 MKR", "Sold to early backers"],
    ["Burned (Cumulative)", "~22,000 MKR", "From surplus auctions"],
    ["Foundation/DAO", "~84,000 MKR", "Treasury holdings"],
    ["Current Supply", "~977,000 MKR", "Deflationary"],
  ],

  circulating: "~900,000 MKR (fully unlocked, no vesting)",
  maxSupply: "No hard cap (can mint for debt auctions), but deflationary in normal operations",
  inflationRate: "Net deflationary when protocol is profitable",
  upcomingUnlocks: "None — MKR was fully distributed in 2017",

  valueAccrual: "Revenue flows:\n1. Stability Fees from Vaults → Protocol Surplus\n2. RWA Yield → Protocol Surplus (or DSR distribution)\n3. Liquidation Penalties → Protocol Surplus\n\nOnce surplus exceeds buffer target ($50M), excess is used to buy and burn MKR via Surplus Auctions. In 2024-2025, strong RWA yields have accelerated burns. Current burn rate: ~5,000 MKR/year at current revenue levels.\n\nSky/Endgame Transition: MKR can be converted to SKY at 1:24,000 ratio. Some governance moving to SKY tokens, but MKR remains valid and continues burning.",

  team: "MakerDAO Foundation (dissolved 2021): Originally led by Rune Christensen (founder, still active in governance).\n\nCurrent Structure: Fully decentralized, operated through Core Units (teams funded by governance):\n- Protocol Engineering: Smart contract development\n- Risk: Collateral onboarding and risk assessment\n- Oracles: Price feed infrastructure\n- Growth: Business development, RWA partnerships\n\nKey Contributors: Recognized delegates and domain experts guide governance but no single team controls the protocol.",

  investors: "Original Backers (2017): Andreessen Horowitz (a16z), Polychain Capital, 1confirmation, Distributed Capital Partners.\n\nNo recent raises — MakerDAO is fully bootstrapped via protocol revenue. The $80M+ surplus buffer acts as treasury. RWA partners (BlockTower, Monetalis) are counterparties, not investors.",

  community: "- Twitter: @MakerDAO — 280K followers\n- Discord: ~25,000 members\n- Governance Forum: forum.makerdao.com — 500+ active posters\n- Governance Participation: ~50 MKR holders vote regularly, ~$100M in delegated MKR\n\nDeveloper Activity: Core protocol is stable (minimal changes needed). Focus shifted to SubDAOs (Spark for lending), RWA integration, and Layer 2 expansion.",

  risks: [
    { name: "Regulatory Risk", level: "MEDIUM", desc: "Stablecoins face increasing regulatory scrutiny. However, DAI's decentralized nature provides some protection compared to USDC/USDT. RWA arrangements with US banks suggest growing regulatory acceptance. EU MiCA regulations may require compliance adjustments." },
    { name: "Smart Contract Risk", level: "LOW", desc: "Core contracts are 6+ years old and heavily audited. No major exploits. However, new modules (RWA adapters, PSM) expand attack surface. $5B+ TVL makes it a constant target." },
    { name: "Collateral Risk", level: "MEDIUM", desc: "Heavy reliance on USDC in PSM creates centralization risk — Circle could blacklist MakerDAO. RWAs introduce counterparty risk (what if BlockTower fails?). Protocol has reduced USDC exposure but still significant." },
    { name: "Competition Risk", level: "MEDIUM", desc: "Ethena's USDe grew to $2B in months with higher yields. Aave GHO gaining traction. If competitor stablecoin achieves better DeFi integrations or higher yield sustainably, DAI could lose market share." },
    { name: "Governance Risk", level: "LOW", desc: "Governance is slow and contentious at times. Sky/Endgame transition has divided community. However, this deliberation also prevents rash decisions. No single entity can override governance." },
  ],

  catalystRows: [
    ["DSR Yield Increases", "Q1-Q2 2026", "Higher DSR attracts more DAI deposits, bullish for ecosystem"],
    ["Layer 2 Expansion", "2026", "Native DAI on Arbitrum, Optimism, Base increases utility"],
    ["RWA Growth", "Ongoing", "More TradFi yield → higher protocol revenue → more MKR burns"],
    ["Sky/Endgame Completion", "2026-2027", "SubDAO launches, new tokenomics clarity"],
    ["ETF Approval Spillover", "2026", "Institutional interest in DeFi blue chips like MKR"],
  ],

  sources: [
    "MakerDAO Official Docs: makerdao.com/docs",
    "MakerDAO Governance Forum: forum.makerdao.com",
    "DefiLlama TVL Data: defillama.com/protocol/makerdao",
    "Dune Analytics Dashboards: dune.com/browse/dashboards?q=makerdao",
    "MakerBurn Stats: makerburn.com",
    "Token Terminal Revenue: tokenterminal.com/terminal/projects/makerdao",
    "RWA Monitor: rwa.makerdao.com",
  ],
};

// Build document
const date = new Date().toISOString().split('T')[0];
const sections = [
  heading("NOMAD RESEARCH — DEEP DIVE"),
  para(`Protocol: ${p.name}`),
  para(`Ticker: ${p.ticker}`),
  para(`Chain: ${p.chain}`),
  para(`Category: ${p.category}`),
  para(`Date: ${date}`),
  para("Status: Protocol of the Day"),

  separator(), heading("EXECUTIVE SUMMARY", HeadingLevel.HEADING_2), thinSep(),
  para(p.summary),

  separator(), heading("THE OPPORTUNITY", HeadingLevel.HEADING_2), thinSep(),
  boldPara(`What is ${p.name}?`),
  para(p.whatIsIt),
  boldPara("The Market"),
  para(p.market),

  separator(), heading("THE PROTOCOL", HeadingLevel.HEADING_2), thinSep(),
  boldPara("How It Works"),
  para(p.howItWorks),
  boldPara("Competitive Advantage"),
  para(p.competitiveAdvantage),
  boldPara("Traction & Metrics"),
  makeTable(["Metric", "Value", "Context"], p.metricsRows),

  separator(), heading("TOKENOMICS", HeadingLevel.HEADING_2), thinSep(),
  boldPara("Token Utility"),
  para(p.tokenUtility),
  boldPara("Supply & Distribution"),
  makeTable(["Category", "Allocation", "Vesting"], p.distributionRows),
  para(`Current circulating: ${p.circulating}`),
  para(`Max supply: ${p.maxSupply}`),
  para(`Inflation rate: ${p.inflationRate}`),
  para(`Upcoming unlocks: ${p.upcomingUnlocks}`),
  boldPara("Value Accrual"),
  para(p.valueAccrual),

  separator(), heading("TEAM & BACKERS", HeadingLevel.HEADING_2), thinSep(),
  boldPara("Team"),
  para(p.team),
  boldPara("Investors"),
  para(p.investors),
  boldPara("Community & Governance"),
  para(p.community),

  separator(), heading("RISKS", HeadingLevel.HEADING_2), thinSep(),
  ...p.risks.flatMap(r => [boldPara(`${r.name} (${r.level})`), para(r.desc)]),

  separator(), heading("CATALYSTS & TIMELINE", HeadingLevel.HEADING_2), thinSep(),
  makeTable(["Catalyst", "Expected", "Impact"], p.catalystRows),

  separator(), heading("SOURCES", HeadingLevel.HEADING_2), thinSep(),
  ...p.sources.map(s => bulletPoint(s)),
];

const doc = new Document({ sections: [{ children: sections }] });

// Save .docx
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(__dirname + '/makerdao.docx', buffer);
  console.log('Created makerdao.docx');
});

// Also generate text version for Notion
let text = `NOMAD RESEARCH — DEEP DIVE

Protocol: ${p.name}
Ticker: ${p.ticker}
Chain: ${p.chain}
Category: ${p.category}
Date: ${date}
Status: Protocol of the Day

═══════════════════════════════════════
EXECUTIVE SUMMARY
───────────────────────────────────────
${p.summary}

═══════════════════════════════════════
THE OPPORTUNITY
───────────────────────────────────────
What is ${p.name}?
${p.whatIsIt}

The Market
${p.market}

═══════════════════════════════════════
THE PROTOCOL
───────────────────────────────────────
How It Works
${p.howItWorks}

Competitive Advantage
${p.competitiveAdvantage}

Traction & Metrics
${p.metricsRows.map(r => `  ${r[0]}: ${r[1]} — ${r[2]}`).join('\n')}

═══════════════════════════════════════
TOKENOMICS
───────────────────────────────────────
Token Utility
${p.tokenUtility}

Supply & Distribution
${p.distributionRows.map(r => `  ${r[0]}: ${r[1]} — ${r[2]}`).join('\n')}

Current circulating: ${p.circulating}
Max supply: ${p.maxSupply}
Inflation rate: ${p.inflationRate}
Upcoming unlocks: ${p.upcomingUnlocks}

Value Accrual
${p.valueAccrual}

═══════════════════════════════════════
TEAM & BACKERS
───────────────────────────────────────
Team
${p.team}

Investors
${p.investors}

Community & Governance
${p.community}

═══════════════════════════════════════
RISKS
───────────────────────────────────────
${p.risks.map(r => `${r.name} (${r.level})\n${r.desc}`).join('\n\n')}

═══════════════════════════════════════
CATALYSTS & TIMELINE
───────────────────────────────────────
${p.catalystRows.map(r => `  ${r[0]} | ${r[1]} | ${r[2]}`).join('\n')}

═══════════════════════════════════════
SOURCES
───────────────────────────────────────
${p.sources.map(s => `• ${s}`).join('\n')}
`;

fs.writeFileSync(__dirname + '/makerdao.txt', text);
console.log('Created makerdao.txt for Notion paste');

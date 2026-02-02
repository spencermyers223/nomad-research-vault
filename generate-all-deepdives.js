const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } = require("docx");
const fs = require("fs");
const path = require("path");

// Helper to create styled paragraphs
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

function riskSection(name, level, desc) {
  return [boldPara(`${name} (${level})`), para(desc)];
}

function buildDoc(p) {
  const date = "2026-01-27";
  const sections = [
    // Header
    heading("NOMAD RESEARCH — DEEP DIVE"),
    para(`Protocol: ${p.name}`),
    para(`Ticker: ${p.ticker}`),
    para(`Chain: ${p.chain}`),
    para(`Category: ${p.category}`),
    para(`Date: ${date}`),
    para("Status: Shortlist"),

    // Executive Summary
    separator(), heading("EXECUTIVE SUMMARY", HeadingLevel.HEADING_2), thinSep(),
    para(p.summary),

    // The Opportunity
    separator(), heading("THE OPPORTUNITY", HeadingLevel.HEADING_2), thinSep(),
    boldPara(`What is ${p.name}?`),
    para(p.whatIsIt),
    boldPara("The Market"),
    para(p.market),

    // The Protocol
    separator(), heading("THE PROTOCOL", HeadingLevel.HEADING_2), thinSep(),
    boldPara("How It Works"),
    para(p.howItWorks),
    boldPara("Competitive Advantage"),
    para(p.competitiveAdvantage),
    boldPara("Traction & Metrics"),
    makeTable(["Metric", "Value", "Context"], p.metricsRows),

    // Tokenomics
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

    // Team & Backers
    separator(), heading("TEAM & BACKERS", HeadingLevel.HEADING_2), thinSep(),
    boldPara("Team"),
    para(p.team),
    boldPara("Investors"),
    para(p.investors),
    boldPara("Community & Governance"),
    para(p.community),

    // Risks
    separator(), heading("RISKS", HeadingLevel.HEADING_2), thinSep(),
    ...p.risks.flatMap(r => riskSection(r.name, r.level, r.desc)),

    // Catalysts
    separator(), heading("CATALYSTS & TIMELINE", HeadingLevel.HEADING_2), thinSep(),
    makeTable(["Catalyst", "Expected", "Impact"], p.catalystRows),

    // Sources
    separator(), heading("SOURCES", HeadingLevel.HEADING_2), thinSep(),
    ...p.sources.map(s => bulletPoint(s)),
  ];

  return new Document({ sections: [{ children: sections }] });
}

function buildText(p) {
  const date = "2026-01-27";
  let t = "";
  t += "NOMAD RESEARCH — DEEP DIVE\n\n";
  t += `Protocol: ${p.name}\nTicker: ${p.ticker}\nChain: ${p.chain}\nCategory: ${p.category}\nDate: ${date}\nStatus: Shortlist\n\n`;
  t += "═══════════════════════════════════════\nEXECUTIVE SUMMARY\n───────────────────────────────────────\n";
  t += p.summary + "\n\n";
  t += "═══════════════════════════════════════\nTHE OPPORTUNITY\n───────────────────────────────────────\n";
  t += `What is ${p.name}?\n${p.whatIsIt}\n\nThe Market\n${p.market}\n\n`;
  t += "═══════════════════════════════════════\nTHE PROTOCOL\n───────────────────────────────────────\n";
  t += `How It Works\n${p.howItWorks}\n\nCompetitive Advantage\n${p.competitiveAdvantage}\n\nTraction & Metrics\n`;
  p.metricsRows.forEach(r => { t += `  ${r[0]}: ${r[1]} (${r[2]})\n`; });
  t += "\n═══════════════════════════════════════\nTOKENOMICS\n───────────────────────────────────────\n";
  t += `Token Utility\n${p.tokenUtility}\n\nSupply & Distribution\n`;
  p.distributionRows.forEach(r => { t += `  ${r[0]}: ${r[1]} — ${r[2]}\n`; });
  t += `\nCirculating: ${p.circulating}\nMax Supply: ${p.maxSupply}\nInflation: ${p.inflationRate}\nUpcoming Unlocks: ${p.upcomingUnlocks}\n\nValue Accrual\n${p.valueAccrual}\n\n`;
  t += "═══════════════════════════════════════\nTEAM & BACKERS\n───────────────────────────────────────\n";
  t += `Team\n${p.team}\n\nInvestors\n${p.investors}\n\nCommunity & Governance\n${p.community}\n\n`;
  t += "═══════════════════════════════════════\nRISKS\n───────────────────────────────────────\n";
  p.risks.forEach(r => { t += `${r.name} (${r.level})\n${r.desc}\n\n`; });
  t += "═══════════════════════════════════════\nCATALYSTS & TIMELINE\n───────────────────────────────────────\n";
  p.catalystRows.forEach(r => { t += `  ${r[0]} | ${r[1]} | ${r[2]}\n`; });
  t += "\n═══════════════════════════════════════\nSOURCES\n───────────────────────────────────────\n";
  p.sources.forEach(s => { t += `• ${s}\n`; });
  return t;
}

// ═══════════════════════════════════════════════════════════════
// PROTOCOL DATA
// ═══════════════════════════════════════════════════════════════

const protocols = [
  {
    name: "Ethereum",
    ticker: "$ETH",
    chain: "Ethereum",
    category: "Layer-1",
    folder: "layer-1",
    filename: "ethereum",
    summary: "Ethereum is the world's largest smart contract platform by market capitalization, total value locked, and developer activity. Launched in 2015, it pioneered programmable blockchains and hosts the majority of decentralized finance (DeFi), NFT, and tokenization activity. Following its transition to Proof of Stake in September 2022 ('The Merge'), Ethereum operates as an energy-efficient validator-secured network with a deflationary supply mechanism via EIP-1559 fee burning.",
    whatIsIt: "Ethereum is a decentralized, open-source blockchain platform that enables developers to build and deploy smart contracts and decentralized applications (dApps). It functions as a programmable 'world computer' where code executes deterministically across thousands of nodes without a central authority. The Ethereum Virtual Machine (EVM) serves as the execution environment, processing transactions and running smart contracts written primarily in Solidity. The platform supports a vast ecosystem of financial protocols (Aave, Uniswap, MakerDAO), NFT marketplaces (OpenSea, Blur), layer-2 scaling solutions (Arbitrum, Optimism, Base), and real-world asset tokenization platforms.",
    market: "The smart contract platform market is valued at over $500 billion in aggregate market cap. Ethereum dominates with roughly 55-60% of total DeFi TVL across all chains. Key competitors include Solana (high throughput, low fees), Avalanche (subnet architecture), and various L2s that technically extend Ethereum's capacity. The broader DeFi market has grown from ~$1B TVL in early 2020 to over $100B by late 2025. Ethereum's L2 ecosystem (Arbitrum, Optimism, Base, zkSync, Starknet) collectively processes more transactions than Ethereum mainnet, extending its economic reach.",
    howItWorks: "Ethereum uses Proof of Stake consensus where validators stake 32 ETH to participate in block production and attestation. The Beacon Chain coordinates validators, with blocks proposed every 12 seconds in slots grouped into 32-slot epochs. The EVM executes smart contracts in a sandboxed environment, with gas fees denominating computational costs. EIP-1559 (London upgrade, August 2021) introduced a base fee that is burned and a priority tip paid to validators, creating deflationary tokenomics when network usage is high. Layer-2 rollups (optimistic and zero-knowledge) batch transactions off-chain and post proofs/data to Ethereum mainnet for security. Ethereum's roadmap includes proto-danksharding (EIP-4844, implemented March 2024) which dramatically reduced L2 data costs via 'blob' transactions, and future full danksharding for further scalability.",
    competitiveAdvantage: "Ethereum has the strongest network effects in crypto: largest developer community (4,000+ monthly active developers per Electric Capital reports), most DeFi TVL ($60B+), most extensive tooling ecosystem (Hardhat, Foundry, OpenZeppelin), deepest liquidity, most L2 rollups building on its security, and the most institutional adoption (spot ETH ETFs approved in 2024, enterprise adoption via EEA). The EVM standard has become the de facto smart contract runtime, adopted by dozens of competing chains. Ethereum's credible neutrality and progressive decentralization (no single foundation or VC controls it) are additional moats.",
    metricsRows: [
      ["Market Cap", "~$352B", "Rank #2 behind Bitcoin (CoinGecko, Jan 2026)"],
      ["TVL (DeFi)", "~$60B+", "Largest DeFi ecosystem across all chains (DefiLlama)"],
      ["Daily Active Addresses", "~400K-500K mainnet", "Millions more on L2s"],
      ["Revenue (Annualized)", "~$2-4B", "From gas fees; varies with network activity"],
      ["Staked ETH", "~34M ETH (~28%)", "Via 1M+ validators"],
      ["L2 TVL", "~$40B+", "Arbitrum, Optimism, Base lead"],
    ],
    tokenUtility: "ETH serves as: (1) Gas — required to pay for all transactions and smart contract executions on mainnet; (2) Staking — validators must stake 32 ETH (or use liquid staking protocols like Lido) to secure the network, earning ~3-4% APR; (3) Collateral — widely used as collateral in DeFi lending protocols; (4) Store of Value — institutional adoption via ETFs; (5) Fee Burn — EIP-1559 burns the base fee portion of every transaction, reducing supply.",
    distributionRows: [
      ["ICO (2014)", "~60M ETH", "No vesting; distributed at launch"],
      ["Ethereum Foundation", "~12M ETH initial", "Spent over years on development"],
      ["Mining rewards (2015-2022)", "~58M ETH issued", "No longer active post-Merge"],
      ["Staking rewards (2022+)", "~3-4% annual issuance", "Ongoing; partially offset by burns"],
    ],
    circulating: "~120.5M ETH",
    maxSupply: "No hard cap; net supply change depends on burn rate vs issuance (~0.5-1% net inflation or deflation depending on activity)",
    inflationRate: "~0.5-1% gross issuance; net can be deflationary during high activity",
    upcomingUnlocks: "No scheduled unlocks; ETH staking withdrawals enabled since Shanghai upgrade (April 2023)",
    valueAccrual: "ETH accrues value through: (1) EIP-1559 burn mechanism — during high activity periods, more ETH is burned than issued, making ETH deflationary; (2) Staking yield — validators earn protocol rewards + priority fees + MEV; (3) Monetary premium — ETH serves as the primary collateral and gas asset across the largest DeFi ecosystem; (4) L2 settlement fees — rollups pay ETH for data availability and settlement on mainnet.",
    team: "Founded by Vitalik Buterin (public figure, active researcher/thought leader), Gavin Wood (left to create Polkadot), Joseph Lubin (founded ConsenSys), Charles Hoskinson (left to create Cardano), and others. The Ethereum Foundation, led by Executive Director Aya Miyaguchi, coordinates core development but does not control the protocol. Core development is distributed across multiple independent teams: Geth (Go), Prysm, Lighthouse, Teku, Nethermind, Erigon, and others. All key contributors are doxxed.",
    investors: "Original 2014 ICO raised ~$18M from public crowdsale. No traditional VC rounds for the protocol itself. Major institutional holders include Grayscale Ethereum Trust, BlackRock's iShares Ethereum Trust (ETHA), Fidelity, and other spot ETH ETF issuers (approved July 2024). The Ethereum ecosystem has attracted billions in VC funding across L2s, DeFi protocols, and infrastructure.",
    community: "Largest blockchain developer community globally. Reddit r/ethereum: 2M+ members. @ethereum Twitter: 3.5M+ followers. Thousands of active governance participants via EIPs (Ethereum Improvement Proposals). EthGlobal hackathons regularly attract thousands of builders. DevConnect and Devcon conferences are premier industry events.",
    risks: [
      { name: "L2 Fragmentation", level: "MEDIUM", desc: "The proliferation of L2 rollups could fragment liquidity and user experience, potentially reducing mainnet fee revenue and the ETH burn rate. Cross-L2 interoperability remains an unsolved challenge." },
      { name: "Regulatory Risk", level: "MEDIUM", desc: "Despite spot ETF approval in the US, ETH's regulatory classification remains debated. The SEC has not formally declared ETH a commodity. Staking services face potential securities classification risks." },
      { name: "Competition from Alt-L1s", level: "LOW", desc: "Solana, Sui, and other high-performance L1s offer better UX for certain use cases (payments, gaming, consumer apps). Ethereum's mainnet remains expensive for small transactions, though L2s mitigate this." },
      { name: "Centralization Concerns", level: "MEDIUM", desc: "Lido controls ~28-30% of staked ETH. Block building is concentrated among a few MEV-boost relays. Client diversity has improved but Geth still runs ~60%+ of execution clients." },
    ],
    catalystRows: [
      ["Pectra Upgrade", "Q1-Q2 2026", "Account abstraction (EIP-7702), validator consolidation, improved staking"],
      ["Full Danksharding", "2026-2027", "Massive L2 data cost reduction, enabling sub-cent L2 transactions at scale"],
      ["Spot ETH ETF Staking", "TBD", "If approved, could add staking yields to ETF products, increasing institutional demand"],
      ["RWA Tokenization Growth", "Ongoing", "BlackRock, Franklin Templeton, and others increasingly tokenizing assets on Ethereum"],
      ["Verkle Trees", "2026-2027", "Stateless clients, reduced node requirements, improved decentralization"],
    ],
    sources: [
      "CoinGecko API — Market data (accessed Jan 2026)",
      "ethereum.org — Protocol documentation and roadmap",
      "DefiLlama — TVL data",
      "Electric Capital Developer Report — Developer metrics",
      "EIP-1559 specification (ethereum.org)",
      "Ethereum Foundation Blog — Upgrade announcements",
      "ultrasound.money — ETH supply and burn tracking",
    ],
  },

  {
    name: "Solana",
    ticker: "$SOL",
    chain: "Solana",
    category: "Layer-1",
    folder: "layer-1",
    filename: "solana",
    summary: "Solana is a high-performance Layer 1 blockchain designed for mass adoption, processing thousands of transactions per second with sub-second finality at costs below one cent. Founded by Anatoly Yakovenko in 2017, Solana has become the leading alternative L1 to Ethereum, particularly strong in consumer applications, DeFi, and memecoin trading. The network uses a unique Proof of History (PoH) mechanism combined with Proof of Stake.",
    whatIsIt: "Solana is a monolithic Layer 1 blockchain that prioritizes speed, low cost, and scalability without relying on sharding or layer-2 solutions. It maintains a single global state, avoiding the liquidity fragmentation that plagues multi-chain or multi-shard architectures. The platform supports smart contracts (called 'programs') written in Rust, C, and C++, executing on the Sealevel runtime which enables parallel transaction processing. Solana hosts a wide range of applications including DeFi (Raydium, Jupiter, Marinade), NFTs (Magic Eden, Tensor), DePIN (Helium, Render), payments (Visa USDC settlement), and consumer apps (Dialect, Phantom wallet).",
    market: "Solana competes in the ~$500B+ smart contract platform market. It has established itself as the #2 DeFi ecosystem behind Ethereum, with ~$8-10B TVL. The network processes more daily transactions than Ethereum mainnet (often 30-50M+ per day vs Ethereum's ~1M). Solana dominates retail and memecoin trading volume. Key competitors include Ethereum (and its L2s), Sui, Aptos, and Avalanche. Spot Solana ETFs have been filed and are anticipated for 2025-2026 approval.",
    howItWorks: "Solana's architecture combines eight key innovations: (1) Proof of History (PoH) — a cryptographic clock that timestamps transactions before consensus, eliminating the need for validators to agree on time; (2) Tower BFT — a PoH-optimized version of PBFT consensus; (3) Turbine — block propagation protocol inspired by BitTorrent; (4) Gulf Stream — mempool-less transaction forwarding to the next leader; (5) Sealevel — parallel smart contract runtime across GPU cores; (6) Pipelining — transaction processing pipeline for hardware optimization; (7) Cloudbreak — horizontally-scaled accounts database; (8) Archivers — distributed ledger storage. Block time is ~400ms with ~4,000 TPS throughput in practice, theoretically scaling to 65,000+ TPS.",
    competitiveAdvantage: "Solana's primary advantages are: (1) Speed and cost — sub-second finality and <$0.01 transaction fees make it viable for high-frequency use cases (trading, payments, gaming); (2) Single-state composability — unlike Ethereum's L2 fragmentation, all Solana apps share one state and can compose atomically; (3) Firedancer — Jump Crypto's independent validator client written in C, targeting 1M+ TPS, providing client diversity and massive performance upgrade; (4) Ecosystem growth — Jupiter aggregator, Phantom wallet, and pump.fun have driven massive user adoption; (5) Institutional adoption — Visa USDC settlement, PayPal PYUSD, Stripe integration, and spot ETF filings.",
    metricsRows: [
      ["Market Cap", "~$60B", "Rank #7 (CoinGecko, Jan 2026)"],
      ["Price", "~$123.69", "ATH: $293.31 (Nov 2024)"],
      ["TVL (DeFi)", "~$8-10B", "2nd largest DeFi ecosystem (DefiLlama)"],
      ["Daily Transactions", "~30-50M+", "Includes vote transactions; non-vote ~5-15M"],
      ["Daily Active Addresses", "~1-2M+", "Rapidly growing user base"],
      ["Staked SOL", "~65-70% of supply", "High staking participation rate"],
    ],
    tokenUtility: "SOL serves as: (1) Gas — required for all transaction fees on the network (typically <$0.01); (2) Staking — delegators stake SOL to validators to secure the network, earning ~6-7% APR; (3) Governance — SOL holders can participate in governance proposals; (4) Rent — accounts must maintain a minimum SOL balance for storage rent; (5) Priority fees — users can pay additional SOL for transaction priority during congestion.",
    distributionRows: [
      ["Seed Sale", "16.23%", "Locked until 2021; fully unlocked"],
      ["Founding Sale", "12.92%", "Locked until 2021; fully unlocked"],
      ["Validator Sale", "5.18%", "Fully unlocked"],
      ["Strategic Sale", "1.88%", "Fully unlocked"],
      ["CoinList Auction", "1.64%", "Fully unlocked"],
      ["Team/Foundation", "~25%", "Subject to vesting; mostly unlocked"],
      ["Community/Ecosystem", "~38%", "Foundation grants and ecosystem fund"],
    ],
    circulating: "~490M SOL",
    maxSupply: "No hard cap; inflationary with decreasing rate",
    inflationRate: "Started at 8%, decreasing 15% annually, targeting long-term rate of 1.5%",
    upcomingUnlocks: "Most early investor and team tokens are fully unlocked. Ongoing inflation issuance is the primary source of new supply.",
    valueAccrual: "SOL accrues value through: (1) Network usage — all transactions require SOL for fees, and priority fees increase during high demand; (2) Staking demand — high staking participation (~65-70%) reduces liquid supply; (3) Ecosystem growth — more apps and users drive more transaction demand; (4) SIMD-228 proposal to adjust inflation based on staking rate is under discussion. Currently, 50% of transaction fees are burned and 50% go to validators.",
    team: "Founded by Anatoly Yakovenko (CEO, ex-Qualcomm senior engineer) and Raj Gokal (COO). Yakovenko conceived Proof of History in 2017. Solana Labs is the primary development company, with the Solana Foundation (based in Switzerland) supporting ecosystem growth. Key engineering contributors include Jump Crypto (building Firedancer client), Anza (Solana Labs spinoff), and Jito Labs (MEV infrastructure). All founders are doxxed and publicly active.",
    investors: "Major investors include Andreessen Horowitz (a16z), Polychain Capital, Multicoin Capital, Alameda Research (pre-FTX collapse), CMS Holdings, and others. Total funding raised exceeds $300M across multiple rounds. Despite the FTX/Alameda bankruptcy (which held large SOL positions), the ecosystem recovered strongly. Institutional interest has grown significantly with spot ETF filings from Franklin Templeton, VanEck, and others.",
    community: "Reddit r/solana: 300K+ members. Solana ecosystem has 2,500+ active developers (Electric Capital). Breakpoint conference is the flagship annual event. Phantom wallet has 10M+ downloads. Jupiter DEX aggregator processes billions in monthly volume. Solana Mobile (Saga phone) and the Solana dApp Store are unique ecosystem initiatives.",
    risks: [
      { name: "Network Reliability", level: "MEDIUM", desc: "Solana has experienced multiple network outages and degraded performance events historically, though reliability has significantly improved since the introduction of QUIC networking and local fee markets in 2023-2024." },
      { name: "Centralization Concerns", level: "MEDIUM", desc: "Validator hardware requirements are high (128GB+ RAM, high-bandwidth connections), limiting who can run nodes. The Nakamoto coefficient (minimum validators to halt the network) is ~30-35, lower than Ethereum's." },
      { name: "Regulatory Risk", level: "MEDIUM", desc: "SOL was named as a potential security in SEC lawsuits against exchanges, though spot ETF filings suggest regulatory clarity may be improving." },
      { name: "FTX/Alameda Overhang", level: "LOW", desc: "FTX estate held large SOL positions that have been gradually distributed via auctions. Most of this selling pressure has been absorbed by the market." },
    ],
    catalystRows: [
      ["Spot SOL ETF Approval", "2025-2026", "Multiple filings pending; would unlock significant institutional capital"],
      ["Firedancer Launch", "2025-2026", "Jump Crypto's independent client targeting 1M+ TPS; major reliability and performance upgrade"],
      ["Token Extensions Adoption", "Ongoing", "Enables compliant tokenized securities and stablecoins natively on Solana"],
      ["Solana Mobile Chapter 2", "2025", "New crypto-native phone with Solana dApp Store; expanding consumer reach"],
      ["DePIN Growth", "Ongoing", "Helium, Render, and other DePIN protocols drive non-financial use cases"],
    ],
    sources: [
      "CoinGecko API — Market data (accessed Jan 2026)",
      "solana.com — Protocol documentation",
      "DefiLlama — TVL and protocol data",
      "Electric Capital Developer Report 2024",
      "Solana Foundation — Validator health reports",
      "Messari — Solana research reports",
    ],
  },

  {
    name: "Hyperliquid",
    ticker: "$HYPE",
    chain: "Hyperliquid L1",
    category: "Perp-DEX",
    folder: "perp-dex",
    filename: "hyperliquid",
    summary: "Hyperliquid is the dominant decentralized perpetual futures exchange, commanding 70%+ of on-chain perp trading volume. Built on its own custom L1 blockchain (HyperBFT consensus), it offers CEX-level performance with full on-chain transparency. Uniquely, the project had zero VC funding and conducted one of the largest community airdrops in crypto history in late 2024, distributing 31% of supply to users.",
    whatIsIt: "Hyperliquid is a fully on-chain order book perpetual futures exchange built on a purpose-built Layer 1 blockchain. Unlike other DEXs that run on general-purpose chains, Hyperliquid designed its own blockchain optimized specifically for high-frequency trading. Every order, cancellation, trade, and liquidation occurs transparently on-chain with sub-second block latency. The platform supports 100+ perpetual futures markets with up to 50x leverage, plus a growing spot trading ecosystem via HIP-1 and HIP-2 token standards. The Hyperliquid L1 processes up to 100,000 orders per second.",
    market: "The perpetual futures market is the largest segment of crypto trading, with over $100B+ in daily volume across centralized and decentralized venues. On-chain perp DEXs have grown from <1% to ~5-10% of total perp volume. Hyperliquid dominates the on-chain segment with 70%+ market share, followed by dYdX, GMX, and newer entrants like Lighter. The platform directly competes with centralized exchanges like Binance, Bybit, and OKX on performance metrics.",
    howItWorks: "Hyperliquid L1 uses HyperBFT, a custom consensus algorithm inspired by HotStuff and its successors. The chain is optimized from the ground up for financial applications with: (1) Sub-second block latency; (2) Deterministic ordering — all operations are fully on-chain with cryptographic verifiability; (3) Native order book matching engine; (4) Risk engine handling liquidations on-chain; (5) Vaulting system for copy-trading; (6) HIP-1 — native token standard for launching tokens on Hyperliquid; (7) HIP-2 — automated liquidity provision for new tokens. The platform requires no gas fees for trading — users deposit USDC as collateral and trade against the order book.",
    competitiveAdvantage: "Key differentiators: (1) Performance — sub-second finality, 100K orders/sec, matching CEX-level UX; (2) No VC funding — entirely community-owned, no investor unlock overhang; (3) Full on-chain transparency — every operation verifiable; (4) Dominant market share — 70%+ of on-chain perps, strong network effects in liquidity; (5) Expanding ecosystem — spot trading, native tokens (HIP-1/HIP-2), builder ecosystem growing; (6) No gas fees for trading — lower friction than competitors on other chains.",
    metricsRows: [
      ["Market Cap", "~$9.3B", "Rank #28 (CoinGecko, Jan 2026)"],
      ["FDV", "~$27.6B", "Based on 1B max supply"],
      ["TVL", "~$4.68B", "Total value locked in vaults and margin (CoinGecko)"],
      ["Daily Trading Volume", "$3-10B+", "Varies; consistently highest among perp DEXs"],
      ["Market Share (Perp DEX)", "70%+", "Dominant position in on-chain perpetuals"],
      ["Open Interest", "$3-5B+", "Among highest in DeFi"],
    ],
    tokenUtility: "HYPE token functions: (1) Staking — secures the HyperBFT consensus network; (2) Governance — future governance rights over protocol parameters; (3) Fee discounts — potential fee tier benefits for HYPE holders/stakers; (4) Ecosystem participation — used in HIP-1 token launches and ecosystem activities. The Hyper Foundation manages token distribution and ecosystem development.",
    distributionRows: [
      ["Community (Genesis Airdrop)", "31%", "Distributed Nov 2024; no lockup"],
      ["Future Emissions & Community", "38.888%", "For future community rewards"],
      ["Core Contributors", "23.8%", "Subject to vesting schedules"],
      ["Hyper Foundation", "6.0%", "Foundation operations"],
      ["Community Grants", "0.3%", "Ecosystem grants"],
    ],
    circulating: "~333M HYPE (~33.3% of max supply)",
    maxSupply: "1,000,000,000 HYPE",
    inflationRate: "No inflation; fixed supply with distribution schedule",
    upcomingUnlocks: "Core contributor tokens subject to multi-year vesting. Future community emissions (38.888%) to be distributed over time. Specific schedules not fully disclosed.",
    valueAccrual: "Hyperliquid accrues value through: (1) Trading fees — the platform generates significant fee revenue from its dominant perp volume; (2) Assistance Fund — protocol profits are used to buy back HYPE; (3) HIP-1 token launches — new tokens listing on Hyperliquid generate ecosystem activity and potential fees; (4) Growing spot trading via HIP-2 liquidity mechanisms. The Assistance Fund has been a consistent buyer of HYPE with protocol revenue.",
    team: "Founded by Jeff Yan (Harvard math/CS, ex-Hudson River Trading quantitative trader) and a team of former quantitative traders and engineers. The team is relatively small and private but doxxed. They built the protocol without VC funding, self-funding development. The Hyper Foundation was established to manage the ecosystem post-launch.",
    investors: "Zero VC funding — one of the most notable bootstrapped projects in crypto history. The project was entirely self-funded by the founding team. This is a key differentiator, as there are no VC unlock schedules creating selling pressure.",
    community: "Twitter @HyperliquidX: 500K+ followers. Discord: active trading community. The November 2024 genesis airdrop was one of the largest in crypto history, distributing tokens to early users based on trading activity. Strong loyalty among power users due to the 'no VC' ethos. Hyperliquid consistently ranks #1 in on-chain perp DEX volume.",
    risks: [
      { name: "Validator Centralization", level: "HIGH", desc: "The Hyperliquid L1 currently operates with a small validator set controlled primarily by the team. Progressive decentralization is planned but not yet achieved. A compromise of validators could affect the entire platform." },
      { name: "Regulatory Risk", level: "HIGH", desc: "Perpetual futures are regulated products in most jurisdictions. Hyperliquid operates without traditional financial licenses. Increased regulatory scrutiny of DeFi derivatives could impact operations." },
      { name: "Competition", level: "MEDIUM", desc: "Centralized exchanges continue to dominate perp volume. New entrants like Lighter (ZK-proven matching) and improved dYdX could erode market share. CEX-DEX convergence is accelerating." },
      { name: "Smart Contract / L1 Risk", level: "MEDIUM", desc: "As a custom L1, Hyperliquid's codebase has less battle-testing than established chains. A critical bug could result in loss of user funds." },
    ],
    catalystRows: [
      ["HyperEVM Launch", "Q1 2026", "EVM-compatible execution environment enabling broader DeFi ecosystem on Hyperliquid"],
      ["Validator Decentralization", "2026", "Expanding validator set to improve decentralization and network resilience"],
      ["Ecosystem Growth (HIP-1/HIP-2)", "Ongoing", "New token launches and spot trading growing the platform beyond perps"],
      ["Institutional Adoption", "2025-2026", "Increasing institutional interest in on-chain derivatives"],
    ],
    sources: [
      "CoinGecko API — Market data (accessed Jan 2026)",
      "Hyperliquid Docs (hyperliquid.gitbook.io)",
      "Hyper Foundation (hyperfoundation.org)",
      "DefiLlama — Perp DEX volume rankings",
      "Messari — Hyperliquid research",
    ],
  },

  {
    name: "Lighter",
    ticker: "$LIGHT",
    chain: "Ethereum (ZK Rollup)",
    category: "Perp-DEX",
    folder: "perp-dex",
    filename: "lighter",
    summary: "Lighter is a fully verifiable decentralized exchange built with custom zero-knowledge infrastructure, operating as a ZK rollup on Ethereum. It offers zero-fee trading for retail users with ZK proofs of all operations including order matching and liquidations. The protocol is backed by a16z, Dragonfly, Coatue, and other top-tier investors.",
    whatIsIt: "Lighter is a zero-knowledge rollup DEX built on top of Ethereum, optimized for speed, throughput, and scale. Unlike other DEXs that rely on general-purpose L2 infrastructure, Lighter generates ZK proofs for all operations including order matching and liquidations using custom-built circuits. This means every trade is cryptographically verifiable on Ethereum. The platform offers zero fees for retail traders and highly competitive fees for high-frequency traders, enabled by its optimized proving infrastructure that keeps costs extremely low.",
    market: "Lighter competes in the on-chain derivatives and spot trading market. The decentralized perp market is dominated by Hyperliquid (70%+ share), with dYdX, GMX, and others also competing. Lighter differentiates through its ZK-verifiable approach inheriting Ethereum's security directly. The total addressable market for on-chain trading is estimated at hundreds of billions in daily volume as DEXs continue gaining share from centralized exchanges.",
    howItWorks: "Lighter operates as a custom ZK rollup on Ethereum: (1) Transactions flow through custom circuits that verify signatures and balances instantly; (2) A high-performance matching engine processes thousands of orders per second with millisecond latency; (3) A batch prover generates ZK proofs of correct execution for all operations — order matching, liquidations, and state transitions; (4) Proofs are verified on Ethereum mainnet, inheriting its security guarantees; (5) Users can deposit and withdraw securely through Ethereum with all proofs verified publicly. The system adheres to a publicly predefined set of rules, ensuring deterministic and verifiable behavior.",
    competitiveAdvantage: "Key differentiators: (1) ZK-verifiable — every operation is proven correct via zero-knowledge proofs, the highest standard of on-chain verifiability; (2) Zero fees for retail — optimized proving infrastructure enables no-fee trading for most users; (3) Ethereum security — inherits Ethereum's security as a rollup vs. custom L1s; (4) Performance — millisecond latency, thousands of orders/second, competitive with centralized exchanges; (5) Privacy — ZK proofs keep some trading data private while proving correctness; (6) Top-tier backing — a16z, Dragonfly, Coatue signal strong validation.",
    metricsRows: [
      ["Market Cap", "[Data pending — recently launched]", "Token recently launched"],
      ["Daily Volume", "[Ramping up]", "Growing user base post-launch"],
      ["Proving Cost", "Highly optimized", "Custom circuits enable zero retail fees"],
      ["Supported Markets", "Perps + Spot", "Expanding market listings"],
      ["Latency", "Milliseconds", "Competitive with CEX performance"],
    ],
    tokenUtility: "LIGHT token utility details are emerging as the protocol matures. Expected functions include: (1) Governance — protocol parameter decisions; (2) Staking — potential staking for fee sharing or sequencer participation; (3) Fee tier benefits — enhanced trading conditions for LIGHT holders. Specific token mechanics to be confirmed as the protocol develops.",
    distributionRows: [
      ["Team & Contributors", "[TBD]", "Subject to vesting"],
      ["Investors", "[TBD]", "Multi-year vesting expected"],
      ["Community & Ecosystem", "[TBD]", "Community incentives and growth"],
      ["Treasury", "[TBD]", "Protocol development fund"],
    ],
    circulating: "[Data not yet available — recently launched]",
    maxSupply: "[To be confirmed]",
    inflationRate: "[To be confirmed]",
    upcomingUnlocks: "[Vesting schedules to be disclosed]",
    valueAccrual: "Lighter's value accrual mechanisms are expected to include: (1) Trading fee revenue — while retail traders pay zero fees, high-frequency traders pay competitive fees; (2) Potential fee-sharing with token stakers; (3) Ecosystem growth driving demand for LIGHT. Specific mechanisms to be detailed as the protocol matures.",
    team: "The Lighter team includes experienced engineers and researchers in zero-knowledge cryptography and high-performance systems. Specific team member details are partially disclosed. The team has been building custom ZK circuits from scratch rather than using off-the-shelf proving systems, indicating deep technical expertise.",
    investors: "Backed by top-tier investors: Andreessen Horowitz (a16z), Dragonfly Capital, Coatue Management, A* Capital, Lightspeed Venture Partners (LSVP), CRV, Robot Ventures (Robert Leshner), SV Angel, 8VC, and Abstract Ventures. This represents one of the strongest investor syndicates in DeFi.",
    community: "Growing community with mobile app launched on iOS and Android. The project is relatively early-stage compared to Hyperliquid but has strong momentum from its investor backing and ZK-native approach. Discord and Twitter communities are active and growing.",
    risks: [
      { name: "Early Stage / Unproven", level: "HIGH", desc: "Lighter is a newer protocol with less battle-testing than established DEXs. Custom ZK circuits, while innovative, carry novel technical risks. Trading volume and liquidity are still building." },
      { name: "Competition from Hyperliquid", level: "HIGH", desc: "Hyperliquid's 70%+ market dominance and strong network effects in liquidity present a significant challenge. Lighter must differentiate strongly to capture meaningful market share." },
      { name: "ZK Proving Risks", level: "MEDIUM", desc: "Custom ZK circuits are complex and may contain bugs. The proving system's reliability under high load is still being demonstrated at scale." },
      { name: "Regulatory Risk", level: "MEDIUM", desc: "Same regulatory concerns as all perp DEXs regarding derivatives trading without traditional financial licenses." },
    ],
    catalystRows: [
      ["Mobile App Adoption", "2025-2026", "iOS and Android apps expand user reach beyond desktop traders"],
      ["Volume Growth", "Ongoing", "Growing liquidity and volume drive network effects"],
      ["New Market Listings", "Ongoing", "Expanding tradeable assets attracts more users"],
      ["ZK Technology Maturation", "2025-2026", "Proving system optimization continues to reduce costs and improve performance"],
    ],
    sources: [
      "lighter.xyz — Official website and documentation",
      "a16z portfolio page",
      "App Store / Google Play — Lighter Mobile app listings",
      "Lighter blog and documentation",
    ],
  },

  {
    name: "DeepBook",
    ticker: "$DEEP",
    chain: "Sui",
    category: "Spot-DEX",
    folder: "spot-dex",
    filename: "deepbook",
    summary: "DeepBook is Sui's native fully on-chain central limit order book (CLOB), designed to serve as the core liquidity and price discovery layer for the entire Sui DeFi ecosystem. Built as a shared infrastructure primitive on Sui, DeepBook enables any protocol to tap into deep, composable liquidity with ~390ms settlement times and dynamic low fees.",
    whatIsIt: "DeepBook is a decentralized spot exchange built as a core infrastructure protocol on the Sui blockchain. Unlike AMM-based DEXs (Uniswap-style), DeepBook uses a central limit order book (CLOB) model similar to traditional exchanges, enabling precise limit orders, market orders, and advanced order types. It leverages Sui's object-centric model and parallel transaction execution to achieve high throughput and low latency. DeepBook serves as the backbone liquidity layer for Sui DeFi — other protocols (lending, derivatives, aggregators) can compose directly with DeepBook's order books rather than building their own liquidity infrastructure.",
    market: "The DEX market is one of the largest in crypto, with billions in daily volume across chains. On Sui specifically, DeepBook is the central liquidity infrastructure. Globally, CLOB DEXs compete with AMM models (Uniswap, Raydium) and hybrid approaches. The on-chain CLOB segment is growing as blockchain performance improves, with competitors including Sei's native order book, Econia on Aptos, and centralized order book DEXs on Solana (Phoenix, OpenBook).",
    howItWorks: "DeepBook leverages Sui's unique architecture: (1) Object-centric model — order books, orders, and balances are represented as Sui objects, enabling parallel processing; (2) ~390ms settlement — orders match and settle in under half a second; (3) Composability — any Sui protocol can programmatically interact with DeepBook via Move smart contracts; (4) Dynamic fee structure — fees adjust based on market conditions and trader activity; (5) Price discovery — serves as the canonical price source for assets on Sui; (6) Deep liquidity pools with minimal slippage due to the CLOB model aggregating limit orders at specific price levels.",
    competitiveAdvantage: "Key advantages: (1) Native to Sui — deeply integrated with the blockchain's object model, not an application layer bolt-on; (2) CLOB efficiency — order books are more capital-efficient than AMMs for active markets; (3) Composability — serves as the liquidity backbone for the entire Sui ecosystem; (4) Low latency — ~390ms settlement vs. multi-second on most chains; (5) First-mover on Sui — established as the default order book infrastructure.",
    metricsRows: [
      ["Market Cap", "[Refer to CoinGecko for latest]", "Mid-cap DeFi token"],
      ["Daily Volume", "[Variable]", "Primary liquidity venue on Sui"],
      ["Settlement Time", "~390ms", "Sub-second trade settlement"],
      ["Supported Pairs", "Growing", "Major Sui ecosystem tokens"],
      ["Composing Protocols", "Multiple", "Lending, derivatives, aggregators integrate with DeepBook"],
    ],
    tokenUtility: "DEEP token functions: (1) Governance — vote on protocol parameters, fee structures, and upgrades; (2) Staking — stake DEEP to earn protocol fee revenue and participate in governance; (3) Fee discounts — DEEP stakers receive reduced trading fees; (4) Liquidity incentives — rewards for market makers providing order book liquidity.",
    distributionRows: [
      ["Community & Ecosystem", "[TBD]", "Incentives, grants, liquidity mining"],
      ["Team & Contributors", "[TBD]", "Subject to vesting"],
      ["Investors", "[TBD]", "Vesting schedule applies"],
      ["Treasury / Foundation", "[TBD]", "Long-term development"],
    ],
    circulating: "[Refer to CoinGecko for latest data]",
    maxSupply: "[To be confirmed from official sources]",
    inflationRate: "[To be confirmed]",
    upcomingUnlocks: "[Vesting details to be confirmed]",
    valueAccrual: "DEEP accrues value through: (1) Trading fee revenue — DEEP stakers earn a share of fees generated from all trading activity on DeepBook; (2) Ecosystem growth — as more Sui protocols integrate with DeepBook, trading volume and fees increase; (3) Governance premium — DEEP holders control critical infrastructure for the Sui ecosystem.",
    team: "DeepBook was developed as a core infrastructure component of the Sui ecosystem, with contributions from Mysten Labs (the primary developer of Sui). The protocol benefits from the broader Sui engineering team's expertise in Move smart contracts and parallel execution systems. Key Mysten Labs figures include Evan Cheng (CEO, ex-Apple, ex-Facebook/Meta) and Sam Blackshear (CTO, creator of the Move language).",
    investors: "DeepBook's development has been supported within the Sui ecosystem, which has raised significant funding. Mysten Labs raised $336M at a $2B+ valuation from a16z, Lightspeed, Electric Capital, Samsung, and others. DeepBook benefits from this ecosystem funding and support.",
    community: "Active Sui ecosystem community. DeepBook is integrated into major Sui wallets and DeFi interfaces. The Sui ecosystem Discord and Twitter communities actively discuss DeepBook as core infrastructure. Developer documentation is comprehensive for protocol integration.",
    risks: [
      { name: "Sui Ecosystem Dependency", level: "HIGH", desc: "DeepBook's success is entirely dependent on the growth and adoption of the Sui blockchain. If Sui fails to gain meaningful traction vs. Ethereum, Solana, and other L1s, DeepBook's volume and relevance will be limited." },
      { name: "Liquidity Bootstrapping", level: "MEDIUM", desc: "CLOB models require active market makers to provide liquidity. In low-activity periods, order book depth may thin, increasing slippage for larger trades." },
      { name: "Competition from AMMs", level: "MEDIUM", desc: "AMM-based DEXs (like Cetus on Sui) offer passive liquidity provision, which is simpler for retail users. CLOBs are more complex and favor sophisticated traders." },
      { name: "Token Value Capture", level: "MEDIUM", desc: "As infrastructure, DeepBook must demonstrate that DEEP token captures sufficient value from the protocol's role to justify its valuation." },
    ],
    catalystRows: [
      ["Sui Ecosystem Growth", "Ongoing", "More users and TVL on Sui directly benefits DeepBook volume"],
      ["New Trading Pairs", "Ongoing", "Adding major tokens and stablecoins expands addressable market"],
      ["Protocol Integrations", "Ongoing", "More Sui protocols composing with DeepBook deepens its role as core infrastructure"],
      ["Institutional Sui Adoption", "2025-2026", "Enterprise and institutional use of Sui could drive institutional trading through DeepBook"],
    ],
    sources: [
      "deepbook.tech — Official website",
      "Sui documentation — DeepBook protocol specs",
      "DefiLlama — Sui ecosystem TVL data",
      "Mysten Labs announcements",
    ],
  },

  {
    name: "Walrus",
    ticker: "$WAL",
    chain: "Sui",
    category: "Decentralized Storage",
    folder: "decentralized-storage",
    filename: "walrus",
    summary: "Walrus is a decentralized storage protocol built within the Sui ecosystem, designed to provide reliable, cost-effective, and censorship-resistant data storage. Leveraging advanced erasure coding techniques, Walrus aims to be the storage layer for the decentralized web, enabling applications to store and retrieve data without relying on centralized cloud providers.",
    whatIsIt: "Walrus is a decentralized data storage network that uses novel erasure coding (specifically, Red Stuff encoding) to store data across a distributed network of storage nodes. Unlike traditional replication-based storage (where data is copied to multiple nodes), erasure coding breaks data into fragments with redundancy, achieving fault tolerance with significantly less storage overhead. Walrus is built to integrate natively with Sui, allowing smart contracts to reference and manage stored data on-chain. Use cases include storing NFT media, website hosting (Walrus Sites), dApp front-ends, AI/ML datasets, and any application requiring decentralized, persistent data storage.",
    market: "The decentralized storage market includes Filecoin (~$3-4B market cap), Arweave (~$1-2B), and Storj. The broader cloud storage market is worth $100B+ annually and growing. Decentralized alternatives represent <1% of this market but are growing as Web3 applications demand censorship-resistant, permissionless storage. Walrus differentiates through its Sui integration and novel encoding approach.",
    howItWorks: "Walrus uses: (1) Red Stuff Encoding — a novel erasure coding scheme that splits data into fragments distributed across storage nodes, requiring only a fraction of fragments to reconstruct the original data; (2) Sui for coordination — storage metadata, proofs of storage, and payment are managed via Sui smart contracts; (3) Storage nodes — a decentralized network of nodes that store data fragments and earn WAL tokens; (4) Epochs — storage is organized into epochs for payment and availability guarantees; (5) Blob storage — data is stored as 'blobs' with unique identifiers, retrievable by any client from any storage node holding fragments.",
    competitiveAdvantage: "Key advantages: (1) Storage efficiency — erasure coding requires ~4-5x replication factor vs. 6-10x for simple replication, reducing costs; (2) Sui native — deep integration enables smart contract-managed storage; (3) Performance — optimized for fast reads; (4) Walrus Sites — enables fully decentralized website hosting; (5) Backed by Mysten Labs/Sui ecosystem funding and talent.",
    metricsRows: [
      ["Market Cap", "[Refer to CoinGecko for latest]", "Recently launched token"],
      ["Storage Capacity", "[Growing]", "Network expanding with new storage nodes"],
      ["Storage Nodes", "[Data not available]", "Decentralized node network"],
      ["Data Stored", "[Growing]", "Adoption increasing post-mainnet"],
      ["Cost per GB", "[Competitive]", "Lower than centralized cloud for permanent storage"],
    ],
    tokenUtility: "WAL token functions: (1) Storage payments — users pay WAL to store data on the network; (2) Staking — storage nodes stake WAL as collateral for honest behavior; (3) Governance — WAL holders participate in protocol governance; (4) Storage node rewards — nodes earn WAL for providing reliable storage.",
    distributionRows: [
      ["Community & Ecosystem", "[TBD]", "User incentives and ecosystem development"],
      ["Team & Contributors", "[TBD]", "Vesting schedule"],
      ["Investors", "[TBD]", "Vesting schedule"],
      ["Storage Mining Rewards", "[TBD]", "Ongoing rewards for storage providers"],
    ],
    circulating: "[Refer to CoinGecko for latest data]",
    maxSupply: "[To be confirmed]",
    inflationRate: "[To be confirmed]",
    upcomingUnlocks: "[Vesting details to be confirmed]",
    valueAccrual: "WAL accrues value through: (1) Storage demand — all data stored on Walrus requires WAL payment; (2) Staking requirement — storage nodes must stake WAL, reducing circulating supply; (3) Network growth — more data stored = more WAL demand; (4) Ecosystem integration — as Sui grows, applications will increasingly use Walrus for storage needs.",
    team: "Walrus was developed by Mysten Labs, the company behind Sui. Key figures include Evan Cheng (CEO, ex-Apple/Meta director of engineering), Sam Blackshear (CTO, creator of Move language), and George Danezis (Chief Scientist, UCL professor, co-creator of the Sui/Narwhal consensus). The team has deep expertise in distributed systems, cryptography, and systems programming.",
    investors: "Walrus benefits from the Sui/Mysten Labs ecosystem funding. Mysten Labs raised $336M+ from a16z, Lightspeed Venture Partners, Electric Capital, Samsung Next, Coinbase Ventures, and others. Walrus has also reportedly raised its own rounds — details pending confirmation.",
    community: "Active Sui ecosystem community supports Walrus. Walrus Sites (decentralized website hosting) has generated interest from developers. The protocol is in early adoption phase with growing developer documentation and integration guides.",
    risks: [
      { name: "Early Stage / Adoption Risk", level: "HIGH", desc: "Walrus is newly launched and must compete with established decentralized storage protocols (Filecoin, Arweave) that have years of proven operation and larger storage networks." },
      { name: "Sui Dependency", level: "HIGH", desc: "Walrus is deeply tied to the Sui ecosystem. Limited cross-chain adoption could restrict its addressable market." },
      { name: "Storage Economics", level: "MEDIUM", desc: "Decentralized storage must be cost-competitive with centralized alternatives (AWS S3, Google Cloud). If costs are significantly higher, adoption will be limited to censorship-sensitive use cases." },
      { name: "Data Persistence Guarantees", level: "MEDIUM", desc: "Ensuring long-term data availability requires sustained economic incentives for storage nodes. If WAL token price drops significantly, node operators may exit." },
    ],
    catalystRows: [
      ["Sui Ecosystem Growth", "Ongoing", "More Sui dApps = more demand for decentralized storage"],
      ["Walrus Sites Adoption", "2025-2026", "Decentralized website hosting could be a killer use case"],
      ["AI/ML Data Storage", "2025-2026", "Growing demand for decentralized AI training data storage"],
      ["Enterprise Integration", "2026+", "Enterprise adoption of Sui could drive Walrus storage demand"],
    ],
    sources: [
      "walrus.site — Official presence",
      "Mysten Labs documentation and blog",
      "Sui ecosystem documentation",
      "Walrus whitepaper / technical documentation",
    ],
  },

  {
    name: "Alkimi",
    ticker: "$ADS",
    chain: "Ethereum",
    category: "Advertising",
    folder: "advertising",
    filename: "alkimi",
    summary: "Alkimi is a decentralized advertising exchange that aims to disrupt the $700B+ digital advertising industry by eliminating intermediaries, reducing ad fraud, and increasing transparency. The protocol provides a blockchain-based alternative to centralized ad exchanges like Google Ads, enabling direct connections between advertisers and publishers with verifiable impression data.",
    whatIsIt: "Alkimi is building a decentralized ad exchange that replaces the opaque, intermediary-heavy digital advertising supply chain with a transparent, blockchain-based marketplace. In traditional digital advertising, up to 70% of advertiser spend is lost to intermediaries and fraud. Alkimi's exchange enables advertisers to buy ad impressions directly from publishers, with every impression verified on-chain. The platform handles programmatic advertising — the automated buying and selling of digital ad space — using smart contracts to ensure transparent pricing and genuine ad delivery.",
    market: "The global digital advertising market is worth $700B+ annually (per eMarketer/Statista). Programmatic advertising accounts for ~$500B+ of this. The supply chain suffers from well-documented problems: ad fraud ($65B+ annually), lack of transparency (advertisers don't know where ads appear), and excessive intermediary fees (ad tech takes 40-70% of advertiser spend). The blockchain advertising space is niche but growing, with competitors including Brave/BAT (browser-based), AdEx, and traditional ad tech companies exploring blockchain.",
    howItWorks: "Alkimi's architecture: (1) Decentralized ad exchange — smart contracts manage the bidding, matching, and settlement of ad impressions; (2) Real-time bidding — advertisers bid for impressions in real-time, similar to traditional programmatic but with on-chain settlement; (3) Impression verification — blockchain records verify that ads were actually delivered and viewed; (4) Publisher tools — publishers integrate Alkimi's SDK to serve ads from the decentralized exchange; (5) Anti-fraud — on-chain verification makes it significantly harder to fake impressions or clicks; (6) ADS token — used for staking, governance, and incentive alignment between advertisers and publishers.",
    competitiveAdvantage: "Key differentiators: (1) Direct advertiser-to-publisher — eliminates intermediary fees that consume 40-70% of ad spend in traditional ad tech; (2) Fraud reduction — on-chain impression verification combats the $65B ad fraud problem; (3) Transparency — advertisers can verify exactly where their ads appeared and whether they were viewed; (4) First-mover in decentralized programmatic — most blockchain ad projects (BAT) focus on browsers, not the exchange layer; (5) Industry-compatible — designed to work with existing ad formats and standards.",
    metricsRows: [
      ["Market Cap", "[Refer to CoinGecko for latest]", "Small-cap"],
      ["Ad Impressions Served", "[Data not available]", "Growing adoption metrics"],
      ["Publisher Partners", "[Data not available]", "Onboarding publishers"],
      ["Revenue", "[Data not available]", "Early revenue stage"],
      ["TAM", "$700B+", "Global digital advertising market"],
    ],
    tokenUtility: "ADS token functions: (1) Exchange medium — used for settling ad transactions on the platform; (2) Staking — participants stake ADS to operate within the exchange; (3) Governance — token holders vote on protocol parameters; (4) Publisher/advertiser incentives — rewards for early participants in the exchange.",
    distributionRows: [
      ["Public Sale / Community", "[TBD]", "Available at launch"],
      ["Team & Advisors", "[TBD]", "Subject to vesting"],
      ["Ecosystem / Marketing", "[TBD]", "Growth incentives"],
      ["Treasury", "[TBD]", "Development fund"],
    ],
    circulating: "[Refer to CoinGecko for latest data]",
    maxSupply: "[To be confirmed]",
    inflationRate: "[To be confirmed]",
    upcomingUnlocks: "[Vesting details to be confirmed]",
    valueAccrual: "ADS accrues value through: (1) Transaction fees — a percentage of every ad transaction flows to the protocol; (2) Staking demand — participants must stake ADS, reducing circulating supply; (3) Growth of ad volume — more advertisers and publishers = more ADS demand; (4) Potential buyback or burn mechanisms from protocol revenue.",
    team: "Alkimi was founded by Ben Putley (CEO) and a team with experience in digital advertising technology. The project has been focused on bridging the gap between traditional ad tech and blockchain, with team members having backgrounds in programmatic advertising. The team is doxxed.",
    investors: "[Limited public information on specific VC investors. The project has conducted public token sales and community fundraising.]",
    community: "The Alkimi community is focused on the intersection of ad tech and crypto. The project has a presence on Twitter, Discord, and Telegram. Community size is smaller compared to pure DeFi projects, reflecting the niche nature of blockchain advertising.",
    risks: [
      { name: "Adoption Risk", level: "HIGH", desc: "Convincing traditional advertisers and publishers to adopt blockchain-based ad infrastructure is extremely challenging. The ad industry is conservative and dominated by Google and Meta." },
      { name: "Market Size Realization", level: "HIGH", desc: "While the TAM is enormous ($700B+), the realistic near-term addressable market for a decentralized ad exchange is much smaller. Blockchain ad solutions serve a tiny fraction of total ad spend." },
      { name: "Technical Scalability", level: "MEDIUM", desc: "Programmatic advertising requires processing millions of bid requests per second. On-chain settlement at this scale is technically challenging." },
      { name: "Competition", level: "MEDIUM", desc: "Both traditional ad tech giants (Google, The Trade Desk) and other blockchain projects (Brave/BAT) compete in this space with significantly more resources." },
    ],
    catalystRows: [
      ["Publisher Partnerships", "Ongoing", "Signing major publishers drives ad volume"],
      ["Industry Regulation", "2025-2026", "Growing regulatory pressure on ad fraud and transparency could benefit decentralized alternatives"],
      ["Cookie Deprecation", "Ongoing", "End of third-party cookies may open opportunities for new ad infrastructure"],
      ["Advertiser Adoption", "2025-2026", "Enterprise advertisers piloting blockchain-based campaigns"],
    ],
    sources: [
      "Alkimi project documentation and website",
      "Digital advertising market reports (eMarketer, Statista)",
      "Ad fraud research (Juniper Research, ANA/White Ops)",
    ],
  },

  {
    name: "Zeus Network",
    ticker: "$ZEUS",
    chain: "Solana",
    category: "Cross-Chain",
    folder: "cross-chain",
    filename: "zeus-network",
    summary: "Zeus Network is a cross-chain communication protocol built on Solana, focused on bridging Bitcoin to Solana's DeFi ecosystem. The protocol enables native Bitcoin to be used within Solana DeFi applications without centralized custodians, addressing the multi-trillion dollar opportunity of bringing Bitcoin's liquidity into programmable DeFi.",
    whatIsIt: "Zeus Network is a permissionless, trust-minimized cross-chain communication layer built on Solana. Its primary product is enabling Bitcoin holders to access Solana DeFi without relying on centralized bridges or wrapped token custodians. Zeus uses a network of nodes that observe and validate cross-chain transactions, with economic security provided by staking. The protocol's first major application is bringing native Bitcoin into Solana's DeFi ecosystem (lending, trading, yield), but the architecture is designed to support cross-chain communication between any supported chains.",
    market: "The cross-chain bridge market facilitates $5-10B+ in daily bridge volume across the crypto ecosystem. Bitcoin-to-DeFi is one of the largest untapped opportunities — Bitcoin has $1T+ in market cap but only a small fraction participates in DeFi. Competitors include WBTC (custodial, Ethereum), tBTC (Threshold Network, trust-minimized), sBTC (Stacks), and various bridge protocols (Wormhole, LayerZero). On Solana specifically, Zeus is the primary native Bitcoin bridge solution.",
    howItWorks: "Zeus Network architecture: (1) Zeus Node Network — a decentralized set of validator nodes that observe transactions on source chains (Bitcoin) and relay them to Solana; (2) Threshold signatures — nodes collectively sign cross-chain transactions using threshold cryptography, preventing any single node from controlling funds; (3) Economic security — nodes stake ZEUS tokens as collateral, subject to slashing for misbehavior; (4) Bitcoin Script integration — Zeus interfaces with Bitcoin's native scripting capabilities to lock BTC and issue representations on Solana; (5) Smart contract layer on Solana — manages minting/burning of Bitcoin representations and DeFi integration.",
    competitiveAdvantage: "Key differentiators: (1) Solana-native — optimized for Solana's high-throughput environment; (2) Trust-minimized — no single custodian controls bridged BTC, unlike WBTC; (3) Bitcoin-focused — specialized in the highest-value cross-chain use case; (4) Economic security — staking model aligns incentives; (5) DeFi composability — bridged BTC can be used across all Solana DeFi protocols.",
    metricsRows: [
      ["Market Cap", "[Refer to CoinGecko for latest]", "Early-stage cross-chain protocol"],
      ["TVL (Bridged BTC)", "[Growing]", "Bitcoin bridged to Solana via Zeus"],
      ["Node Count", "[Data not available]", "Growing validator set"],
      ["Bridge Volume", "[Data not available]", "Tracking cross-chain transaction volume"],
    ],
    tokenUtility: "ZEUS token functions: (1) Staking — nodes must stake ZEUS to participate in the validator network; (2) Economic security — staked ZEUS serves as collateral against malicious behavior (slashing); (3) Governance — ZEUS holders vote on protocol parameters and upgrades; (4) Fee payment — cross-chain transaction fees paid in or denominated against ZEUS.",
    distributionRows: [
      ["Community & Ecosystem", "[TBD]", "Incentives, airdrops, liquidity mining"],
      ["Team & Contributors", "[TBD]", "Subject to vesting"],
      ["Investors", "[TBD]", "Vesting schedule applies"],
      ["Node Operator Rewards", "[TBD]", "Ongoing staking rewards"],
    ],
    circulating: "[Refer to CoinGecko for latest data]",
    maxSupply: "[To be confirmed]",
    inflationRate: "[To be confirmed]",
    upcomingUnlocks: "[Vesting details to be confirmed]",
    valueAccrual: "ZEUS accrues value through: (1) Cross-chain fee revenue — every bridge transaction generates fees; (2) Staking demand — nodes must stake ZEUS, reducing circulating supply; (3) BTC-DeFi growth — more Bitcoin in DeFi = more bridge volume = more fees; (4) Ecosystem expansion — supporting additional chains increases the protocol's utility.",
    team: "Zeus Network is being developed by a team focused on cross-chain infrastructure and Solana development. The project has been building in the Solana ecosystem with a focus on Bitcoin integration. Team details are partially disclosed.",
    investors: "[Investor details to be confirmed. The project has received ecosystem support from the Solana community.]",
    community: "Zeus Network has an active community in the Solana ecosystem, focused on the Bitcoin-DeFi narrative. The project participates in Solana ecosystem events and has partnerships with major Solana DeFi protocols. Twitter and Discord communities are active.",
    risks: [
      { name: "Bridge Security Risk", level: "HIGH", desc: "Cross-chain bridges have been the most exploited category in DeFi, with billions lost to bridge hacks (Ronin, Wormhole, Nomad). Any bridge carries inherent security risks." },
      { name: "Competition", level: "HIGH", desc: "Multiple projects are working on Bitcoin-to-DeFi solutions across different chains. Wormhole, LayerZero, and chain-specific solutions all compete for bridge volume." },
      { name: "Bitcoin Culture Resistance", level: "MEDIUM", desc: "Many Bitcoin holders are philosophically opposed to bridging or DeFi usage, limiting the addressable market to a subset of BTC holders." },
      { name: "Solana Dependency", level: "MEDIUM", desc: "Zeus is primarily focused on Solana. If Solana loses relevance or faces network issues, Zeus's utility is directly impacted." },
    ],
    catalystRows: [
      ["Bitcoin DeFi Narrative", "Ongoing", "Growing institutional interest in Bitcoin yield and DeFi"],
      ["Solana DeFi Growth", "Ongoing", "More Solana DeFi TVL increases demand for bridged BTC"],
      ["Multi-Chain Expansion", "2025-2026", "Supporting additional chains beyond Bitcoin-Solana"],
      ["Institutional Bitcoin Custody", "2025-2026", "Institutional BTC holders seeking yield could use Zeus"],
    ],
    sources: [
      "Zeus Network official documentation",
      "Solana ecosystem resources",
      "Cross-chain bridge market data (DefiLlama bridges)",
    ],
  },

  {
    name: "Umbra",
    ticker: "TBD",
    chain: "Ethereum",
    category: "Privacy",
    folder: "privacy",
    filename: "umbra",
    summary: "Umbra is a stealth address protocol deployed on Ethereum and EVM-compatible chains that enables private payments. Using cryptographic stealth addresses, senders can transfer ETH and ERC-20 tokens to recipients without publicly linking the sender and receiver addresses on-chain. Umbra was developed by ScopeLift and does not currently have a token.",
    whatIsIt: "Umbra is a privacy protocol that implements stealth addresses on Ethereum and other EVM chains. A stealth address system allows a sender to create a one-time address for each transaction that only the intended recipient can access, breaking the on-chain link between sender and receiver. Unlike mixing protocols (Tornado Cash), Umbra doesn't pool funds — each payment goes directly to a unique stealth address. This approach is simpler, more gas-efficient, and avoids the regulatory complications associated with mixing services. Vitalik Buterin has publicly endorsed stealth addresses as a practical privacy solution for Ethereum.",
    market: "Blockchain privacy is a growing concern as on-chain analytics tools become more sophisticated. The privacy protocol market includes Tornado Cash (sanctioned by OFAC, limited usage), Aztec Network (ZK-based privacy layer), Railgun (privacy for DeFi), and Secret Network (privacy L1). Stealth addresses represent a more lightweight, targeted privacy approach compared to full-chain privacy solutions. The TAM includes all Ethereum users who want basic transactional privacy.",
    howItWorks: "Umbra protocol mechanics: (1) Recipients register a stealth meta-address by publishing a public key to Umbra's on-chain registry; (2) Senders use the recipient's stealth meta-address to generate a one-time stealth address using elliptic curve Diffie-Hellman (ECDH); (3) Funds are sent to the unique stealth address; (4) The sender publishes an ephemeral public key on-chain; (5) The recipient scans announcements, uses their private key to derive the corresponding stealth address private key, and can access the funds; (6) A relayer system allows recipients to withdraw without connecting to their main address, preserving privacy for gas payments.",
    competitiveAdvantage: "Key advantages: (1) Simplicity — stealth addresses are conceptually and technically simpler than zero-knowledge mixing; (2) Regulatory clarity — not a mixer or tumbler; funds flow directly between sender and unique receiver address; (3) Vitalik endorsement — stealth addresses are on Ethereum's privacy roadmap (EIP-5564); (4) Non-custodial — users maintain full control of funds; (5) Multi-chain — deployed on Ethereum, Polygon, Optimism, Arbitrum, and other EVM chains; (6) Gas efficient — no complex ZK proof generation required.",
    metricsRows: [
      ["Token", "No token (TBD)", "No token currently; potential future issuance"],
      ["Chains Supported", "Ethereum, Polygon, Optimism, Arbitrum, Gnosis", "Multi-chain EVM deployment"],
      ["Total Transactions", "[Data not available]", "Growing usage"],
      ["Protocol Revenue", "Minimal / None", "Open-source public good"],
    ],
    tokenUtility: "Umbra does not currently have a token. The protocol operates as a public good. A future token could potentially be used for: (1) Governance — protocol parameter decisions; (2) Relayer incentives — rewarding relayers who help preserve recipient privacy; (3) Development funding — sustaining ongoing development. Any future tokenomics are speculative at this point.",
    distributionRows: [
      ["No token currently", "N/A", "N/A"],
    ],
    circulating: "No token",
    maxSupply: "No token",
    inflationRate: "N/A",
    upcomingUnlocks: "N/A",
    valueAccrual: "Currently, Umbra operates as a public good with no direct value accrual mechanism. If a token is launched, it could capture value through: (1) Relayer fees; (2) Premium privacy features; (3) Integration fees from protocols building on Umbra. The primary value proposition is the stealth address standard itself (EIP-5564) becoming widely adopted on Ethereum.",
    team: "Developed by ScopeLift, a smart contract development firm. ScopeLift was founded by Ben DiFrancesco, an experienced Ethereum developer. The team is focused on Ethereum public goods and infrastructure. All team members are doxxed. Vitalik Buterin has been a vocal supporter of the stealth address approach and Umbra specifically.",
    investors: "Umbra has received grants from the Ethereum Foundation and various Ethereum ecosystem grants programs. As a public good, it has not pursued traditional VC funding. ScopeLift operates as a development firm that sustains itself through client work and grants.",
    community: "Umbra's community is relatively small but quality-focused, consisting of privacy-conscious Ethereum users and developers interested in EIP-5564 stealth address standardization. The project has support from prominent Ethereum researchers and developers. Community is primarily on Twitter and GitHub.",
    risks: [
      { name: "No Token / Uncertain Monetization", level: "HIGH", desc: "Without a token, there is no direct investment vehicle. Future token launch is speculative. Even if launched, value accrual for a privacy primitive is unclear." },
      { name: "Regulatory Risk", level: "HIGH", desc: "Privacy protocols face significant regulatory scrutiny post-Tornado Cash sanctions. While stealth addresses are less controversial than mixers, regulatory attitudes toward on-chain privacy remain uncertain." },
      { name: "Adoption", level: "MEDIUM", desc: "Privacy features require both sender and receiver adoption. Network effects are weaker for privacy tools — users need counterparties who also use the system." },
      { name: "Competition", level: "MEDIUM", desc: "Aztec Network, Railgun, and potential native Ethereum privacy features could reduce demand for standalone stealth address protocols." },
    ],
    catalystRows: [
      ["EIP-5564 Standardization", "TBD", "If stealth addresses become an Ethereum standard, Umbra benefits as the reference implementation"],
      ["Token Launch", "TBD / Speculative", "A token would create a direct investment vehicle"],
      ["Regulatory Clarity", "TBD", "Clear regulatory framework for privacy tools would reduce uncertainty"],
      ["Wallet Integration", "Ongoing", "Native wallet support for stealth addresses would drive adoption"],
    ],
    sources: [
      "Umbra Cash documentation (umbra.cash)",
      "ScopeLift website and GitHub",
      "EIP-5564 specification",
      "Vitalik Buterin's blog posts on stealth addresses",
    ],
  },

  {
    name: "MetaDAO",
    ticker: "$META",
    chain: "Solana",
    category: "Governance",
    folder: "governance",
    filename: "metadao",
    summary: "MetaDAO is a governance protocol on Solana that implements futarchy — a decision-making system where markets (not votes) determine organizational decisions. Proposed by economist Robin Hanson, futarchy uses prediction markets to evaluate proposals: if the market thinks a decision will increase the token's value, it passes. MetaDAO is the first practical implementation of futarchy at scale in crypto.",
    whatIsIt: "MetaDAO is a decentralized governance system built on Solana that replaces traditional token-weighted voting with prediction market-based decision making (futarchy). In traditional DAOs, token holders vote on proposals, which suffers from voter apathy, plutocracy, and uninformed voting. In MetaDAO's futarchy model, when a proposal is made, two conditional prediction markets are created: one for 'pass' and one for 'fail.' Traders bet on what the META token price will be in each scenario. If the 'pass' market shows a higher expected token price than 'fail,' the proposal is automatically enacted. This harnesses market intelligence to make better decisions than majority voting.",
    market: "The DAO governance market is significant — DAOs manage tens of billions in treasury assets (per DeepDAO). Current governance suffers from low participation (<10% for most DAOs), whale dominance, and poor decision quality. Futarchy represents a fundamentally different approach. MetaDAO is the first practical implementation; competitors are mainly traditional governance frameworks (Snapshot, Tally, Governor Bravo). The broader prediction market space (Polymarket, Kalshi) validates market-based information aggregation.",
    howItWorks: "MetaDAO's futarchy mechanism: (1) Proposal submission — anyone can submit a proposal for META governance; (2) Conditional markets created — two markets open: META-PASS (token price conditional on proposal passing) and META-FAIL (token price conditional on proposal failing); (3) Trading period — for a set duration, traders buy/sell in both markets based on their belief about the proposal's impact on META value; (4) Resolution — if META-PASS price > META-FAIL price (the market believes the proposal increases value), it passes automatically; (5) Settlement — the losing market's tokens are redeemed and the winning market continues; (6) This runs on Solana using an on-chain order book for the conditional markets.",
    competitiveAdvantage: "Key advantages: (1) Novel governance mechanism — futarchy aligns decisions with value creation, not just majority preference; (2) Information aggregation — markets aggregate dispersed information more efficiently than votes; (3) Skin in the game — traders must risk capital on their beliefs, filtering out uninformed voters; (4) First mover — MetaDAO is the first protocol to implement futarchy at scale; (5) Built on Solana — fast and cheap execution enables real-time prediction market trading.",
    metricsRows: [
      ["Market Cap", "[Refer to CoinGecko for latest]", "Small-cap governance token"],
      ["Proposals Passed (Futarchy)", "[Data not available]", "Growing proposal count"],
      ["Total Trading Volume (Futarchy Markets)", "[Data not available]", "Market-based governance activity"],
      ["Community Size", "Small but dedicated", "Quality-focused governance community"],
    ],
    tokenUtility: "META token functions: (1) Governance subject — META is the asset whose price is used to evaluate proposals (pass/fail is determined by expected META price); (2) Trading in conditional markets — META is traded in futarchy prediction markets; (3) Value representation — META represents ownership/participation in the MetaDAO protocol; (4) The token IS the governance mechanism — its price signal is what determines decisions.",
    distributionRows: [
      ["Community", "[TBD]", "Distributed to participants"],
      ["Team", "[TBD]", "Subject to vesting"],
      ["Treasury", "[TBD]", "Protocol development"],
    ],
    circulating: "[Refer to CoinGecko for latest data]",
    maxSupply: "[To be confirmed]",
    inflationRate: "[To be confirmed]",
    upcomingUnlocks: "[Vesting details to be confirmed]",
    valueAccrual: "META accrues value through: (1) Governance utility — META is required to participate in futarchy markets; (2) Good governance — if futarchy makes better decisions than traditional voting, the protocol should grow in value over time; (3) Demand from organizations adopting futarchy — other DAOs could adopt MetaDAO's framework, increasing META demand; (4) Prediction market fees — trading in conditional markets may generate protocol revenue.",
    team: "MetaDAO was created by Proph3t (pseudonymous founder), a developer deeply interested in governance mechanism design and prediction markets. The project draws heavily on the academic work of economist Robin Hanson (George Mason University), who proposed futarchy in 2000 with the motto 'Vote Values, But Bet Beliefs.' The development team is small and focused on governance infrastructure.",
    investors: "[Limited public information on specific institutional investors. MetaDAO has received support from the Solana ecosystem and governance-focused community members.]",
    community: "MetaDAO has a small but intellectually engaged community focused on governance innovation. The project attracts people interested in mechanism design, prediction markets, and improving DAO governance. Active on Twitter and Discord. The community values experimentation and iteration on futarchy mechanisms.",
    risks: [
      { name: "Experimental Mechanism", level: "HIGH", desc: "Futarchy is an unproven governance mechanism at scale. Theoretical critiques include market manipulation, thin markets producing noisy signals, and the difficulty of defining what 'value' the market should optimize for." },
      { name: "Market Manipulation", level: "HIGH", desc: "With a small market cap, conditional markets could be manipulated by well-funded actors who want specific proposals to pass or fail, regardless of their actual merit." },
      { name: "Low Liquidity", level: "HIGH", desc: "Futarchy requires liquid prediction markets to produce meaningful price signals. If few people trade in conditional markets, the governance signal is unreliable." },
      { name: "Adoption Risk", level: "MEDIUM", desc: "Convincing other DAOs to adopt futarchy over familiar voting mechanisms is challenging. Network effects favor established governance tools (Snapshot, Tally)." },
    ],
    catalystRows: [
      ["Futarchy Adoption by Other DAOs", "TBD", "If other projects adopt MetaDAO's framework, demand for META increases"],
      ["Governance Research Validation", "Ongoing", "Academic and practical validation of futarchy improves credibility"],
      ["Solana DAO Ecosystem Growth", "Ongoing", "More Solana DAOs = more potential futarchy adopters"],
      ["Prediction Market Bull Market", "2025-2026", "Growing interest in prediction markets (Polymarket success) benefits futarchy narrative"],
    ],
    sources: [
      "MetaDAO documentation and GitHub",
      "Robin Hanson's futarchy paper ('Shall We Vote on Values, But Bet on Beliefs?', 2000)",
      "Solana ecosystem resources",
      "Prediction market research literature",
    ],
  },
];

async function main() {
  // Create output directories
  const baseDir = __dirname;
  const textDir = "/tmp/research-texts";
  fs.mkdirSync(textDir, { recursive: true });

  const folderMap = {};
  for (const p of protocols) {
    const dir = path.join(baseDir, "01-shortlist", p.folder);
    fs.mkdirSync(dir, { recursive: true });

    // Generate docx
    const doc = buildDoc(p);
    const buffer = await Packer.toBuffer(doc);
    const docxPath = path.join(dir, `${p.filename}.docx`);
    fs.writeFileSync(docxPath, buffer);
    console.log(`✅ Created: ${docxPath}`);

    // Generate text
    const text = buildText(p);
    const textPath = path.join(textDir, `${p.filename}.txt`);
    fs.writeFileSync(textPath, text);
    console.log(`✅ Text: ${textPath}`);

    if (!folderMap[p.folder]) folderMap[p.folder] = [];
    folderMap[p.folder].push(p.filename);
  }

  console.log("\n📊 Summary:");
  for (const [folder, files] of Object.entries(folderMap)) {
    console.log(`  ${folder}/: ${files.join(", ")}`);
  }
  console.log(`\nTotal: ${protocols.length} deep dives generated`);
}

main().catch(err => { console.error(err); process.exit(1); });

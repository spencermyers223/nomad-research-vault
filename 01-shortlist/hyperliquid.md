# Deep Dive: Hyperliquid

**Date Started:** 2026-01-14
**Sector:** Perp DEX / Layer 1
**Status:** Shortlist → Active?

---

## Executive Summary

Hyperliquid is a decentralized perpetual futures exchange built on a purpose-built Layer 1 blockchain, commanding 70%+ market share in on-chain perps. What makes it exceptional: a fully on-chain order book matching CEX performance, no VC funding (self-funded by founder's trading profits), and $843M in 2025 revenue. The HyperEVM ecosystem has grown to $2B TVL in five months. Key risks include validator centralization (16 validators) and emerging competition from Lighter.

---

## Protocol Overview

### What It Does

Hyperliquid is a decentralized exchange specializing in perpetual futures trading — contracts that let traders speculate on asset prices without expiration dates. Unlike AMM-based DEXs (Uniswap model), Hyperliquid runs a **fully on-chain Central Limit Order Book (CLOB)**, mimicking how centralized exchanges work but with self-custody.

Key offerings:
- **170+ perpetual futures markets** with up to 50x leverage
- **Zero gas fees** for trading (absorbed by protocol)
- **Sub-second finality** with 200,000 orders/sec throughput
- **Advanced order types:** stop-loss, take-profit, cross-margin, isolated-margin
- **Spot trading** via on-chain orderbook (zero fees)

### How It Works

**HyperBFT Consensus:** Custom consensus algorithm inspired by Hotstuff, optimized for high-frequency trading. Both algorithm and networking stack built from scratch for exchange demands.

**Two Execution Environments:**

| Component | Function |
|-----------|----------|
| **HyperCore** | Native perps and spot orderbooks. Every order, cancel, trade, liquidation happens on-chain with one-block finality |
| **HyperEVM** | Ethereum-compatible smart contract platform for general-purpose dApps, leveraging HyperCore liquidity |

**Order Matching:** Price-time priority mechanism ensures fair execution. The clearinghouse handles all positions and margin checks at order placement and matching.

### Competitive Landscape

Hyperliquid's rise has been meteoric. In 2023, dYdX held 80%+ market share. By mid-2025, Hyperliquid flipped it to command 70-80%.

| Protocol | Market Share | TVL | Key Differentiator |
|----------|-------------|-----|-------------------|
| **Hyperliquid** | 70%+ | $2B (L1) | On-chain CLOB, own L1, no VC |
| dYdX | ~8% | $300M | Cosmos chain, 100x leverage, 200+ markets |
| GMX | ~5% | $500M | Oracle-based, real yield model |
| Lighter | Growing | - | New competitor, overtook HL in Q1 2026 volume |
| Vertex | ~3% | $150M | Hybrid orderbook-AMM |

**Why Hyperliquid Won:**
- **Speed:** 200k orders/sec vs dYdX's 2k TPS
- **Fees:** 0.01% maker / 0.035% taker (vs dYdX 0.01%/0.05%)
- **UX:** CEX-like experience with DEX custody
- **No VC tokens dumping:** Clean distribution

---

## Tokenomics

### Token Utility

HYPE serves three functions:
1. **Governance:** Voting on protocol decisions
2. **Fee discounts:** Reduced trading fees for holders
3. **Market creation:** Stake 500,000 HYPE to launch new perp markets via HIP-3

### Supply & Distribution

| Category | Allocation | Vesting |
|----------|------------|---------|
| Future Emissions & Community Rewards | 38.89% | Cliff releases over time |
| Genesis Distribution (Airdrop) | 31.00% | Distributed Nov 2024 |
| Core Contributors | 23.80% | 24 months linear, starting Jan 2026 |
| Hyper Foundation Budget | 6.00% | Foundation controlled |
| Community Grants | 0.30% | Ongoing |
| HIP-2: Hyperliquidity | 0.01% | Immediate |

**Current State:**
- Circulating: ~270M HYPE (27% of total)
- Max Supply: 1B HYPE
- Unlocked to date: ~238M (23.84%)

### Inflation/Emissions

**Monthly Team Unlocks:** ~1.2M HYPE/month ($30-33M at current prices) starting January 2026, continuing for 24 months. Unlocks occur on the 6th of each month.

**Net Inflation:** Daily buybacks (~21,700 HYPE) vs staking emissions (~26,700 HYPE) = modest net inflation before monthly unlocks.

**Deflationary Pressures:**
- Approved burn of 37M HYPE (~15% of circulating supply)
- $1B treasury accumulation program for HYPE buybacks
- 99% of perp fees go to Assistance Fund for HYPE buybacks

### Value Accrual

Strong value accrual mechanics:
- **99% of perp fees** → Assistance Fund → HYPE buybacks
- **99% of spot fees** → Assistance Fund → HYPE buybacks
- **Revenue flows to:** HLP liquidity providers, HYPE stakers, ecosystem development
- **HIP-3 staking:** Lock 500k HYPE to create markets, earn fees

---

## On-Chain & Financial Data

### Key Metrics

| Metric | Current | 2025 Full Year | Notes |
|--------|---------|----------------|-------|
| TVL (L1) | ~$2B | - | Top 10 chain, ahead of Avalanche |
| Annual Revenue | - | $843M | #2 chain by revenue behind Solana ($1.3B) |
| Trading Volume | $8.34B daily avg | $2.95T annual | Peak: $32B single day |
| Users | 1.4M cumulative | +609,700 new in 2025 | 4x growth in 2025 |
| DAU | 15-20k | - | HyperEVM transactions: 200-400k/day |
| Open Interest | $1.2B | Peak: $16B | 62% of all perp DEX OI |
| Peak Daily Revenue | $20M | - | July 2025 |

### Revenue Breakdown

| Source | 2025 Revenue |
|--------|-------------|
| Perpetual Contracts | $808M |
| Spot Trading | $35.25M |
| Builder Fees (shared) | $46M |
| Ticker Auctions | ~$1M |
| **Total** | **$843M** |

### Notable On-Chain Activity

- **HyperEVM Growth:** $2B TVL in 5 months since Feb 2025 launch
- **Top dApps:** Felix ($401M TVL), HyperLend ($380M TVL)
- **175+ teams** building on the chain
- Leading blockchain fee rankings in early 2026

---

## Team & Backers

### Core Team

**Jeff Yan (Founder/CEO)**
- Background: Harvard (math/CS), Physics Olympiad gold medalist
- Career: Hudson River Trading (HFT) → Chameleon Trading (crypto market maker)
- Philosophy: Self-funded to avoid VC "scars on the network"

**Co-founder:** Known by handle "iliensinc"

**Team size:** ~11 core contributors (remarkably lean for $6B+ market cap)

### Investors

**None.** This is a defining characteristic.

- Yan funded development with Chameleon Trading profits
- No VC allocations at token launch
- 31% of supply airdropped to early users
- Rationale: "If we're going to build something that's really going to be a credibly neutral platform... a really important principle is to not have insiders."

### Community & Governance

- **Governance:** On-chain voting with HYPE tokens
- **HIP proposals:** Community-driven upgrades (HIP-3 enabled permissionless markets)
- **Validator selection:** Based on testnet performance, no seat buying
- **Foundation Delegation Program:** Supports high-performing validators

---

## Risks

### Protocol Risks

**Validator Centralization (HIGH)**
- Only ~16 validators (vs Ethereum's thousands)
- Bridge vulnerability exposed $2.3B to theoretical risk
- 2/3 consensus = compromising 11 validators could enable unauthorized transactions
- North Korean hackers (Lazarus Group) actively probed validators in late 2024
- Incident caused 30% price drop before mitigation

**Closed-Source Code (MEDIUM)**
- Validators are "mostly blind" to how chain works
- Team says open-sourcing planned "once secure"
- Reduces community auditability

**Smart Contract Risk (MEDIUM)**
- Complex on-chain orderbook logic
- HyperEVM is newer, less battle-tested than Ethereum

### Market Risks

**Competition (MEDIUM-HIGH)**
- Lighter overtook Hyperliquid in Q1 2026 trading volume ($200B vs $165B)
- dYdX, GMX still have loyal users
- Narrative can shift quickly in crypto

**Regulatory Risk (HIGH)**
- Perp DEXs face uncertain regulatory environment
- Could be classified as unregistered derivatives platforms
- US users technically restricted

**Macro/Crypto Risk (MEDIUM)**
- Perp volume correlates with overall crypto activity
- Bear market = significantly lower revenue

### Token Risks

**Unlock Pressure (MEDIUM)**
- 23.8% of supply unlocking over 24 months to team
- ~$30-33M/month sell pressure potential
- Mitigated by burns and buybacks

**High FDV (MEDIUM)**
- $26B FDV is substantial
- Requires continued growth to justify valuation

---

## Catalysts & Timeline

| Catalyst | Expected Date | Impact |
|----------|---------------|--------|
| Monthly team unlocks | 6th of each month | Neutral/Negative - $30M/month |
| 37M HYPE burn execution | 2026 | Positive - 15% of circulating supply |
| $1B treasury HYPE accumulation | Ongoing 2026 | Positive - sustained buy pressure |
| Grayscale HYPE ETF filing | 2026 (pending approval) | High Positive - institutional access |
| Permissionless perp expansion (HIP-3) | Live | Positive - ecosystem growth |
| Validator decentralization roadmap | 2026 | Positive - reduces key risk |
| Open-source code release | TBD | Positive - transparency |

---

## Investment Thesis (Draft)

### Bull Case

**Why this could 3-5x ($75-130):**

1. **Dominant market position consolidates:** 70%+ share in fastest-growing DeFi vertical
2. **HyperEVM becomes major L1:** Already top 10 by TVL, could crack top 5
3. **ETF approval:** Institutional flows into youngest altcoin with ETF
4. **Revenue growth:** $843M in 2025, could exceed $1.5B in 2026 with market expansion
5. **Supply squeeze:** 37M burn + $1B buyback vs minimal team unlocks
6. **No VC overhang:** Unique among major protocols

### Bear Case

**Why this could decline 50%+ (<$13):**

1. **Lighter/competition takes share:** Already overtook in Q1 volume
2. **Validator hack:** 16 validators is genuinely risky, Lazarus already probing
3. **Regulatory crackdown:** US enforcement action against perp DEXs
4. **Team unlocks overwhelm buybacks:** $30M/month is substantial
5. **Crypto bear market:** Perp volume collapses with overall market
6. **FDV already prices in success:** $26B is not cheap

### Base Case

**Most likely outcome ($35-50, 1.5-2x):**

Hyperliquid maintains 50-60% market share as competition intensifies, HyperEVM grows steadily, team unlock pressure is offset by burns/buybacks. No major security incidents. Gradual validator decentralization improves risk profile. ETF approval provides modest institutional interest.

### Position Sizing Thoughts

**Conviction Level:** Medium-High

**Suggested Sizing:** 3-5% of crypto portfolio

**Rationale:** Strong fundamentals and market position, but validator risk and competition emergence warrant position sizing discipline. Not a "max conviction" position due to centralization concerns.

---

## Decision

- [x] Move to Active — building full thesis
- [ ] Hold in Shortlist — waiting for catalyst
- [ ] Archive — passing, reason:

---

**Sources:**
- [CoinGecko - Hyperliquid](https://www.coingecko.com/en/coins/hyperliquid)
- [CoinMarketCap - Hyperliquid](https://coinmarketcap.com/currencies/hyperliquid/)
- [DefiLlama - Hyperliquid L1](https://defillama.com/chain/hyperliquid-l1)
- [DefiLlama - Token Unlocks](https://defillama.com/unlocks/hyperliquid)
- [Tokenomist - HYPE Tokenomics](https://tokenomist.ai/hyperliquid)
- [Fortune - Jeff Yan Profile](https://fortune.com/2026/01/12/hyperliquid-jeff-yan-defi-perpetuals-perps-exchange-defi/)
- [CoinDesk - Decentralization Response](https://www.coindesk.com/tech/2025/01/08/the-protocol-hyperliquid-responds-to-decentralization-criticism)
- [The Defiant - TVL Growth](https://thedefiant.io/news/blockchains/hyperliquid-layer-1-gains-traction-as-tvl-grows-to-usd2-billion)
- [Blockworks - Felix & HyperLend](https://app.blockworksresearch.com/unlocked/felix-and-hyperlend-hyperliquid-lending-ecosystem)
- [Bitget News - 2025 Revenue](https://www.bitget.com/news/detail/12560605123555)
- [NFT Evening - Competitive Analysis](https://nftevening.com/hyperliquid-dydx-aevo-gmx/)

**Time spent:** ~2 hours

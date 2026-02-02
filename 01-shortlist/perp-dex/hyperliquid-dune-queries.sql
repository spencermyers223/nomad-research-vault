-- Hyperliquid Dune Queries
-- Generated: 2026-02-02
-- Note: Hyperliquid runs on its own L1, so standard Dune tables don't cover it.
-- Use Hyperliquid's API or their stats page for metrics.

-- ============================================
-- IMPORTANT: HYPERLIQUID IS NOT IN DUNE
-- ============================================
-- Hyperliquid operates on its own custom L1 blockchain (HyperBFT),
-- not on Ethereum, Arbitrum, or other EVM chains.
-- Therefore, Dune Analytics does not have direct access to Hyperliquid data.

-- Alternative Data Sources:
-- 1. Hyperliquid Stats: https://app.hyperliquid.xyz/stats
-- 2. Hyperliquid API: https://api.hyperliquid.xyz/info
-- 3. DefiLlama API: https://api.llama.fi/protocol/hyperliquid
-- 4. HyperDash (Community): https://hyperdash.info

-- ============================================
-- SAMPLE API CALLS (via curl)
-- ============================================

-- Get 24h volume:
-- curl -X POST https://api.hyperliquid.xyz/info -H "Content-Type: application/json" -d '{"type": "metaAndAssetCtxs"}'

-- Get funding rates:
-- curl -X POST https://api.hyperliquid.xyz/info -H "Content-Type: application/json" -d '{"type": "fundingHistory", "coin": "BTC", "startTime": 1706745600000}'

-- ============================================
-- DEFILLAMA API QUERIES (Alternative)
-- ============================================

-- These can be run via curl or in a script:

-- Get current TVL:
-- curl https://api.llama.fi/tvl/hyperliquid

-- Get historical TVL:
-- curl https://api.llama.fi/protocol/hyperliquid

-- ============================================
-- IF HYPERLIQUID DATA BECOMES AVAILABLE IN DUNE
-- ============================================
-- Template queries for future use:

-- Daily Volume (when available)
/*
SELECT
    DATE_TRUNC('day', block_time) as date,
    SUM(volume_usd) as daily_volume,
    COUNT(*) as trade_count,
    COUNT(DISTINCT trader) as unique_traders
FROM hyperliquid.trades -- hypothetical table
WHERE block_time >= CURRENT_DATE - INTERVAL '30' DAY
GROUP BY 1
ORDER BY 1 DESC;
*/

-- Open Interest by Asset
/*
SELECT
    asset,
    SUM(open_interest_usd) as total_oi
FROM hyperliquid.positions -- hypothetical table
WHERE snapshot_time = (SELECT MAX(snapshot_time) FROM hyperliquid.positions)
GROUP BY asset
ORDER BY total_oi DESC;
*/

-- Top Traders by Volume
/*
SELECT
    trader,
    SUM(volume_usd) as total_volume,
    COUNT(*) as trade_count
FROM hyperliquid.trades -- hypothetical table
WHERE block_time >= CURRENT_DATE - INTERVAL '7' DAY
GROUP BY trader
ORDER BY total_volume DESC
LIMIT 100;
*/

-- ============================================
-- RECOMMENDATION
-- ============================================
-- For Hyperliquid metrics, use:
-- 1. Their official stats page (real-time)
-- 2. DefiLlama API (daily aggregates)
-- 3. HyperDash community dashboards
-- 4. Direct API calls for specific data needs

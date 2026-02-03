-- ═══════════════════════════════════════════════════════════════════
-- PENDLE FINANCE - DUNE ANALYTICS QUERIES
-- Protocol: Pendle | Category: Yield Tokenization
-- Generated: 2026-02-03
-- ═══════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- QUERY 1: Daily Trading Volume (Ethereum)
-- Tracks swap volume on Pendle AMM
-- ═══════════════════════════════════════════════════════════════════
WITH pendle_swaps AS (
    SELECT 
        DATE_TRUNC('day', block_time) AS day,
        SUM(amount_usd) AS volume_usd
    FROM dex.trades
    WHERE project = 'pendle'
        AND blockchain = 'ethereum'
        AND block_time >= NOW() - INTERVAL '90' day
    GROUP BY 1
)
SELECT 
    day,
    volume_usd,
    AVG(volume_usd) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS volume_7d_ma
FROM pendle_swaps
ORDER BY day DESC;


-- ═══════════════════════════════════════════════════════════════════
-- QUERY 2: TVL by Pool (Top Markets)
-- Shows liquidity distribution across Pendle markets
-- ═══════════════════════════════════════════════════════════════════
SELECT 
    market_name,
    underlying_asset,
    maturity_date,
    tvl_usd,
    pt_price,
    implied_apy,
    pool_created_at
FROM query_pendle_markets -- Reference Pendle's official Dune tables
WHERE tvl_usd > 1000000
ORDER BY tvl_usd DESC
LIMIT 20;


-- ═══════════════════════════════════════════════════════════════════
-- QUERY 3: vePENDLE Staking Metrics
-- Track vePENDLE locks and distribution
-- ═══════════════════════════════════════════════════════════════════
WITH vependle_locks AS (
    SELECT 
        DATE_TRUNC('day', evt_block_time) AS day,
        SUM(CAST(value AS DECIMAL(38,0)) / 1e18) AS pendle_locked,
        COUNT(DISTINCT "from") AS unique_lockers
    FROM erc20_ethereum.evt_Transfer
    WHERE contract_address = 0x808507121b80c02388fad14726482e061b8da827 -- PENDLE token
        AND "to" = 0x4f30A9D41B80ecC5B94306AB4364951AE3170210 -- vePENDLE contract
        AND evt_block_time >= NOW() - INTERVAL '180' day
    GROUP BY 1
)
SELECT 
    day,
    pendle_locked,
    unique_lockers,
    SUM(pendle_locked) OVER (ORDER BY day) AS cumulative_locked
FROM vependle_locks
ORDER BY day DESC;


-- ═══════════════════════════════════════════════════════════════════
-- QUERY 4: Protocol Revenue & Fees
-- Tracks fee generation from Pendle markets
-- ═══════════════════════════════════════════════════════════════════
SELECT 
    DATE_TRUNC('week', block_time) AS week,
    SUM(fee_usd) AS weekly_fees,
    SUM(SUM(fee_usd)) OVER (ORDER BY DATE_TRUNC('week', block_time)) AS cumulative_fees
FROM pendle_ethereum.fees -- Assuming Pendle decoded tables exist
WHERE block_time >= NOW() - INTERVAL '365' day
GROUP BY 1
ORDER BY week DESC;


-- ═══════════════════════════════════════════════════════════════════
-- QUERY 5: Cross-Chain TVL Comparison
-- Compare Pendle TVL across different chains
-- ═══════════════════════════════════════════════════════════════════
SELECT 
    blockchain,
    COUNT(DISTINCT market_address) AS num_markets,
    SUM(tvl_usd) AS total_tvl,
    SUM(volume_24h_usd) AS daily_volume
FROM (
    SELECT 'ethereum' AS blockchain, market_address, tvl_usd, volume_24h_usd 
    FROM query_pendle_ethereum_markets
    UNION ALL
    SELECT 'arbitrum' AS blockchain, market_address, tvl_usd, volume_24h_usd 
    FROM query_pendle_arbitrum_markets
    UNION ALL
    SELECT 'base' AS blockchain, market_address, tvl_usd, volume_24h_usd 
    FROM query_pendle_base_markets
)
GROUP BY blockchain
ORDER BY total_tvl DESC;

-- ═══════════════════════════════════════════════════════════════════
-- NOTES:
-- - Pendle has official Dune tables: @pendle team maintains decoded data
-- - Check https://dune.com/pendle for official dashboards
-- - Key contracts:
--   * PENDLE Token (ETH): 0x808507121b80c02388fad14726482e061b8da827
--   * vePENDLE (ETH): 0x4f30A9D41B80ecC5B94306AB4364951AE3170210
--   * Router V3 (ETH): 0x00000000005BBB0EF59571E58418F9a4357b68A0
-- ═══════════════════════════════════════════════════════════════════

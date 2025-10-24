-- Create dataset
CREATE SCHEMA IF NOT EXISTS ecogrid_dwh
OPTIONS(
  location="us-central1",
  description="EcoGridIQ data warehouse"
);

-- Raw readings table
CREATE OR REPLACE TABLE ecogrid_dwh.raw_readings (
  device_id STRING NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  power_w FLOAT64,
  energy_wh FLOAT64,
  voltage FLOAT64,
  temp_c FLOAT64,
  occupancy BOOL,
  source STRING,
  ingest_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(timestamp)
CLUSTER BY device_id;

-- Hourly aggregation
CREATE OR REPLACE TABLE ecogrid_dwh.analytics_hourly AS
SELECT
  device_id,
  TIMESTAMP_TRUNC(timestamp, HOUR) AS hour_ts,
  AVG(power_w) AS avg_power_w,
  MAX(power_w) AS max_power_w,
  MIN(power_w) AS min_power_w,
  STDDEV(power_w) AS stddev_power_w,
  SUM(energy_wh) AS total_wh,
  COUNT(*) AS reading_count
FROM ecogrid_dwh.raw_readings
GROUP BY device_id, hour_ts;

-- Anomalies view
CREATE OR REPLACE VIEW ecogrid_dwh.anomalies AS
WITH windowed AS (
  SELECT
    device_id,
    timestamp,
    power_w,
    AVG(power_w) OVER (
      PARTITION BY device_id 
      ORDER BY UNIX_SECONDS(timestamp) 
      RANGE BETWEEN 172800 PRECEDING AND CURRENT ROW
    ) AS rolling_mean,
    STDDEV(power_w) OVER (
      PARTITION BY device_id 
      ORDER BY UNIX_SECONDS(timestamp)
      RANGE BETWEEN 172800 PRECEDING AND CURRENT ROW
    ) AS rolling_std
  FROM ecogrid_dwh.raw_readings
)
SELECT 
  device_id,
  timestamp,
  power_w,
  rolling_mean,
  (power_w - rolling_mean) / NULLIF(rolling_std, 0) AS zscore,
  CASE 
    WHEN ABS((power_w - rolling_mean) / NULLIF(rolling_std, 0)) > 3 THEN 'HIGH'
    WHEN ABS((power_w - rolling_mean) / NULLIF(rolling_std, 0)) > 2 THEN 'MEDIUM'
    ELSE 'NORMAL'
  END AS severity
FROM windowed
WHERE ABS((power_w - rolling_mean) / NULLIF(rolling_std, 0)) > 2
ORDER BY timestamp DESC;

-- Import script for NeighborhoodSegment data
-- This assumes you're using SQLite and have the CSV file ready
-- Run this after creating the schema

.mode csv
.import rtp_suburb_types_v0.csv NeighborhoodSegment_temp

-- Map CSV columns to table columns
INSERT INTO NeighborhoodSegment (
    geoid,
    county,
    name,
    lat,
    lon,
    distToRaleighMi,
    distToDurhamMi,
    distToChapelHillMi,
    dominantCity,
    popDensity,
    suburbType
)
SELECT 
    geoid,
    county,
    name,
    lat,
    lon,
    dist_to_raleigh_mi,
    dist_to_durham_mi,
    dist_to_chapelhill_mi,
    dominant_city,
    pop_density,
    suburb_type
FROM NeighborhoodSegment_temp;

DROP TABLE NeighborhoodSegment_temp;


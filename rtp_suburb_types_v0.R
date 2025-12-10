#!/usr/bin/env Rscript

library(dplyr)
library(sf)
library(tidycensus)
library(readr)

# Parameters
rtp_counties <- c("Wake", "Durham", "Orange")
target_year <- 2022

# Core city coordinates (lon, lat in EPSG:4326)
raleigh_ll <- c(-78.6382, 35.7796)
durham_ll <- c(-78.8986, 35.9940)
chapelhill_ll <- c(-79.0558, 35.9132)

# Helper to convert meters to miles and drop units
m_to_mi <- function(meters) as.numeric(meters) * 0.000621371

# Download tracts with geometry
tracts_raw <- get_acs(
  geography = "tract",
  variables = "B01003_001",
  survey = "acs5",
  year = target_year,
  state = "NC",
  county = rtp_counties,
  geometry = TRUE
)

# Clean and compute derived fields
tracts <- tracts_raw %>%
  transmute(
    geoid = GEOID,
    name = NAME,
    county = sub(".*, ([^,]+) County.*", "\\1", NAME),
    total_pop = estimate,
    geometry = geometry
  ) %>%
  st_transform(3857) %>%
  mutate(
    area_mi2 = as.numeric(st_area(geometry)) * 3.86102e-7,
    pop_density = total_pop / area_mi2,
    centroid_3857 = st_centroid(geometry)
  ) %>%
  mutate(
    centroid_4326 = st_transform(centroid_3857, 4326),
    coords = st_coordinates(centroid_4326),
    lon = coords[, 1],
    lat = coords[, 2]
  ) %>%
  select(-coords)

# Distance calculations (miles)
tracts <- tracts %>%
  mutate(
    dist_to_raleigh_mi = m_to_mi(st_distance(centroid_4326, st_sfc(st_point(raleigh_ll), crs = 4326))),
    dist_to_durham_mi = m_to_mi(st_distance(centroid_4326, st_sfc(st_point(durham_ll), crs = 4326))),
    dist_to_chapelhill_mi = m_to_mi(st_distance(centroid_4326, st_sfc(st_point(chapelhill_ll), crs = 4326)))
  )

# Assign dominant city (closest core)
tracts <- tracts %>%
  mutate(
    dominant_city = c("Raleigh", "Durham", "Chapel Hill")[
      max.col(-cbind(dist_to_raleigh_mi, dist_to_durham_mi, dist_to_chapelhill_mi), ties.method = "first")
    ],
    suburb_type = case_when(
      (dist_to_raleigh_mi < 7 | dist_to_durham_mi < 7 | dist_to_chapelhill_mi < 5) & pop_density >= 2000 ~ "Inner-Ring Suburb",
      dist_to_raleigh_mi > 20 & dist_to_durham_mi > 20 & dist_to_chapelhill_mi > 20 & pop_density < 1000 ~ "Exurban Suburb",
      TRUE ~ "General Suburb"
    )
  )

# Final output without geometry
out <- tracts %>%
  st_drop_geometry() %>%
  select(
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
  )

write_csv(out, "rtp_suburb_types_v0.csv")

message("Wrote rtp_suburb_types_v0.csv with ", nrow(out), " rows.")


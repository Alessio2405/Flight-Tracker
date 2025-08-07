
// From OpenSky API: [icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, baro_altitude, on_ground, velocity, true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source]
export type StateVector = [
  string,
  string | null,
  string,
  number | null,
  number,
  number | null,
  number | null,
  number | null,
  boolean,
  number | null,
  number | null,
  number | null,
  number[] | null,
  number | null,
  string | null,
  boolean,
  number
];

export interface Flight {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  geo_altitude: number | null;
}

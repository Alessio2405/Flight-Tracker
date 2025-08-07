
import type { Flight, StateVector } from '../types';

const API_URL = 'https://opensky-network.org/api/states/all';

const mapStateVectorToFlight = (sv: StateVector): Flight => ({
  icao24: sv[0],
  callsign: sv[1] ? sv[1].trim() : 'N/A',
  origin_country: sv[2],
  longitude: sv[5],
  latitude: sv[6],
  baro_altitude: sv[7],
  on_ground: sv[8],
  velocity: sv[9],
  true_track: sv[10],
  vertical_rate: sv[11],
  geo_altitude: sv[13],
});

export const fetchFlights = async (): Promise<Flight[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from OpenSky Network: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.states) {
      return [];
    }
    const flights: Flight[] = data.states
      .filter((sv: StateVector) => sv[5] !== null && sv[6] !== null) // Filter out flights with no coordinates
      .slice(0, 500) // Limit to 500 aircraft for performance
      .map(mapStateVectorToFlight);
    return flights;
  } catch (error) {
    console.error("Error fetching flights:", error);
    throw error;
  }
};

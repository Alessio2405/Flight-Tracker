import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Flight } from './types';
import { fetchFlights } from './services/opensky';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapComponent from './components/MapComponent';

// Custom hook for intervals
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void | null>(null);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const App: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [watchlistIcaos, setWatchlistIcaos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('flight_tracker_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
      return [];
    }
  });
  
  const [selectedFlightIcao, setSelectedFlightIcao] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const updateFlights = useCallback(async () => {
    try {
      setError(null);
      const fetchedFlights = await fetchFlights();
      setFlights(fetchedFlights);
    } catch (err) {
      setError('Could not fetch flight data. The service might be temporarily unavailable.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(updateFlights, 15000);

  useEffect(() => {
    localStorage.setItem('flight_tracker_watchlist', JSON.stringify(watchlistIcaos));
  }, [watchlistIcaos]);

  const addToWatchlist = (flight: Flight) => {
    if (!watchlistIcaos.includes(flight.icao24)) {
      setWatchlistIcaos([...watchlistIcaos, flight.icao24]);
    }
  };

  const removeFromWatchlist = (icao24: string) => {
    setWatchlistIcaos(watchlistIcaos.filter(id => id !== icao24));
    if (selectedFlightIcao === icao24) {
      setSelectedFlightIcao(null);
    }
  };

  const handleSelectFlight = (flight: Flight | null) => {
    setSelectedFlightIcao(flight ? flight.icao24 : null);
  };

  const watchlist = useMemo(() => {
    const flightMap = new Map(flights.map(f => [f.icao24, f]));
    return watchlistIcaos.map(icao => flightMap.get(icao)).filter((f): f is Flight => f !== undefined);
  }, [flights, watchlistIcaos]);

  const selectedFlight = useMemo(() => {
    return flights.find(f => f.icao24 === selectedFlightIcao) || null;
  }, [flights, selectedFlightIcao]);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    return flights.filter(f => f.callsign?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [flights, searchTerm]);
  
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-row overflow-hidden">
        <Sidebar
            watchlist={watchlist}
            searchResults={searchResults}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onAddToWatchlist={addToWatchlist}
            onRemoveFromWatchlist={removeFromWatchlist}
            onSelectFlight={handleSelectFlight}
            selectedFlightIcao={selectedFlightIcao}
            watchlistIcaos={watchlistIcaos}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="relative flex-grow h-full w-full">
            {loading && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-20">
                    <div className="text-center">
                        <svg className="animate-spin h-10 w-10 text-cyan-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg">Fetching live flight data...</p>
                    </div>
                </div>
            )}
            {error && !loading && (
                <div className="absolute inset-0 bg-red-900 bg-opacity-75 flex items-center justify-center z-20">
                    <div className="text-center">
                         <p className="text-lg font-semibold">An Error Occurred</p>
                         <p>{error}</p>
                         <button onClick={updateFlights} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">Try Again</button>
                    </div>
                </div>
            )}
            <MapComponent 
                flights={flights} 
                selectedFlight={selectedFlight}
                onSelectFlight={handleSelectFlight}
                isSidebarOpen={isSidebarOpen}
            />
        </div>
      </main>
    </div>
  );
};

export default App;
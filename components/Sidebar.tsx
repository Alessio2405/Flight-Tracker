import React from 'react';
import type { Flight } from '../types';
import { SearchIcon, AddIcon, RemoveIcon, SpeedIcon, AltitudeIcon, CompassIcon, VerticalSpeedIcon, ChevronLeftIcon } from './icons';

interface SidebarProps {
  watchlist: Flight[];
  searchResults: Flight[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onAddToWatchlist: (flight: Flight) => void;
  onRemoveFromWatchlist: (icao24: string) => void;
  onSelectFlight: (flight: Flight | null) => void;
  selectedFlightIcao: string | null;
  watchlistIcaos: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const FlightInfo = ({ flight }: { flight: Flight }) => {
    const verticalRate = flight.vertical_rate;
    let verticalRateDisplay;
    if (verticalRate !== null) {
        const rate = Math.round(verticalRate);
        if (rate > 0.5) verticalRateDisplay = `▲ ${rate} m/s`;
        else if (rate < -0.5) verticalRateDisplay = `▼ ${Math.abs(rate)} m/s`;
        else verticalRateDisplay = `→ 0 m/s`;
    } else {
        verticalRateDisplay = 'N/A';
    }

    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mt-2 text-gray-400">
            <div className="flex items-center space-x-1 truncate">
                <SpeedIcon className="w-4 h-4 flex-shrink-0" />
                <span>{flight.velocity ? `${Math.round(flight.velocity * 3.6)} km/h` : 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1 truncate">
                <AltitudeIcon className="w-4 h-4 flex-shrink-0" />
                <span>{flight.baro_altitude ? `${Math.round(flight.baro_altitude)} m` : 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1 truncate">
                <CompassIcon className="w-4 h-4 flex-shrink-0" />
                <span>{flight.true_track ? `${Math.round(flight.true_track)}°` : 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1 truncate">
                <VerticalSpeedIcon className="w-4 h-4 flex-shrink-0" />
                <span>{verticalRateDisplay}</span>
            </div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ 
    watchlist, searchResults, searchTerm, onSearchTermChange, 
    onAddToWatchlist, onRemoveFromWatchlist, onSelectFlight, 
    selectedFlightIcao, watchlistIcaos, isOpen, onToggle
}) => {

  const handleSelect = (flight: Flight) => {
    if (selectedFlightIcao === flight.icao24) {
      onSelectFlight(null);
    } else {
      onSelectFlight(flight);
    }
  }

  const renderFlightItem = (flight: Flight, isWatchlistItem: boolean) => {
    const isSelected = selectedFlightIcao === flight.icao24;
    return (
        <div key={flight.icao24}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-cyan-500/20 ring-1 ring-cyan-400' : 'bg-gray-700/50 hover:bg-gray-700'}`}
            onClick={() => handleSelect(flight)}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-white truncate">{flight.callsign || 'Unknown'}</p>
                    <p className="text-sm text-gray-400">{flight.origin_country}</p>
                </div>
                {isWatchlistItem ? (
                    <button onClick={(e) => { e.stopPropagation(); onRemoveFromWatchlist(flight.icao24); }} 
                            className="p-1 rounded-full text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0">
                        <RemoveIcon className="w-6 h-6" />
                    </button>
                ) : (
                    <button onClick={(e) => { e.stopPropagation(); onAddToWatchlist(flight); }} 
                            className="p-1 rounded-full text-green-400 hover:bg-green-500/20 transition-colors flex-shrink-0"
                            disabled={watchlistIcaos.includes(flight.icao24)}>
                        <AddIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
            <FlightInfo flight={flight} />
        </div>
    );
  }

  return (
    <div className={`relative z-30 flex-shrink-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-[380px]' : 'w-0'}`}>
        <aside className="bg-gray-800 text-gray-200 flex flex-col h-full w-full overflow-hidden">
            <div className={`p-4 flex flex-col space-y-4 overflow-y-auto h-full w-[380px] transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                <div>
                    <h2 className="text-lg font-semibold mb-2">Search Flights</h2>
                    <div className="relative">
                    <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by callsign..."
                        value={searchTerm}
                        onChange={(e) => onSearchTermChange(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    </div>
                </div>

                {searchTerm ? (
                    <div className="flex flex-col space-y-2">
                        <h3 className="text-md font-semibold mb-1">Search Results ({searchResults.length})</h3>
                        <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto pr-2">
                            {searchResults.length > 0 ? searchResults.map(flight => renderFlightItem(flight, false)) : <p className="text-gray-400 text-sm">No flights found.</p>}
                        </div>
                    </div>
                ) : null}

                <div className="flex-grow flex flex-col min-h-0">
                    <h2 className="text-lg font-semibold mb-2">Watchlist ({watchlist.length})</h2>
                    <div className="flex flex-col space-y-2 flex-grow overflow-y-auto pr-2">
                    {watchlist.length > 0 ? (
                        watchlist.map(flight => renderFlightItem(flight, true))
                    ) : (
                        <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-400 text-sm text-center">Your watchlist is empty. <br/> Search for flights to add them.</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </aside>
        <button
            onClick={onToggle}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={`absolute top-1/2 bg-gray-700 hover:bg-cyan-500 text-white p-1 rounded-full z-40 shadow-lg transition-all duration-300 -translate-y-1/2 ${isOpen ? 'left-full -translate-x-1/2' : 'left-full ml-1'}`}
        >
            <ChevronLeftIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
        </button>
    </div>
  );
};

export default Sidebar;
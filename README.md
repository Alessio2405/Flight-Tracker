# Live Flight Tracker

A web application that allows users to visualize live flight data on an interactive map, build and maintain a personalized watchlist of flights, and receive real-time updates for tracked flights.

<img width="1659" height="987" alt="flight_tracker" src="https://github.com/user-attachments/assets/5fad5048-8b36-44b9-b631-2b79911709f5" />


## ✨ Features

*   **Live Map View**: Displays up to 500 aircraft on a dark-themed, interactive Leaflet map.
*   **Flight Selection**: Click on any aircraft to see its flight path highlighted and view detailed information.
*   **Search Functionality**: Instantly find specific flights by their callsign.
*   **Personalized Watchlist**: Add flights you're interested in to a persistent watchlist.
*   **Real-time Details**: See live data for selected flights, including speed, altitude, heading, and vertical speed.
*   **Responsive Design**: A collapsible sidebar allows for a fullscreen map view.
*   **Persistent State**: Your watchlist is saved in your browser's local storage.




## 🛠️ Tech Stack

*   **Frontend**: React.js, TypeScript
*   **Styling**: TailwindCSS
*   **Mapping**: Leaflet & React-Leaflet
*   **Live Data**: [OpenSky Network API](https://opensky-network.org/apidoc/rest.html)

### ⚠️ Important Note on Data Source

This application fetches data directly from the OpenSky Network API in the browser. As the API does not provide the necessary CORS headers for direct browser access, all requests are routed through a free, public CORS proxy: `api.allorigins.win`.

This has two implications:
1.  The application's functionality is dependent on the availability and performance of this third-party proxy.
2.  The proxy has its own rate limits. To respect these limits, data is fetched every 60 seconds.

For a production environment, it would be recommended to create a dedicated backend service to act as a proxy and cache layer.

## 🚀 Getting Started

This project is set up to run directly in a browser that supports ES modules and `importmap`.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Alessio2405/Flight-Tracker.git
    cd live-flight-tracker
    ```

2.  **Open `index.html`:**
    You can open the `index.html` file directly in your web browser. For the best experience, serve the file using a simple local server to avoid potential issues with file pathing.
    
    If you have Python installed:
    ```bash
    # For Python 3
    python -m http.server
    ```
    Then, navigate to `http://localhost:8000` in your browser.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import useSwr from "swr";
import "./App.css";

const fetcher = (...args) => fetch(...args).then((response) => response.json());

function App() {
  const ulykkerUrl = "/api/ulykker";
  const { data, error } = useSwr(ulykkerUrl, { fetcher });
  const ulykker = data && !error ? data : [];

  return (
    <Map center={[63.430515, 10.395053]} zoom={12}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {ulykker
        .filter((ulykke) => ulykke.koordinater != null)
        .map((ulykke) => (
          <Marker
            key={ulykke.id}
            position={[ulykke.koordinater.lat, ulykke.koordinater.lon]}
          />
        ))}
    </Map>
  );
}

export default App;

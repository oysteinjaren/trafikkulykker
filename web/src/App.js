import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import "./App.css";

function App() {
  return (
    <Map center={[63.430515, 10.395053]} zoom={12}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
    </Map>
  );
}

export default App;

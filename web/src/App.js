import React, { useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import "./App.css";

import Ulykker from "./components/Ulykker";

function App() {
  const [måLasteData, setMåLasteData] = useState(true);

  return (
    <Map
      center={[63.430515, 10.395053]}
      zoom={12}
      onmoveend={() => {
        setMåLasteData(true);
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Ulykker
        måLasteData={måLasteData}
        nullstillMåLasteData={() => setMåLasteData(false)}
      ></Ulykker>
    </Map>
  );
}

export default App;

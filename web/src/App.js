import React from "react";
import { Map, TileLayer } from "react-leaflet";
import "./App.css";

import Ulykker from "./components/Ulykker";

function App() {
  return (
    <Map center={[63.430515, 10.395053]} zoom={12}>
      <TileLayer
        url="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}"
        attribution="<a href='https://www.kartverket.no/'>Kartverket</a>"
      />
      <Ulykker></Ulykker>
    </Map>
  );
}

export default App;

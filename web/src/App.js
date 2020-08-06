import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import useSwr from "swr";
import "./App.css";

const fetcher = (...args) => fetch(...args).then((response) => response.json());

function App() {
  const ulykkerUrl = "/api/ulykker";
  const { data, error } = useSwr(ulykkerUrl, { fetcher });
  const ulykker = data && !error ? data : [];

  const [aktivUlykke, setAktivUlykke] = React.useState(null);

  function hentUlykkeIkon(alvorlighetsgrad) {
    var sti = "";
    switch (alvorlighetsgrad) {
      case "USKADET":
        sti = "/images/marker-icon-green.png";
        break;
      case "LETTERESKADET":
        sti = "/images/marker-icon-yellow.png";
        break;
      case "ALVORLIGSKADET":
        sti = "/images/marker-icon-orange.png";
        break;
      case "MEGETALVORLIGSKADET":
        sti = "/images/marker-icon-red.png";
        break;
      case "DREPT":
        sti = "/images/marker-icon-black.png";
        break;
      default:
        sti = "/images/marker-icon-gray.png";
        break;
    }
    return new Icon({
      iconUrl: sti,
    });
  }

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
            icon={hentUlykkeIkon(ulykke.alvorlighetsgrad)}
            onclick={() => {
              setAktivUlykke(ulykke);
            }}
          />
        ))}
      {aktivUlykke && (
        <Popup
          position={[aktivUlykke.koordinater.lat, aktivUlykke.koordinater.lon]}
          onClose={() => {
            setAktivUlykke(null);
          }}
        >
          <div>
            <h2>{aktivUlykke.ulykkesdato}</h2>
            <p>{aktivUlykke.alvorlighetsgrad}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default App;

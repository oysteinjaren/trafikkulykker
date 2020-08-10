import React from "react";
import { Marker, Popup, useLeaflet } from "react-leaflet";
import { Icon } from "leaflet";
import useSwr from "swr";

function Ulykker() {
  const { map } = useLeaflet();
  const bounds = map.getBounds();
  const ulykkerUrl = `/api/ulykker?vest=${bounds._southWest.lng}&soer=${bounds._southWest.lat}&oest=${bounds._northEast.lng}&nord=${bounds._northEast.lat}`;
  const fetcher = (...args) =>
    fetch(...args).then((response) => response.json());
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
      iconSize: [25, 41],
      iconAnchor: [12, 40],
    });
  }

  return (
    <div>
      {ulykker &&
        ulykker
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
    </div>
  );
}

export default Ulykker;

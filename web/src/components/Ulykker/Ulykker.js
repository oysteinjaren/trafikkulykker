import React, { useState, useEffect } from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useLeafletBounds } from "use-leaflet";
import { Icon } from "leaflet";
import UlykkePopup from "../UlykkePopup";
import hentUlykker from "../../api/hentUlykker";

function Ulykker() {
  const [[sør, vest], [nord, øst]] = useLeafletBounds();

  const [ulykker, setUlykker] = useState([]);
  const [aktivUlykke, setAktivUlykke] = React.useState(null);

  useEffect(() => {
    (async () => {
      const hentedeUlykker = await hentUlykker(vest, sør, øst, nord);
      setUlykker(hentedeUlykker.filter((ulykke) => ulykke.koordinater != null));
    })();
  }, [vest, sør, øst, nord]);

  function hentUlykkeIkon(alvorlighetsgrad) {
    var sti = "";
    switch (alvorlighetsgrad) {
      case "Uskadd":
        sti = "images/marker-icon-green.png";
        break;
      case "Lettere skadd":
        sti = "images/marker-icon-yellow.png";
        break;
      case "Alvorlig skadd":
        sti = "images/marker-icon-orange.png";
        break;
      case "Meget alvorlig skadd":
        sti = "images/marker-icon-red.png";
        break;
      case "Drept":
        sti = "images/marker-icon-black.png";
        break;
      default:
        sti = "images/marker-icon-gray.png";
        break;
    }
    return new Icon({
      iconUrl: sti,
      iconSize: [25, 41],
      iconAnchor: [12, 40],
    });
  }

  return (
    <MarkerClusterGroup>
      {ulykker &&
        ulykker.map((ulykke) => (
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
        <UlykkePopup
          aktivUlykke={aktivUlykke}
          onClose={() => {
            setAktivUlykke(null);
          }}
        ></UlykkePopup>
      )}
    </MarkerClusterGroup>
  );
}

export default Ulykker;

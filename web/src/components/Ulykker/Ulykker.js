import React, { useState, useEffect } from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useLeafletBounds } from "use-leaflet";
import { Icon } from "leaflet";
import axios from "axios";
import UlykkePopup from "../UlykkePopup";

function Ulykker() {
  const [[sør, vest], [nord, øst]] = useLeafletBounds();

  const [ulykker, setUlykker] = useState([]);
  const ulykkerUrl = "/api/ulykker";
  const [aktivUlykke, setAktivUlykke] = React.useState(null);

  useEffect(() => {
    const hentUlykker = async () => {
      const response = await axios.get(ulykkerUrl, {
        params: {
          vest: vest,
          sør: sør,
          øst: øst,
          nord: nord,
        },
      });
      console.log(`Hentet ${response.data.length} ulykker`);
      setUlykker(response.data.filter((ulykke) => ulykke.koordinater != null));
    };
    hentUlykker();
  }, [vest, sør, øst, nord]);

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

import React, { useState, useEffect } from "react";
import { Marker, useLeaflet } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Icon } from "leaflet";
import axios from "axios";
import UlykkePopup from "../UlykkePopup";

function Ulykker(props) {
  const { map } = useLeaflet();
  const bounds = map.getBounds();

  const [avgrensningsboks, setAvgrensningsboks] = useState({});

  if (
    bounds._southWest.lng !== avgrensningsboks.vest ||
    bounds._southWest.lat !== avgrensningsboks.sør ||
    bounds._northEast.lng !== avgrensningsboks.øst ||
    bounds._northEast.lat !== avgrensningsboks.nord
  ) {
    setAvgrensningsboks({
      vest: bounds._southWest.lng,
      sør: bounds._southWest.lat,
      øst: bounds._northEast.lng,
      nord: bounds._northEast.lat,
    });
  }

  const måLasteData = props.måLasteData;
  const nullstillMåLasteData = props.nullstillMåLasteData;

  const [ulykker, setUlykker] = useState([]);
  const ulykkerUrl = "/api/ulykker";
  useEffect(() => {
    const hentUlykker = async () => {
      const response = await axios.get(ulykkerUrl, {
        params: avgrensningsboks,
      });
      console.log(`Hentet ${response.data.length} ulykker`);
      setUlykker(response.data);
    };
    if (måLasteData) {
      hentUlykker();
      nullstillMåLasteData();
    }
  }, [avgrensningsboks, måLasteData, nullstillMåLasteData]);

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
    <MarkerClusterGroup>
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
        <UlykkePopup
          aktivUlykke={aktivUlykke}
          onClose={() => setAktivUlykke(null)}
        ></UlykkePopup>
      )}
    </MarkerClusterGroup>
  );
}

export default Ulykker;

import React, { useState, useEffect } from "react";
import { Marker, Popup, useLeaflet } from "react-leaflet";
import { Icon } from "leaflet";
import axios from "axios";

function Ulykker(props) {
  const { map } = useLeaflet();
  const bounds = map.getBounds();

  const [avgrensningsboks, setAvgrensningsboks] = useState({});

  if (
    bounds._southWest.lng !== avgrensningsboks.vest ||
    bounds._southWest.lat !== avgrensningsboks.soer ||
    bounds._northEast.lng !== avgrensningsboks.oest ||
    bounds._northEast.lat !== avgrensningsboks.nord
  ) {
    setAvgrensningsboks({
      vest: bounds._southWest.lng,
      soer: bounds._southWest.lat,
      oest: bounds._northEast.lng,
      nord: bounds._northEast.lat,
    });
  }
  const [ulykker, setUlykker] = useState([]);

  const måLasteData = props.måLasteData;
  const nullstillMåLasteData = props.nullstillMåLasteData;

  const ulykkerUrl = "/api/ulykker";
  useEffect(() => {
    const hentUlykker = async () => {
      const response = await axios.get(ulykkerUrl, {
        params: avgrensningsboks,
      });
      console.log(`Hentet ${response.data.length}`);
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

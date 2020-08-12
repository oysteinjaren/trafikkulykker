import React, { useState, useEffect } from "react";
import { Marker, Popup, useLeaflet } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Icon } from "leaflet";
import axios from "axios";

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

  function alvorlighetsgradBeskrivelse(alvorlighetsgrad) {
    switch (alvorlighetsgrad) {
      case "USKADET":
        return "Uskadd";
      case "LETTERESKADET":
        return "Lettere skadd";
      case "ALVORLIGSKADET":
        return "Alvorlig skadd";
      case "MEGETALVORLIGSKADET":
        return "Meget alvorlig skadd";
      case "DREPT":
        return "Drept";
      default:
        return "Ikke registrert";
    }
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
        <Popup
          position={[aktivUlykke.koordinater.lat, aktivUlykke.koordinater.lon]}
          onClose={() => {
            setAktivUlykke(null);
          }}
        >
          <div>
            <h2>
              {aktivUlykke.uhellKategori} ({aktivUlykke.ulykkesdato})
            </h2>
            <h3>{aktivUlykke.ulykkeskode}</h3>

            <b>Antall enheter: </b>
            {aktivUlykke.antallEnheter}
            <br />

            <b>Alvorlighetsgrad: </b>
            {alvorlighetsgradBeskrivelse(aktivUlykke.alvorlighetsgrad)}
            <br />
          </div>
        </Popup>
      )}
    </MarkerClusterGroup>
  );
}

export default Ulykker;

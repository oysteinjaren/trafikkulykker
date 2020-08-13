import React from "react";
import { Popup } from "react-leaflet";

function UlykkePopup(props) {
  const aktivUlykke = props.aktivUlykke;
  const onClose = props.onClose;

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
    <Popup
      position={[aktivUlykke.koordinater.lat, aktivUlykke.koordinater.lon]}
      onClose={onClose}
    >
      <div>
        <h2>
          {aktivUlykke.uhellKategori} ({aktivUlykke.ulykkesdato})
        </h2>
        <h3>{aktivUlykke.ulykkeskode}</h3>

        <b>Antall involverte enheter: </b>
        {aktivUlykke.antallEnheter}
        <br />

        <b>Alvorlighetsgrad: </b>
        {alvorlighetsgradBeskrivelse(aktivUlykke.alvorlighetsgrad)}
        <br />
      </div>
    </Popup>
  );
}

export default UlykkePopup;

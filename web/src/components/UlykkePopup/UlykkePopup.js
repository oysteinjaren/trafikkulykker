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

  function involverteEnheter(antall) {
    return antall === 1 ? "1 involvert enhet" : `${antall} involverte enheter`;
  }

  function antallDrepte(antall) {
    return antall === 1 ? "1 drept" : `${antall} drepte`;
  }

  function antallMegetAlvorligSkadde(antall) {
    return antall === 1
      ? "1 meget alvorlig skadd"
      : `${antall} meget alvorlig skadde`;
  }

  function antallAlvorligSkadde(antall) {
    return antall === 1 ? "1 alvorlig skadd" : `${antall} alvorlig skadde`;
  }

  function antallLettereSkadde(antall) {
    return antall === 1 ? "1 lettere skadd" : `${antall} lettere skadde`;
  }

  return (
    <Popup
      position={[aktivUlykke.koordinater.lat, aktivUlykke.koordinater.lon]}
      onClose={onClose}
    >
      <h2>
        {aktivUlykke.uhellKategori} ({aktivUlykke.ulykkesdato})
      </h2>
      <h3>{aktivUlykke.ulykkeskode}</h3>
      <span>{involverteEnheter(aktivUlykke.antallEnheter)}</span>
      <br />
      {aktivUlykke.antallDrepte > 0 && (
        <>
          <span>{antallDrepte(aktivUlykke.antallDrepte)}</span>
          <br />
        </>
      )}
      {aktivUlykke.antallMegetAlvorligSkadde > 0 && (
        <>
          <span>
            {antallMegetAlvorligSkadde(aktivUlykke.antallMegetAlvorligSkadde)}
          </span>
          <br />
        </>
      )}
      {aktivUlykke.antallAlvorligSkadde > 0 && (
        <>
          <span>{antallAlvorligSkadde(aktivUlykke.antallAlvorligSkadde)}</span>
          <br />
        </>
      )}
      {aktivUlykke.antallLettereSkadde > 0 && (
        <>
          <span>{antallLettereSkadde(aktivUlykke.antallLettereSkadde)}</span>
          <br />
        </>
      )}
      {aktivUlykke.alvorlighetsgrad === "USKADET" && <span>Ingen skadde</span>}
    </Popup>
  );
}

export default UlykkePopup;

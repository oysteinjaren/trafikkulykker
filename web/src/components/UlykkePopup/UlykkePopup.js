import React from "react";
import { Popup } from "react-leaflet";

function UlykkePopup(props) {
  const aktivUlykke = props.aktivUlykke;
  const onClose = props.onClose;

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

  function uhellKategori() {
    return aktivUlykke.uhellKategori === "Mc ulykke"
      ? "MC-ulykke"
      : aktivUlykke.uhellKategori;
  }

  return (
    <Popup
      position={[aktivUlykke.koordinater.lat, aktivUlykke.koordinater.lon]}
      onClose={onClose}
      autoPan={false}
    >
      <h2>
        {uhellKategori()} ({aktivUlykke.ulykkesdato})
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
      {aktivUlykke.alvorlighetsgrad === "IKKEREGISTRERT" && (
        <span>Alvorlighetsgrad ikke registrert</span>
      )}
    </Popup>
  );
}

export default UlykkePopup;

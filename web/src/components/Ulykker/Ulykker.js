import React, { useState, useEffect } from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useLeafletBounds, useLeafletMap } from "use-leaflet";
import { Icon } from "leaflet";
import UlykkePopup from "../UlykkePopup";
import hentUlykker from "../../api/hentUlykker";

function Ulykker() {
  const [[sør, vest], [nord, øst]] = useLeafletBounds();
  const map = useLeafletMap();

  const kartStørrelsePikslerY = map.getSize().y;
  const meterPerBreddegrad = 111000;
  const KartStørrelseMeterY = (nord - sør) * meterPerBreddegrad;
  const meterPerPiksel = KartStørrelseMeterY / kartStørrelsePikslerY;
  console.log(`meterPerPiksel er nå ${meterPerPiksel}`);

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

  function lagAntallsavhengigClusterIkon(cluster) {
    console.log(`Lager cluster-ikon. meterPerPiksel er ${meterPerPiksel}`);

    //const antallNoder = cluster.getChildCount();
    const antallNoder = 10;
    const ikonSkaleringsfaktor = 100000;

    // Ikonets areal skal være proporsjonalt med antall noder i clusteret.
    // Deler på meterPerPiksel for å justere ned størrelsen på clustrene når man zoomer ut
    // (siden clustrene da inneholder mange flere noder, og ellers ville blitt veldig store).
    // TODO: Inne i denne funksjonen har meterPerPiksel alltid sin initielle verdi. Den oppdateres ikke selv om meterPerPiksel utenfor funksjonen gjør det. Må finne ut hvorfor
    const ikonStørrelse = Math.max(
      Math.sqrt((ikonSkaleringsfaktor * antallNoder) / Math.PI) /
        meterPerPiksel,
      0 // Ikke la ikonet bli så lite at tallet som viser antall ikke får plass
    );

    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: "marker-cluster-custom",
      iconSize: L.point(ikonStørrelse, ikonStørrelse, true),
    });
  }

  return (
    <MarkerClusterGroup iconCreateFunction={lagAntallsavhengigClusterIkon}>
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

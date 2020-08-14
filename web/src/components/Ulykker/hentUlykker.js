import axios from "axios";

const ulykkerUrl = "https://nvdbapiles-v3.atlas.vegvesen.no/vegobjekter/570";

const finnAlvorlighetsgrad = (ulykke) => {
  const alvorlighetsgrad = ulykke?.egenskaper?.find(
    (egenskap) => egenskap.id === 5074
  );
  return alvorlighetsgrad?.verdi;
};

const hentUlykker = async (vest, sør, øst, nord) => {
  let returnerteUlykker = [];
  let hentFlere = true;
  let start = "";

  var requestParams = {
    srid: "wgs84",
    inkluder: "geometri,egenskaper",
    kartutsnitt: `${vest},${sør},${øst},${nord}`,
    egenskap: "(5055>='2019-01-01')AND(5055<='2019-12-31')",
  };

  while (hentFlere === true) {
    if (start !== "") {
      requestParams.start = start;
    }
    const response = await axios.get(ulykkerUrl, {
      headers: {
        "X-Client": "trafikkulykker.no",
      },
      params: requestParams,
    });

    returnerteUlykker = returnerteUlykker.concat(response.data.objekter);

    if (response.data.metadata.antall > response.data.metadata.returnert) {
      start = response.data.metadata.neste.start;
    } else {
      hentFlere = false;
    }
  }

  console.log(`Hentet ${returnerteUlykker.length} ulykker`);
  console.log(returnerteUlykker);

  return returnerteUlykker.map((ulykke) => {
    const wkt = ulykke.geometri.wkt;
    const split = wkt.split(/[()]/);
    const koordinaterStrings = split[1].split(" ");
    var koordinater = {
      lat: parseFloat(koordinaterStrings[0]),
      lon: parseFloat(koordinaterStrings[1]),
    };

    return {
      id: ulykke.id,
      koordinater: koordinater,
      alvorlighetsgrad: finnAlvorlighetsgrad(ulykke),
    };
  });
};

export default hentUlykker;

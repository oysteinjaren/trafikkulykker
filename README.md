# Kart over trafikkulykker på norske veier

Test ut på [trafikkulykker.no](https://www.trafikkulykker.no)

Kartapplikasjon bygget med React-Leaflet. Kartdata fra Kartverket. Vei- og ulykkesdata fra [NVDB-API](https://api.vegdata.no/).

## Intensjon
Intensjonen med applikasjonen er å gi et visuelt inntrykk av omfanget av trafikkulykker i Norge. For dem som ikke selv har vært utsatt for en alvorlig trafikkulykke, blir ulykkesstatistikken fort bare tall i en tabell. Hvis man kan få vist disse dataene på en visuelt slående måte, kan det kanskje gjøre litt mer inntrykk, og muligens vekke engasjementet for sikrere veier og tryggere kjøring.

## Status og videreutvikling
Foreløpig viser kartet markører for alle registrerte trafikkulykker på norske veier i 2019. Fargen på hver markør signaliserer ulykkens alvorlighetsgrad. Man kan klikke på en markør for å få mer informasjon om ulykken.

Applikasjonen er under utvikling, og nye funksjoner vil legges til fortløpende. For noe funksjonalitet vil det være nyttig/nødvendig å preprosessere data og servere det fra en backend. For det formålet har jeg laget og eksperimentert med et enkelt REST-API (laget i Spring Boot/Kotlin), som foreløpig bare fungerer som en proxy mot NVDB-API. Den publiserte applikasjonen bruker ikke denne backenden, da det naturligvis går mye raskere å hente data direkte fra NVDB-API.

### Ideer til nye funksjoner:

 - Enkelt heatmap over ulykker
 - Kartlag som viser veier, med veisegmenter fargekodet etter hvor mange ulykker som har skjedd der
 - Som over, men fargekodet etter antall ulykker delt på trafikkmengde. Kan kanskje brukes til å finne veisegmenter som er overrepresentert på ulykkesstatistikken ift. trafikkmengden.
  - Vise data fra flere år tilbake, og gjøre det mulig å se utviklingen fra år til år
 



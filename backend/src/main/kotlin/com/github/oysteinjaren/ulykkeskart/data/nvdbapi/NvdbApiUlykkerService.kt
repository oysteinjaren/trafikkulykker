package com.github.oysteinjaren.ulykkeskart.data.nvdbapi

import com.github.oysteinjaren.ulykkeskart.domain.models.Alvorlighetsgrad
import com.github.oysteinjaren.ulykkeskart.domain.models.BoundingBoxWGS84
import com.github.oysteinjaren.ulykkeskart.domain.models.PunktWGS84
import com.github.oysteinjaren.ulykkeskart.domain.models.Ulykke
import com.github.oysteinjaren.ulykkeskart.domain.services.UlykkerService
import no.vegvesen.nvdbapi.client.ClientConfiguration
import no.vegvesen.nvdbapi.client.clients.ClientFactory
import no.vegvesen.nvdbapi.client.clients.RoadObjectRequest
import no.vegvesen.nvdbapi.client.model.Projection
import no.vegvesen.nvdbapi.client.model.roadobjects.RoadObject
import no.vegvesen.nvdbapi.client.model.roadobjects.attribute.IntegerAttribute
import no.vegvesen.nvdbapi.client.model.roadobjects.attribute.StringEnumAttribute
import org.springframework.stereotype.Service

@Service
class NvdbApiUlykkerService : UlykkerService {

    override fun hentUlykker(boundingBoxWGS84: BoundingBoxWGS84): List<Ulykke> {

        var clientConfig = ClientConfiguration.ClientConfigurationBuilder.builder()
                .withReadTimeout(5000)
                .withConnectTimeout(1000)
                .build()



        var factory = ClientFactory("https://nvdbapiles-v3.atlas.vegvesen.no", "trafikkulykker.no", clientConfig)
        var client = factory.createRoadObjectClient()

        var roadObjectRequest = RoadObjectRequest.newBuilder()
                .withBbox("${boundingBoxWGS84.vest}, ${boundingBoxWGS84.sør}, ${boundingBoxWGS84.øst}, ${boundingBoxWGS84.nord}")
                .withAttributeFilter("(5055>='2019-01-01')AND(5055<='2019-12-31')")
                .withProjection(Projection.WGS84)
                .includeAll()
                .build()

        var roadObjectResult = client.getRoadObjects(570, roadObjectRequest)
        var roadObjects = mutableListOf<RoadObject>()
        while (roadObjectResult.hasNext()) {
            roadObjects.addAll(roadObjectResult.next())
        }

        var ulykker : List<Ulykke> = roadObjects.map { Ulykke(
                id = it.id,
                ulykkesdato = it.startDate,
                uhellKategori = it.hentUhellKategori(),
                ulykkeskode = it.hentUlykkeskode(),
                alvorlighetsgrad = it.hentAlvorlighetsgrad(),
                antallEnheter = it.hentAntallEnheter(),
                antallDrepte = it.hentAntallDrepte(),
                antallMegetAlvorligSkadde = it.hentAntallMegetAlvorligSkadde(),
                antallAlvorligSkadde = it.hentAntallAlvorligSkadde(),
                antallLettereSkadde = it.hentAntallLettereSkadde(),
                koordinater = it.hentKoordinater())
        }

        factory.close();

        return ulykker
    }

    private fun RoadObject.hentAlvorlighetsgrad() : Alvorlighetsgrad {
        val alvorlighetsgradAttribute = this.getAttribute(5074) as StringEnumAttribute
        return when(alvorlighetsgradAttribute.enumId) {
            6431 -> Alvorlighetsgrad.USKADET
            6430 -> Alvorlighetsgrad.LETTERESKADET
            6429 -> Alvorlighetsgrad.ALVORLIGSKADET
            6428 -> Alvorlighetsgrad.MEGETALVORLIGSKADET
            6427 -> Alvorlighetsgrad.DREPT
            else -> Alvorlighetsgrad.IKKEREGISTRERT
        }
    }

    private fun RoadObject.hentKoordinater() : PunktWGS84? {
        val wkt = this.geometry?.wkt;
        val split = wkt?.split('(', ')')
        val koordinaterString = split?.get(1)
        val koordinater = koordinaterString?.split(' ')
        val lat = koordinater?.get(0)?.toDouble()
        var lon = koordinater?.get(1)?.toDouble()
        return if (lat != null && lon != null) PunktWGS84(lat, lon) else null
    }

    private fun RoadObject.hentUhellKategori() : String {
        val uhellKategoriAttribute = this.getAttribute(5065) as StringEnumAttribute
        return uhellKategoriAttribute.value
    }

    private fun RoadObject.hentUlykkeskode() : String {
        val ulykkeskodeAttribute = this.getAttribute(5066) as StringEnumAttribute
        return ulykkeskodeAttribute.value
    }

    private fun RoadObject.hentAntallEnheter() : Int = hentIntegerAttribute(5069)
    private fun RoadObject.hentAntallDrepte() : Int = hentIntegerAttribute(5070)
    private fun RoadObject.hentAntallMegetAlvorligSkadde() : Int = hentIntegerAttribute(5071)
    private fun RoadObject.hentAntallAlvorligSkadde() : Int = hentIntegerAttribute(5072)
    private fun RoadObject.hentAntallLettereSkadde() : Int = hentIntegerAttribute(5073)


    private fun RoadObject.hentIntegerAttribute(attributeTypeId : Int) : Int {
        val attribute = this.getAttribute(attributeTypeId) as IntegerAttribute
        return attribute.value;
    }
}
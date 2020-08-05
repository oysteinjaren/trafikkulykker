package com.github.oysteinjaren.ulykkeskart.data.nvdbapi

import com.github.oysteinjaren.ulykkeskart.domain.models.Alvorlighetsgrad
import com.github.oysteinjaren.ulykkeskart.domain.models.PunktUTM33
import com.github.oysteinjaren.ulykkeskart.domain.models.Ulykke
import com.github.oysteinjaren.ulykkeskart.domain.services.UlykkerService
import no.vegvesen.nvdbapi.client.ClientConfiguration
import no.vegvesen.nvdbapi.client.clients.ClientFactory
import no.vegvesen.nvdbapi.client.clients.RoadObjectRequest
import no.vegvesen.nvdbapi.client.model.roadobjects.RoadObject
import no.vegvesen.nvdbapi.client.model.roadobjects.attribute.StringEnumAttribute
import org.springframework.stereotype.Service

@Service
class NvdbApiUlykkerService : UlykkerService {

    override fun hentUlykker(): List<Ulykke> {

        var clientConfig = ClientConfiguration.ClientConfigurationBuilder.builder()
                .withReadTimeout(5000)
                .withConnectTimeout(1000)
                .build()



        var factory = ClientFactory("https://nvdbapiles-v3.atlas.vegvesen.no", "trafikkulykker.no", clientConfig)
        var client = factory.createRoadObjectClient()

        var roadObjectRequest = RoadObjectRequest.newBuilder()
                .withMunicipalities(listOf(5001))
                .withAttributeFilter("(5055>='2019-01-01')AND(5055<='2019-12-31')")
                .includeAll()
                .build()

        var roadObjectResult = client.getRoadObjects(570, roadObjectRequest)
        var roadObjects = roadObjectResult.next()

        var ulykker : List<Ulykke> = roadObjects.map { Ulykke(
                ulykkesdato = it.startDate,
                alvorlighetsgrad = it.hentAlvorlighetsgrad(),
                koordinater = PunktUTM33(123, 456)) //TODO: Map koordinater fra roadObject
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

}
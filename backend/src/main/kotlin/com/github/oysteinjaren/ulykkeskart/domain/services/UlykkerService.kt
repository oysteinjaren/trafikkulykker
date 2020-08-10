package com.github.oysteinjaren.ulykkeskart.domain.services

import com.github.oysteinjaren.ulykkeskart.domain.models.BoundingBoxWGS84
import com.github.oysteinjaren.ulykkeskart.domain.models.Ulykke
import org.springframework.stereotype.Service

@Service()
interface UlykkerService {
    fun hentUlykker(boundingBoxWGS84: BoundingBoxWGS84) : List<Ulykke>
}
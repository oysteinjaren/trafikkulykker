package com.github.oysteinjaren.ulykkeskart.domain.services

import com.github.oysteinjaren.ulykkeskart.domain.models.Ulykke
import org.springframework.stereotype.Service

@Service()
interface UlykkerService {
    fun hentUlykker() : List<Ulykke>
}
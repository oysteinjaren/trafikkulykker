package com.github.oysteinjaren.ulykkeskart.controllers

import com.github.oysteinjaren.ulykkeskart.domain.models.Ulykke
import com.github.oysteinjaren.ulykkeskart.domain.services.UlykkerService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class UlykkerController(val ulykkerService : UlykkerService) {

    @GetMapping("/api/ulykker", produces = ["application/json"])
    fun hentUlykker() : List<Ulykke> {
        return ulykkerService.hentUlykker()
    }
}
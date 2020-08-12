package com.github.oysteinjaren.ulykkeskart.controllers

import com.github.oysteinjaren.ulykkeskart.domain.models.BoundingBoxWGS84
import com.github.oysteinjaren.ulykkeskart.domain.models.Ulykke
import com.github.oysteinjaren.ulykkeskart.domain.services.UlykkerService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class UlykkerController(val ulykkerService : UlykkerService) {

    @GetMapping("/api/ulykker", produces = ["application/json"])
    fun hentUlykker(@RequestParam vest : Double, @RequestParam sør : Double, @RequestParam øst : Double, @RequestParam nord : Double) : List<Ulykke> {
        return ulykkerService.hentUlykker(BoundingBoxWGS84(
                vest = vest,
                sør = sør,
                øst = øst,
                nord = nord
        ))
    }
}
package com.github.oysteinjaren.ulykkeskart.services

import com.github.oysteinjaren.ulykkeskart.domain.models.Alvorlighetsgrad
import com.github.oysteinjaren.ulykkeskart.domain.models.PunktUTM33
import com.github.oysteinjaren.ulykkeskart.domain.models.Ulykke
import com.github.oysteinjaren.ulykkeskart.domain.services.UlykkerService
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class UlykkerServiceImpl : UlykkerService {

    override fun hentUlykker(): List<Ulykke> {


        return listOf(Ulykke(
                ulykkesdato = LocalDate.parse("2019-03-15"),
                alvorlighetsgrad = Alvorlighetsgrad.LETTERESKADET,
                koordinater = PunktUTM33(123, 456)))
    }
}
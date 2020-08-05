package com.github.oysteinjaren.ulykkeskart.domain.models

import java.time.LocalDate

data class Ulykke (
        val id : Long,
        val ulykkesdato : LocalDate,
        val alvorlighetsgrad: Alvorlighetsgrad,
        val koordinater : PunktWGS84?)
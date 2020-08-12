package com.github.oysteinjaren.ulykkeskart.domain.models

import java.time.LocalDate

data class Ulykke (
        val id : Long,
        val ulykkesdato : LocalDate,
        val uhellKategori : String,
        val ulykkeskode : String,
        val alvorlighetsgrad: Alvorlighetsgrad,
        val koordinater : PunktWGS84?)
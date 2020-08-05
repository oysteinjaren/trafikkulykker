package com.github.oysteinjaren.ulykkeskart.domain.models

import java.time.LocalDate

data class Ulykke (
        val ulykkesdato : LocalDate,
        val alvorlighetsgrad: Alvorlighetsgrad,
        val koordinater : PunktUTM33?)
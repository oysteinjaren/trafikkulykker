package com.github.oysteinjaren.ulykkeskart.domain.models

import java.time.LocalDate

data class Ulykke (
        val id : Long,
        val ulykkesdato : LocalDate,
        val uhellKategori : String,
        val ulykkeskode : String,
        val alvorlighetsgrad : Alvorlighetsgrad,
        val antallEnheter : Int,
        val antallDrepte : Int,
        val antallMegetAlvorligSkadde : Int,
        val antallAlvorligSkadde : Int,
        val antallLettereSkadde : Int,
        val koordinater : PunktWGS84?)
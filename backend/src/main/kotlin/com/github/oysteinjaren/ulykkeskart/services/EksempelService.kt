package com.github.oysteinjaren.ulykkeskart.services

import org.springframework.stereotype.Service

@Service
class EksempelService {
    data class EksempelRespons(val message : String)

    fun getValue() = EksempelRespons("Hallo fra EksempelService!")
}
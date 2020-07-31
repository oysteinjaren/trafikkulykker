package com.github.oysteinjaren.ulykkeskart.controllers

import com.github.oysteinjaren.ulykkeskart.services.EksempelService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ExampleController {

    @Autowired
    private lateinit var eksempelService : EksempelService

    @GetMapping("/api/hello", produces = ["application/json"])
    fun example() = eksempelService.getValue()
}
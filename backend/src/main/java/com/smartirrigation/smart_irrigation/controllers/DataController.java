package com.smartirrigation.smart_irrigation.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import com.smartirrigation.smart_irrigation.services.AdafruitService;
import com.smartirrigation.smart_irrigation.models.Lux;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;


@RestController
@RequestMapping("/anh_sang")
public class DataController {
    private final AdafruitService adafruitService;

    @Autowired
    public DataController(AdafruitService adafruitService) {
        this.adafruitService = adafruitService;
    }

    @GetMapping("/data")
    public List<Lux> getLux() {
        return adafruitService.getLux();
    }
}

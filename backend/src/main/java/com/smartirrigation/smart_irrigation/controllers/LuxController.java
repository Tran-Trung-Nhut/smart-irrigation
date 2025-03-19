package com.smartirrigation.smart_irrigation.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import com.smartirrigation.smart_irrigation.services.AdafruitService;
import com.smartirrigation.smart_irrigation.models.Lux;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/anh_sang")
public class LuxController {
    private final AdafruitService adafruitService;

    @Autowired
    public LuxController(AdafruitService adafruitService) {
        this.adafruitService = adafruitService;
    }

    @GetMapping("/data")
    public List<Lux> getLux() {
        return adafruitService.getLux();
    }

    @GetMapping("/last-value")
    public Map<String, Double> getLastLuxValue(){
        Double lastValue = adafruitService.getLastLuxValue();
        Map<String, Double> response = new HashMap<>();
        response.put("last_value", lastValue);
        return response;
    }

    @GetMapping("/chart")
    public Map<String, Object> getChart() {
        return adafruitService.getChart();
    }

}

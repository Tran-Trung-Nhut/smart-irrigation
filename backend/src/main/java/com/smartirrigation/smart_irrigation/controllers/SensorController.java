package com.smartirrigation.smart_irrigation.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.smartirrigation.smart_irrigation.services.AdafruitService;
import com.smartirrigation.smart_irrigation.models.SensorData;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/sensor")
public class SensorController {
    private final AdafruitService adafruitService;

    @Autowired
    public SensorController(AdafruitService adafruitService) {
        this.adafruitService = adafruitService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{type}/data")
    public List<SensorData> getSensorData(@PathVariable String type) {
        return adafruitService.getSensorData(type);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{type}/last-value")
    public Map<String, Double> getLastSensorValue(@PathVariable String type) {
        Double lastValue = adafruitService.getLastSensorValue(type);
        Map<String, Double> response = new HashMap<>();
        response.put("last_value", lastValue);
        return response;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{type}/chart")
    public Map<String, Object> getChart(@PathVariable String type) {
        return adafruitService.getChart(type);
    }
}

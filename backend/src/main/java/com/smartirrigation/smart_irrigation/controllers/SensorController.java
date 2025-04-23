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
    @GetMapping("/last-value")
    public Map<String, Double> getSensorLastValueData() {
        Map<String,Double> result = new HashMap<>();
        Double temperature =  adafruitService.getLastSensorValue("nhietdo");
        result.put("temperature", temperature);
        Double humidity = adafruitService.getLastSensorValue("doam");
        result.put("humidity", humidity);
        Double light = adafruitService.getLastSensorValue("anhsang");
        result.put("light", light);
        Double moisture = adafruitService.getLastSensorValue("doamdat");
        result.put("moisture", moisture);

        return result;
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
    @GetMapping("/chart/{time}")
    public Map<String, Object> getChart (@PathVariable String time) {
        Map<String, Object> result = new HashMap<>();

        Object dataLight = adafruitService.getChart("anhsang", time);
        result.put("light", dataLight);

        Object dataTemperature = adafruitService.getChart("nhietdo", time);
        result.put("temperature", dataTemperature);

        Object dataMoisture = adafruitService.getChart("doamdat", time);
        result.put("moisture", dataMoisture);

        Object dataHumidity = adafruitService.getChart("doam", time);
        result.put("humidity", dataHumidity);

        return result;
    }
}

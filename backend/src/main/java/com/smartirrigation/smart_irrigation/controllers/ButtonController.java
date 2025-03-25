package com.smartirrigation.smart_irrigation.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.smartirrigation.smart_irrigation.services.ButtonService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/button")
public class ButtonController {
    private final ButtonService buttonService;

    @Autowired
    public ButtonController(ButtonService buttonService){
        this.buttonService = buttonService;
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{button}/last-value")
    public Map<String, Integer> getLastValueButton (@PathVariable String button){
        Integer lastValue = buttonService.getLastValueButton(button);
        Map<String, Integer> response = new HashMap<>();
        response.put("last_value", lastValue);
        return response;
    } 

    @CrossOrigin(origins = "*")
    @GetMapping("/{button}/{status}")
    public Map<String, Object> sendDataButton1 (@PathVariable String button, @PathVariable String status){
        return buttonService.senDataButton1(status, button);
    }
}

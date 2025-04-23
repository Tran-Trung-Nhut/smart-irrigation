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
    @GetMapping("/last-value")
    public Map<String, Integer> getLastValueAllButton (){
        Map<String, Integer> result = new HashMap<>();
        Integer button1 = buttonService.getLastValueButton("button1");
        result.put("button1", button1);
        Integer button2 = buttonService.getLastValueButton("button2");
        result.put("button2", button2);
        Integer button3 = buttonService.getLastValueButton("button3");
        result.put("button3", button3);
        return result;
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
    public Map<String, Object> sendDataButton(@PathVariable String button, @PathVariable String status){
        return buttonService.sendDataButton(status, button);
    }
}

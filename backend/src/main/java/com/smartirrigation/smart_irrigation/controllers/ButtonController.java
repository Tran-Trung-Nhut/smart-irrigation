package com.smartirrigation.smart_irrigation.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.smartirrigation.smart_irrigation.services.ButtonService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/button")
public class ButtonController {
    private final ButtonService buttonService;

    @Autowired
    public ButtonController(ButtonService buttonService){
        this.buttonService = buttonService;
    }

    @PostMapping("/button1")
    public Map<String, Object> sendDataButton1 (@RequestBody Map<String,  Object> data){
        return buttonService.senDataButton1(data.get("value"));
    }
}

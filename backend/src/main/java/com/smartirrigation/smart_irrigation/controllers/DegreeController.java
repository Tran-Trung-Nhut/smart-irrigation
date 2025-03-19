package com.smartirrigation.smart_irrigation.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import com.smartirrigation.smart_irrigation.services.AdafruitService;
import com.smartirrigation.smart_irrigation.models.Degree;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/degree")  
public class DegreeController {
    private final AdafruitService adafruitService;

    @Autowired
    public DegreeController(AdafruitService adafruitService) {
        this.adafruitService = adafruitService;
    }

    @GetMapping("/data")
    public List<Degree> getDegree() {
        return adafruitService.getDegree();
    }
}
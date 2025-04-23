package com.smartirrigation.smart_irrigation.controllers;

import com.smartirrigation.smart_irrigation.services.SchedulingItemService;
import com.smartirrigation.smart_irrigation.models.SchedulingItem;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/scheduling-item")
public class SchedulingItemController {
    @Autowired
    private SchedulingItemService schedulingItemService;


    @CrossOrigin(origins = "*")
    @GetMapping("/all")
    public List<SchedulingItem> getAllSchedulingItems () {
        return schedulingItemService.getAllSchedulingItems();
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/create")
    public SchedulingItem createOneSchedulingItem (@RequestBody SchedulingItem schedulingItem){
        return schedulingItemService.createOneSchedulingItem(schedulingItem);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/delete/{id}")
    public void createOneSchedulingItem (@PathVariable Integer id){
        schedulingItemService.deleteOneSchedulingItem(id);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/check")
    public void checkAndDoSchedulingItem() {
        schedulingItemService.checkAndDoSchedulingItem();
    }

}

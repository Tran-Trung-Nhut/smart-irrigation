package com.smartirrigation.smart_irrigation.controllers;

import com.smartirrigation.smart_irrigation.services.NotificationService;
import com.smartirrigation.smart_irrigation.models.Notification;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/notification")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @CrossOrigin(origins = "*")
    @GetMapping("/all")
    public List<Notification> getAllNotification(){
        return notificationService.getAllNotification();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/delete/{id}")
    public void deleteOneNotification(@PathVariable Integer id){
        notificationService.deleteOneNotification(id);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/read/{id}")
    public void readNotification(@PathVariable Integer id){
        notificationService.readNotification(id);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/number-unread")
    public Map<String, Integer> getNumberOfUnreadNotification(){
        List<Notification> notifications = notificationService.getAllNotification();

        Integer count = 0;

        for(Notification notification: notifications){
            if(notification.getStatus() == false){
                count = count + 1;
            }
        }

        Map<String, Integer> result = new HashMap<>();
        result.put("count", count);

        return result;
    }

    
}

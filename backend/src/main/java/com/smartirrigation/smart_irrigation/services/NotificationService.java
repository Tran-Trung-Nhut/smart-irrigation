package com.smartirrigation.smart_irrigation.services;

import com.smartirrigation.smart_irrigation.repository.NotificationRepository;
import com.smartirrigation.smart_irrigation.models.Notification;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    public List<Notification> getAllNotification (){
        return notificationRepository.findAll();
    }

    public Notification createOneNotification (Notification notification){
        return notificationRepository.save(notification);
    }

    public void readNotification(Integer id) {
        Optional<Notification> optionalNotification  = notificationRepository.findById(id);

        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            notification.setStatus(true); 
            notificationRepository.save(notification); 
        }
    }

    public void deleteOneNotification(Integer Id){
        notificationRepository.deleteById(Id);
    }
}

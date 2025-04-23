
package com.smartirrigation.smart_irrigation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartirrigation.smart_irrigation.models.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
     
}
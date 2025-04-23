package com.smartirrigation.smart_irrigation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartirrigation.smart_irrigation.models.SchedulingItem;

public interface SchedulingItemRepository extends JpaRepository<SchedulingItem, Integer> {
     
}

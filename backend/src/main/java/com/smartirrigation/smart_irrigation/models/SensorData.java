package com.smartirrigation.smart_irrigation.models;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SensorData {
    private String id;
    private Double value;
    private int feed_id;
    private String feed_key;
    private String created_at;
    private long created_epoch;
    private String expiration;
    private String type; 
}

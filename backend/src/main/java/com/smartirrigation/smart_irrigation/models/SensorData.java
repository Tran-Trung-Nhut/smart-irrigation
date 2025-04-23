package com.smartirrigation.smart_irrigation.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SensorData {
    private String id;
    private Double value;
    private Integer feed_id;
    private String feed_key;
    private String created_at;
    private Long created_epoch;
    private String expiration;
    private String type; 
}

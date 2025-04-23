package com.smartirrigation.smart_irrigation.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "scheduling_item")
@Getter
@Setter
public class SchedulingItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Boolean status;
    private String startTime;
    private Integer duration;
    private String device;

    public Boolean getStatus(){
        return this.status;
    }

    public String getStartTime(){
        return this.startTime;
    }

    public Integer getDuration(){
        return this.duration;
    }

    public String getDevice() {
        return this.device;
    }

    public void setStatus(Boolean status){
        this.status = status;
    }

    public void setStartTime(String startTime){
        this.startTime = startTime;
    }

    public void setDuration(Integer duration){
        this.duration = duration;
    }

    public void setDevice(String device){
        this.device = device;
    }
}

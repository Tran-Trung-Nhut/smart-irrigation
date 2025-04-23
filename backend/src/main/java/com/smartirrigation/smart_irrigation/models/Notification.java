
package com.smartirrigation.smart_irrigation.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notification")
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private String content;
    private String create_at;
    private Boolean status;

    public String getTitle(){
        return this.title;
    }

    public String getContent(){
        return this.content;
    }
    public String getCreate_at(){
        return this.create_at;
    }

    public Boolean getStatus(){
        return this.status;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public void setContent(String content){
        this.content = content;
    }

    public void setCreate_at(String create_at){
        this.create_at = create_at;
    }

    public void setStatus(Boolean status){
        this.status = status;
    }
}

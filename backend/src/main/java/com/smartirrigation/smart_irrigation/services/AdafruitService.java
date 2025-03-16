package com.smartirrigation.smart_irrigation.services;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.smartirrigation.smart_irrigation.models.Lux;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class AdafruitService {
    private static final String AIO_USERNAME = "giang88";
    private static final String LUX = "anhsang";

    public static List<Lux> getLux(){
        String luxUrl = "https://io.adafruit.com/api/v2/" + AIO_USERNAME + "/feeds/" + LUX + "/data";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Lux[]> response = restTemplate.getForEntity(luxUrl, Lux[].class);
        return Arrays.asList(response.getBody());
    }
}

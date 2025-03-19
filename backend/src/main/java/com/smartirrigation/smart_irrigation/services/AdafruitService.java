package com.smartirrigation.smart_irrigation.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.smartirrigation.smart_irrigation.models.Lux;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AdafruitService {
    private static final String AIO_USERNAME = "giang88";
    private static final String LUX = "anhsang";
    private static final String ROOTURL =  "https://io.adafruit.com/api/v2/" + AIO_USERNAME + "/feeds/" + LUX;

    private static final RestTemplate restTemplate = new RestTemplate();

    public static List<Lux> getLux(){
        String luxUrl = ROOTURL + "/data";
        ResponseEntity<Lux[]> response = restTemplate.getForEntity(luxUrl, Lux[].class);
        return Arrays.asList(response.getBody());
    }

    public static Double getLastLuxValue() {
        ResponseEntity<String> response = restTemplate.getForEntity(ROOTURL, String.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            return rootNode.get("last_value").asDouble();
        } catch (Exception e) {
            return 0.0;
        }
    }

    public static Map<String, Object> getChart(){
        String luxUrl = ROOTURL + "/data/chart";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(luxUrl, String.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(response.getBody(), Map.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

package com.smartirrigation.smart_irrigation.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.smartirrigation.smart_irrigation.models.SensorData;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class AdafruitService {
    private static final String AIO_USERNAME = "giang88";
    private static final String ROOT_URL = "https://io.adafruit.com/api/v2/" + AIO_USERNAME + "/feeds/";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<SensorData> getSensorData(String sensorType) {
        String url = ROOT_URL + sensorType + "/data";
        ResponseEntity<SensorData[]> response = restTemplate.getForEntity(url, SensorData[].class);
        return Arrays.asList(response.getBody());
    }


    public Double getLastSensorValue(String sensorType) {
        String url = ROOT_URL + sensorType;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            return rootNode.get("last_value").asDouble();
        } catch (Exception e) {
            e.printStackTrace();
            return 0.0;
        }
    }

    public Map<String, Object> getChart(String sensorType) {
        String url = ROOT_URL + sensorType + "/data/chart";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        try {
            return objectMapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }
}

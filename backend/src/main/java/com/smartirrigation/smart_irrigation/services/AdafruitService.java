package com.smartirrigation.smart_irrigation.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.smartirrigation.smart_irrigation.models.SensorData;
import com.fasterxml.jackson.core.type.TypeReference;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdafruitService {
    private static final String AIO_USERNAME = "giang88";
    private static final String ROOT_URL = "https://io.adafruit.com/api/v2/" + AIO_USERNAME + "/feeds/";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private List<Map<String, Object>> filterDataByTimeRange(List<Map<String, Object>> dataList, Instant start, Instant end) {
        return dataList.stream()
                .filter(data -> {
                    String createdAt = (String) data.get("created_at");
                    Instant dataInstant = Instant.parse(createdAt);
                    return dataInstant.isAfter(start) && dataInstant.isBefore(end);
                })
                .collect(Collectors.toList());
    }

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

    public Map<String, Object> getChart(String sensorType, String time) {
        String url = ROOT_URL + sensorType + "/data";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
    
        try {
            Instant now = Instant.now(); 
            List<Map<String, Object>> dataList = objectMapper.readValue(response.getBody(), new TypeReference<List<Map<String, Object>>>() {});
            List<Map<String, Object>> filteredList;
    
            switch (time) {
                case "day":
                    Instant oneDayAgo = now.minusSeconds(24 * 60 * 60);
                    filteredList = filterDataByTimeRange(dataList, oneDayAgo, now);
                    break;
                case "hour":
                    Instant oneHourAgo = now.minusSeconds(60 * 60);
                    filteredList = filterDataByTimeRange(dataList, oneHourAgo, now);
                    break;
                case "week":
                    Instant oneWeekAgo = now.minusSeconds(7 * 24 * 60 * 60);
                    filteredList = filterDataByTimeRange(dataList, oneWeekAgo, now);
                    break;
                default: 
                    Instant oneMonthAgo = now.minusSeconds(30 * 24 * 60 * 60);
                    filteredList = filterDataByTimeRange(dataList, oneMonthAgo, now);
                    break;
            }
    
            Map<String, Object> result = new HashMap<>();
            result.put("data", filteredList);
            return result;
    
        } catch (Exception e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }
    
}

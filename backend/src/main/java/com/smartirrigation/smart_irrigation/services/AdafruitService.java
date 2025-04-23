package com.smartirrigation.smart_irrigation.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.smartirrigation.smart_irrigation.models.SensorData;
import com.fasterxml.jackson.core.type.TypeReference;
import io.github.cdimascio.dotenv.Dotenv;

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
    private static final Dotenv dotenv = Dotenv.configure().load();
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

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", dotenv.get("X_AIO_Key"));

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, String.class
        );

        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            return rootNode.get("last_value").asDouble();
        } catch (Exception e) {
            e.printStackTrace();
            return 0.0;
        }
    }

    public  Object getChart(String sensorType, String time) {
        String url = ROOT_URL + sensorType + "/data";

        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", dotenv.get("X_AIO_Key"));

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<SensorData[]> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, SensorData[].class
        );

        try {
            Instant now = Instant.now(); 
            List<Map<String, Object>> dataList = Arrays.stream(response.getBody())
            .map(sensorData -> objectMapper.convertValue(sensorData, new TypeReference<Map<String, Object>>() {}))
            .collect(Collectors.toList());
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
    
            return filteredList;
    
        } catch (Exception e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }
    
}

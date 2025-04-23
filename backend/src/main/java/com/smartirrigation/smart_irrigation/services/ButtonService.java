package com.smartirrigation.smart_irrigation.services;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service; 
import io.github.cdimascio.dotenv.Dotenv;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;



import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ButtonService {
    private static final String ROOT_URL = "https://io.adafruit.com/api/v2/giang88/feeds/";
    private static final Dotenv dotenv = Dotenv.configure().load();
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();



    public Integer getLastValueButton(String button){
        String url = ROOT_URL + button;

        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", dotenv.get("X_AIO_Key"));

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, String.class
        );

        try {
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            return rootNode.get("last_value").asInt();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    public Map<String, Object> sendDataButton(String status, String button){
        String url = ROOT_URL + button + "/data";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", dotenv.get("X_AIO_Key"));

        Map<String, Object> payload = new HashMap<>();
        payload.put("value", status);


        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {});

        return response.getBody();
    }

}

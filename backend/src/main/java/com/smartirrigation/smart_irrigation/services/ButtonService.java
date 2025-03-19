package com.smartirrigation.smart_irrigation.services;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service; 
import io.github.cdimascio.dotenv.Dotenv;


import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ButtonService {
    private static final String ROOT_URL = "https://io.adafruit.com/api/v2/giang88/feeds/";
    private static final Dotenv dotenv = Dotenv.configure().load();

    public Map<String, Object> senDataButton1 (Object data, Object buttonName){
        String url = ROOT_URL + buttonName.toString();
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", dotenv.get("X_AIO_Key"));

        Map<String, Object> payload = new HashMap<>();
        payload.put("value", data);


        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {});

        return response.getBody();
    }

}

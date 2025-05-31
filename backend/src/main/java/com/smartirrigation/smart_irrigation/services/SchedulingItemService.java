package com.smartirrigation.smart_irrigation.services;

import com.smartirrigation.smart_irrigation.models.SchedulingItem;
import com.smartirrigation.smart_irrigation.models.Notification;
import com.smartirrigation.smart_irrigation.repository.SchedulingItemRepository;
import com.smartirrigation.smart_irrigation.services.ButtonService;
import com.smartirrigation.smart_irrigation.services.NotificationService;


import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smartirrigation.smart_irrigation.models.SchedulingItem;


@Service
public class SchedulingItemService {
    @Autowired
    private SchedulingItemRepository schedulingItemRepository;

    @Autowired
    private ButtonService buttonService;

    @Autowired
    private NotificationService notificationService;

    private static Set<Integer> processingSchedulingItems = new HashSet<>();

    public List<SchedulingItem> getAllSchedulingItems(){
        return schedulingItemRepository.findAll();
    }

    public SchedulingItem createOneSchedulingItem(SchedulingItem schedulingItem) {
        return schedulingItemRepository.save(schedulingItem);
    }

    public void deleteOneSchedulingItem(Integer id){
        schedulingItemRepository.deleteById(id);
    }    

    public void checkAndDoSchedulingItem() { 
        LocalTime currentTime = LocalTime.now(ZoneId.systemDefault()); 
        List<SchedulingItem> schedulingItems = schedulingItemRepository.findAll();
    
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSX"); 
    
        for (SchedulingItem schedulingItem : schedulingItems) {
            try {
                if (processingSchedulingItems.contains(schedulingItem.getId())) {
                    continue; // Bỏ qua nếu đang xử lý
                }

                processingSchedulingItems.add(schedulingItem.getId());

                // Chuyển từ String sang ZonedDateTime để xử lý đúng múi giờ
                ZonedDateTime startDateTime = ZonedDateTime.parse(schedulingItem.getStartTime(), formatter)
                    .withZoneSameInstant(ZoneId.of("Asia/Ho_Chi_Minh"));
                LocalTime startTime = startDateTime.toLocalTime(); 
    
                if (startTime.getHour() == currentTime.getHour() && startTime.getMinute() == currentTime.getMinute() 
                && !schedulingItem.getStatus()) {
    
                    String device = schedulingItem.getDevice();
                    String buttonId = "";
    
                    if ("Máy bơm".equals(device)) {
                        buttonId = "button2";
                    } else if ("Quạt".equals(device)) {
                        buttonId = "button3";
                    } else if ("Đèn".equals(device)) {
                        buttonId = "button1";
                    }
    
                    if (!buttonId.isEmpty()) {
                        buttonService.sendDataButton("1", buttonId);
                        schedulingItem.setStatus(true);
                        schedulingItemRepository.save(schedulingItem);
                        startDeviceTimer(buttonId, schedulingItem);
                    }
                }
            } catch (Exception e) {
                System.out.println("Lỗi khi xử lý lịch trình: " + e.getMessage());
            }
        }
    }
    



    public void startDeviceTimer(String device, SchedulingItem schedulingItem){
        Timer timer = new Timer();

        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                buttonService.sendDataButton("0", device);
                
                Notification notification = new Notification();

                notification.setTitle("Hoàn thành lịch");
                notification.setContent(schedulingItem.getDevice() + " đã hoàn thành việc khởi động trong thời gian " + schedulingItem.getDuration() + " giây");
                notification.setCreate_at(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                notification.setStatus(false);

                notificationService.createOneNotification(notification);
                processingSchedulingItems.remove(schedulingItem.getId());
            }
        }, schedulingItem.getDuration() * 1000);
    }
}

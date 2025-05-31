import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native'; // Import ScrollView
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

type Notification = {
  id: number,
  title: string,
  content: string,
  create_at: Date,
  status: boolean
}

const getStatusColor = (status: boolean) => {
  if (!status){
    return "green"
  }
  
  return '#808080'; // Default gray
};

const getIconName = (content:string) => {
  if (content.includes("Máy bơm")) return "water";  
  if (content.includes("Quạt")) return "leaf";    
  return "bulb";  
};

const Noti = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleReadNotification = async (notification: Notification) => {
    try {
      await fetch(`http://localhost:8080/notification/read/${notification.id}`)
      setSelectedNotification(notification);
      await fetchNotifications();
    } catch (error) {
      // Handle error if needed
    }
  };

  const handleDeleteNotification = async (notification_id: number) => {
    try {
      await fetch(`http://localhost:8080/notification/delete/${notification_id}`)
      setSelectedNotification(null);
      await fetchNotifications();
    } catch (error) {
      // Handle error if needed
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8080/notification/all");
      setNotifications(await response.json());
    } catch (error) {
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* ScrollView để cuộn qua các thông báo */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {notifications.map((notification) => (
          <TouchableOpacity key={notification.id} onPress={() => handleReadNotification(notification)}>
            <View style={styles.notificationItem}>
              <View style={styles.iconContainer}>
                <Ionicons name={getIconName(notification.content)} size={24} color="black" />
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={[styles.time, { color: getStatusColor(notification.status) }]}>{new Date(notification.create_at).toLocaleString('vi-VN')}</Text>
              </View>
              <View style={[styles.statusContainer, { backgroundColor: getStatusColor(notification.status) }]}>
                <Ionicons 
                  name="ellipse" 
                  size={14} 
                  color={notification.status ? "gray" : "green"} 
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedNotification} 
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedNotification(null)} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedNotification?.title}</Text>
            <Text style={styles.modalContent}>{selectedNotification?.content}</Text>
            <Text style={styles.modalTime}>
              {selectedNotification?.create_at && new Date(selectedNotification.create_at).toLocaleString('vi-VN')}
            </Text>
            <View style={{display: "flex", flexDirection: "row", gap: "10"}}>
              <TouchableOpacity onPress={() => handleDeleteNotification(selectedNotification?.id || 0)} style={styles.deleteButton}>
                <Text style={styles.closeButtonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedNotification(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    paddingBottom: 20, // Thêm padding dưới cùng cho ScrollView
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
  statusContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalTime: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Noti;

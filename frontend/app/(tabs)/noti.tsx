import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NotificationType = 'plant' | 'environment';
type Status = 'good' | 'bad';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  time: string;
  status: Status;
  environmentType?: 'light' | 'temperature' | 'humidity' | 'soil';
}

const getIconName = (type: NotificationType, environmentType?: string) => {
  if (type === 'plant') {
    return 'leaf-outline';
  } else if (type === 'environment') {
    switch (environmentType) {
      case 'light':
        return 'sunny-outline';
      case 'temperature':
        return 'thermometer-outline';
      case 'humidity':
        return 'water-outline';
      case 'soil':
        return 'leaf-outline'; // Using leaf-outline since Ionicons doesn't have sprout
      default:
        return 'alert-circle-outline';
    }
  }
  return 'notifications-outline';
};

const getStatusColor = (title: string, type: NotificationType) => {
  const lowerTitle = title.toLowerCase();
  
  // For plants
  if (type === 'plant') {
    if (lowerTitle.includes('tốt')) {
      return '#4CAF50'; // Green
    } else if (lowerTitle.includes('không ổn') || lowerTitle.includes('thiếu')) {
      return '#FF5252'; // Red
    }
  }
  
  // For environment factors
  else if (type === 'environment') {
    if (lowerTitle.includes('tốt')) {
      return '#4CAF50'; // Green
    } else if (
      lowerTitle.includes('không đủ') || 
      lowerTitle.includes('thiếu') || 
      lowerTitle.includes('quá cao') || 
      lowerTitle.includes('quá thấp')
    ) {
      return '#FF5252'; // Red
    }
  }
  
  return '#808080'; // Default gray
};

const NotificationItem = ({ item }: { item: Notification }) => {
  const statusColor = getStatusColor(item.title, item.type);
  
  return (
    <View style={styles.notificationItem}>
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName(item.type, item.environmentType)} size={24} color="black" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.time, { color: statusColor }]}>{item.time}</Text>
      </View>
      <View style={[styles.statusContainer, { backgroundColor: statusColor }]}>
        <Ionicons 
          name={item.status === 'good' ? 'checkmark' : 'close'} 
          size={14} 
          color="#FFFFFF" 
        />
      </View>
    </View>
  );
};

const Noti = () => {
  // Sample notification data
  const notifications: Notification[] = [
    {
      id: '4',
      type: 'plant',
      title: 'Cây phát tài lộc tốt',
      time: 'Hôm nay',
      status: 'good'
    },
    // Environment notifications
    {
      id: '6',
      type: 'environment',
      title: 'Ánh sáng không đủ',
      time: 'Hôm nay',
      status: 'bad',
      environmentType: 'light'
    },
    {
      id: '7',
      type: 'environment',
      title: 'Nhiệt độ quá cao',
      time: 'Hôm nay',
      status: 'bad',
      environmentType: 'temperature'
    },
    {
      id: '8',
      type: 'environment',
      title: 'Độ ẩm tốt',
      time: 'Hôm nay',
      status: 'good',
      environmentType: 'humidity'
    },
    {
      id: '9',
      type: 'environment',
      title: 'Độ ẩm đất tốt',
      time: 'Hôm nay',
      status: 'good',
      environmentType: 'soil'
    },
    // Yesterday's notification
    {
      id: '5',
      type: 'plant',
      title: 'Cây phát tài lộc thiếu nước',
      time: 'Hôm qua',
      status: 'bad'
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
});

export default Noti;
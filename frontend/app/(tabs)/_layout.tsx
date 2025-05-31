import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TabsLayout() {
  const [numberOfUnreadNotification, setNumberOfUnreadNotification] = useState<number>(0); // Test với số thông báo khác 0

  const fetchNumberOfUnreadNotification = async () => {
    try {
      const respone = await fetch("http://localhost:8080/notification/number-unread")
      const jsonData = await respone.json()
      setNumberOfUnreadNotification(jsonData.count)
    } catch (error) {
      setNumberOfUnreadNotification(0)
    }
  }

  useEffect(() => {
    fetchNumberOfUnreadNotification()

    const interval = setInterval(() => {
      fetchNumberOfUnreadNotification()
    }, 10000)

    return () => clearInterval(interval)
  },[])

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          tabBarLabel: 'Trang chủ',
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
          tabBarLabel: 'Đặt lịch',
        }}
      />
      <Tabs.Screen
        name="chart"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="analytics" color={color} size={size} />,
          tabBarLabel: 'Biểu đồ',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          tabBarLabel: 'Tài khoản',
        }}
      />
      <Tabs.Screen
        name="noti"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              {/* Icon thông báo */}
              <Ionicons 
                name={numberOfUnreadNotification > 0 ? "notifications" : "notifications-outline"} 
                color={color} 
                size={size} 
              />
              {/* Badge đỏ khi có thông báo */}
              {numberOfUnreadNotification > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {numberOfUnreadNotification > 99 ? "99+" : numberOfUnreadNotification}
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarLabel: 'Thông báo',
        }}
      />
    </Tabs>
  );
}

// Style cho icon và badge
const styles = StyleSheet.create({
  iconContainer: {
    position: "relative", // Để badge nằm đè lên icon
  },
  badge: {
    position: "absolute",
    right: -8, // Điều chỉnh vị trí badge
    top: -2,
    backgroundColor: "red", // Màu nền badge
    borderRadius: 10, // Làm tròn badge
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white", // Màu chữ trắng
    fontSize: 10,
    fontWeight: "bold",
  },
});


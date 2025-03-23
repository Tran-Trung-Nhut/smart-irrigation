import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
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
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" color={color} size={size} />,
          tabBarLabel: 'Thông báo',
        }}
      />
    </Tabs>
  );
}

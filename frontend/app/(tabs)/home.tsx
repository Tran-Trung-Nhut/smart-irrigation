import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import LinearGradient from 'react-native-linear-gradient';
import useCustomFonts from "../../hooks/useFonts";

export default function HomeScreen() {
  const [humidity, setHumidity] = useState(250); // Giả lập dữ liệu từ Backend
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [selectedAction, setSelectedAction] = useState("water"); // Default to water action
  
  // Xác định màu pin dựa trên độ ẩm
  const getBatteryColor = () => {
    if (humidity <= 50) return "red";
    if (humidity > 50 && humidity < 200) return "yellow";
    return "green";
  };

  // Sự kiện bật/tắt AI tự động
  const toggleAutoMode = () => setIsAutoMode((prev) => !prev);
  
  // Xác định text cho action dựa trên button được chọn
  const getActionText = () => {
    switch(selectedAction) {
      case "water":
        return "TƯỚI CÂY";
      case "light":
        return "BẬT ĐÈN";
      case "fan":
        return "BẬT QUẠT";
      default:
        return "TƯỚI CÂY";
    }
  };
  
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null; // Chờ tải font trước khi render UI

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Sm<Text style={styles.logoBold}>irr</Text>
        </Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* Ảnh Cây & Tên */}
      <View style={styles.topContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.title}>TRONG NHÀ</Text>
          <Text style={styles.plantName}>Cây phát tài lộc</Text>


          {/* Điều khiển thủ công */}
          <Text style={styles.sectionTitle}>THAO TÁC THỦ CÔNG</Text>
          <View style={styles.controls}>
            <TouchableOpacity 
              style={[
                styles.controlButton, 
                selectedAction === "water" && styles.selectedButton
              ]}
              onPress={() => setSelectedAction("water")}
            >
              <Ionicons
                name="water"
                size={24}
                color={selectedAction === "water" ? "#FFFFFF" : "#00AEEF"}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.controlButton, 
                selectedAction === "light" && styles.selectedButton
              ]}
              onPress={() => setSelectedAction("light")}
            >
              <Ionicons
                name="flash"
                size={24}
                color={selectedAction === "light" ? "#FFFFFF" : "#FDCB58"}
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.controlButton, 
                selectedAction === "fan" && styles.selectedButton
              ]}
              onPress={() => setSelectedAction("fan")}
            >
              <FontAwesome5
                name="fan"
                size={24}
                color={selectedAction === "fan" ? "#FFFFFF" : "#9B59B6"}
              />
            </TouchableOpacity>
          </View>

          {/* Nút tưới cây - Động thay đổi theo button được chọn */}
          
          <Text style={styles.waterButtonText}>{getActionText()}</Text>
          

          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Đồng ý</Text>
          </TouchableOpacity>
        </View>

        {/* Hình ảnh cây */}
        <View style={styles.rightContainer}>
          
        </View>
        {/* Thanh Pin */}
        <Ionicons
            name="battery-full"
            size={36}
            color={getBatteryColor()}
            style={styles.battery}
          />

          <Image
            source={require("../../assets/images/plant1.png")} 
            style={styles.plantImage}
          />
      </View>

      {/* AI Tự động */}
      <Text style={styles.sectionTitle}>AI TỰ ĐỘNG</Text>
      <View style={styles.aiContainer}>
        {/* Ánh Sáng */}
        <View style={styles.aiItem}>
          <Ionicons name="sunny-outline" size={24} color="black" />
          <Text style={styles.aiText}>ÁNH SÁNG</Text>
          <Text style={styles.aiValue}>40%</Text>
        </View>

        {/* Nhiệt Độ */}
        <View style={styles.aiItem}>
          <Ionicons name="thermometer-outline" size={24} color="black" />
          <Text style={styles.aiText}>NHIỆT ĐỘ</Text>
          <Text style={styles.aiValue}>25 ℃</Text>
        </View>

        {/* Độ ẩm */}
        <View style={styles.aiItem}>
          <Ionicons name="water-outline" size={24} color="black" />
          <Text style={styles.aiText}>ĐỘ ẨM</Text>
          <Text style={styles.aiValue}>{humidity}ml</Text>
        </View>

        {/* Độ ẩm đất */}
        <View style={styles.aiItem}>
          <MaterialCommunityIcons name="sprout" size={24} color="black" />
          <Text style={styles.aiText}>ĐỘ ẨM ĐẤT</Text>
          <Text style={styles.aiValue}>75%</Text>
        </View>
      </View>

      {/* Switch AI */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.customButton, isAutoMode ? styles.activeButton : styles.inactiveButton]}
          onPress={toggleAutoMode}
        >
          <Ionicons
            name={isAutoMode ? "checkmark-circle" : "ellipse-outline"}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: { paddingTop: 20, paddingBottom: 20, paddingLeft: 15, paddingRight: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 30, fontWeight: "bold", color: "#98C13F" },
  logoBold: { color: "#159148" },
  topContainer: {
    backgroundColor: "#DEEAD8",
    padding: 10,
    borderBottomLeftRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: 'relative',    
  },
  leftContainer: {
    flex: 1,
    justifyContent: "flex-start", // Căn các phần tử văn bản lên trên
  },
  rightContainer: {
    flex: 1,
    justifyContent: "flex-start", // Căn các phần tử văn bản lên trên
    position: 'relative', // Để có thể căn hình ảnh và pin ở vị trí tuyệt đối
  },
  title: { fontSize: 18, color: "gray", marginTop: 10 },
  plantName: { fontSize: 35, fontWeight: "bold", },
  sectionTitle: { paddingLeft: 10, fontSize: 15, fontWeight: "bold", marginTop: 20 },
  controls: { flexDirection: "row", justifyContent: "space-around", marginVertical: 15 },
  controlButton: { 
    padding: 12, 
    backgroundColor: "#E8F6EF", 
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedButton: {
    backgroundColor: "#28A745",
    transform: [{ scale: 1.05 }],
    elevation: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
  },
  waterButtonText: { color: "black", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  confirmButton: { backgroundColor: "green", padding: 10, borderRadius: 20, alignItems: "center", marginLeft: 10, marginTop: 10, marginBottom: 10, width: "90%", justifyContent: "center" },
  confirmButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  aiContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  aiItem: { alignItems: "center" },
  aiText: { fontSize: 12, color: "gray", marginTop: 5 },
  aiValue: { fontSize: 15, fontWeight: "bold", color: "green" },
  switchContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 },
  aiMode: { fontSize: 14, fontWeight: "bold" },
  
  // Style cho button
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00AEEF", // Màu nền của button
    elevation: 5, // Để tạo hiệu ứng bóng đổ
    shadowColor: "#000", // Màu bóng
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  activeButton: {
    backgroundColor: "#28A745", 
  },
  inactiveButton: {
    backgroundColor: "#DC3545", 
  },
  battery: {
    position: 'absolute', // Đặt thanh pin vào vị trí tuyệt đối
    top: 10, // Căn lên trên cùng
    right: 10, // Căn bên phải
  },
  plantImage: {
    height: 180,
    
    position: 'absolute', // Đặt vị trí hình ảnh
    bottom: 0, // Căn hình ảnh xuống dưới
    right: -10, // Căn hình ảnh sang phải
    resizeMode: 'contain', // Giữ tỉ lệ hình ảnh
  },
});
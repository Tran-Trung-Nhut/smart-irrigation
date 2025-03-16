import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Nếu không dùng điều hướng, có thể xóa

export default function WelcomeScreen() {
  const router = useRouter(); // Nếu không dùng điều hướng, có thể xóa

  return (
    <ImageBackground
      source={{ uri: "https://w0.peakpx.com/wallpaper/222/567/HD-wallpaper-green-leaf-plant.jpg" }}
      defaultSource={require("../assets/images/bg-begin.jpg")} // Fallback nếu ảnh bị lỗi
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>GreenGenie</Text>
        <Text style={styles.subtitle}>Everything is easy with us</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push({ pathname: "/login" })}>



          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Tăng độ mờ để dễ đọc chữ hơn
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.8)", // Thêm bóng cho chữ
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 50,
  },
  button: {
    width: 200,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Màu trắng trong suốt
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

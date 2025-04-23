import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import useCustomFonts from "../../hooks/useFonts";
import { WebView } from "react-native-webview";
import type { WebView as WebViewType } from "react-native-webview";
import * as utils from "../../utils/keyword-for-voice-command"
import { useRouter } from "expo-router";
import { Schedule } from "./schedule";

export default function HomeScreen() {
  const router = useRouter();
  const [humidity, setHumidity] = useState<number>(0);
  const [moisture, setMoisture] = useState<number>(0);
  const [lightIntensity, setLightIntensity] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [isVoice, setIsVoice] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<string>("water");
  const [button1, setButton1] = useState<boolean>(false);
  const [button2, setButton2] = useState<boolean>(false);
  const [button3, setButton3] = useState<boolean>(false);
  const [voiceText, setVoiceText] = useState<string>("");

  // Khai báo ref với kiểu WebViewType
  const webviewRef = useRef<WebViewType | null>(null);

  const processScheduleCommand = (command: string) => {
    alert(command)
    const deviceNames = ["Máy bơm", "Đèn", "Quạt"];
    const foundDevice = deviceNames.find(device => command.includes(device.toLowerCase()));
    if (!foundDevice) {
        setVoiceText("Không xác định được thiết bị từ câu lệnh!");
        return;
    }

    // Tìm giờ và phút (12:30)
    let timeMatch = command.match(/(\d{1,2}):(\d{1,2})/i); // Tìm giờ và phút
    if (!timeMatch) {
        timeMatch = command.match(/(\d{1,2})\s*(giờ)(\s*(\d{1,2})\s*(phút)?)?/i);
        if(!timeMatch){
          setVoiceText("Không xác định được thời gian từ câu lệnh!");
          return;
        }
    }

    const hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);

    // Tìm ngày và tháng (25 tháng 11)
    const dateMatch = command.match(/ngày\s*(\d{1,2})\s*tháng\s*(\d{1,2})/i);
    let day = new Date().getDate(); // mặc định là hôm nay
    let month = new Date().getMonth() + 1; // tháng hiện tại
    if (dateMatch) {
        day = parseInt(dateMatch[1]);
        month = parseInt(dateMatch[2]);
    }

    // Tìm thời lượng (giây) (10 giây)
    const durationMatch = command.match(/(trong\s*vòng?\s*)?(\d+)\s*(giây|s)/i);

    let duration : number = 30

    if (durationMatch) {
      duration = parseInt(durationMatch[2]); // 15
    } else {
    }

    // Tạo ngày giờ
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), month - 1, day, hour, minute, 0, 0);

    // Gọi hàm xử lý thêm lịch
    handleAddScheduleAuto(foundDevice, scheduledTime, duration);
};

const handleAddScheduleAuto = async (device: string, startDateTime: Date, duration: number) => {
  const newSchedule: Schedule = {
      id: null,
      startTime: startDateTime,
      device: device,
      duration: duration,
      status: false
  };

  try {
      const response = await fetch("http://192.168.224.239:8080/scheduling-item/create", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(newSchedule)
      });
      if (response.ok) {
          setVoiceText("Đã thêm lịch thành công!");
      } else {
        setVoiceText("Không thể thêm lịch!");
      }
  } catch (error) {
    setVoiceText("Lỗi khi thêm lịch!");
  }
};




  // HTML chứa Web Speech API
  const webviewScript = `
    <!DOCTYPE html>
    <html>
    <body>
      <script>
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN'; // Ngôn ngữ tiếng Việt
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          window.ReactNativeWebView.postMessage(JSON.stringify({ text }));
        };

        recognition.onerror = (event) => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ error: event.error }));
        };

        recognition.onend = () => {
          window.ReactNativeWebView.postMessage(JSON.stringify({ ended: true }));
        };

        document.addEventListener('message', (e) => {
          if (e.data === 'start') {
            recognition.start();
          } else if (e.data === 'stop') {
            recognition.stop();
          }
        });
      </script>
    </body>
    </html>
  `;


  const handleVoiceCommand = async (command: string) => {
    try {
      if(utils.checkIncludeText(command, utils.scheduleCommands)){
        await processScheduleCommand(command)
      } else if(utils.checkIncludeText(command, utils.turnOnWater)) {
        setSelectedAction("water")
        if (!button2) await toggleButtonForVoice("water");
      } else if (utils.checkIncludeText(command, utils.turnOffWater)){
        setSelectedAction("water")
        if(button2) await toggleButtonForVoice("water")
      } else if (utils.checkIncludeText(command, utils.turnOnFan)){
        setSelectedAction("fan")
        if(!button3) await toggleButtonForVoice("fan")
      } else if(utils.checkIncludeText(command, utils.turnOffFan)){
        setSelectedAction("fan")
        if(button3) await toggleButtonForVoice("fan")
      } else if(utils.checkIncludeText(command, utils.turnOnLight)){
        setSelectedAction("light")
        if(!button1) await toggleButtonForVoice("light")
      } else if(utils.checkIncludeText(command, utils.turnOffLight)){
        setSelectedAction("light")
        if(button1) await toggleButtonForVoice("light")
      } else if(utils.checkIncludeText(command, utils.turnOnAllDevices)){
        if(!button1) await toggleButtonForVoice("light")
        if(!button3) await toggleButtonForVoice("fan")
        if(!button2) await toggleButtonForVoice("water")
      } else if(utils.checkIncludeText(command, utils.turnOffAllDevices)){
        if(button1) await toggleButtonForVoice("light")
        if(button3) await toggleButtonForVoice("fan")
        if(button2) await toggleButtonForVoice("water")
      } else if(utils.checkIncludeText(command, utils.viewChartCommands)){
        router.replace("/(tabs)/chart")
      } 
    } catch (error) {
      
    }
  }

  // Xử lý kết quả từ WebView
  const handleWebViewMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.text) {
      setVoiceText(data.text);
      handleVoiceCommand(data.text)
    } else if (data.error) {
      console.error("Lỗi nhận dạng giọng nói:", data.error);
      setVoiceText("Lỗi: Không nhận diện được giọng nói");
    } else if (data.ended) {
      setIsVoice(false); 
    }
  };

  const toggleMicrophone = () => {
    const nextStatus = !isVoice;
    setIsVoice(nextStatus);

    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(
        `document.dispatchEvent(new MessageEvent('message', { data: '${nextStatus ? 'start' : 'stop'}' }));`
      );
    }
  };

  // Xác định text cho action dựa trên button được chọn
  const getActionText = () => {
    switch (selectedAction) {
      case "water":
        return "MÁY BƠM";
      case "light":
        return "ĐÈN UV";
      case "fan":
        return "QUẠT";
      default:
        return "MÁY BƠM";
    }
  };

  const textInButton = (): string => {
    if (selectedAction === "water") {
      return button2 ? "Đang bật" : "Bật";
    } else if (selectedAction === "light") {
      return button1 ? "Đang bật" : "Bật";
    } else {
      return button3 ? "Đang bật" : "Bật";
    }
  };
  

  const toggleButtonForVoice = async (command: string) => {
    try {
      if (command === "water") {
        const response = await fetch(`http://192.168.224.239:8080/button/button2/${button2 ? 0 : 1}`);
        const data = await response.json();
        setButton2(data.value === "1");
      } else if (command === "light") {
        const response = await fetch(`http://192.168.224.239:8080/button/button1/${button1 ? 0 : 1}`);
        const data = await response.json();
        setButton1(data.value === "1");
      } else if(command === "fan"){
        const response = await fetch(`http://192.168.224.239:8080/button/button3/${button3 ? 0 : 1}`);
        const data = await response.json();
        setButton3(data.value === "1");
      }
    } catch (error) {
      console.error("Lỗi khi toggle button:", error);
    }
  };

  const toggleButton = async () => {
    try {
      if (selectedAction === "water") {
        const response = await fetch(`http://192.168.224.239:8080/button/button2/${button2 ? 0 : 1}`);
        const data = await response.json();
        setButton2(data.value === "1");
      } else if (selectedAction === "light") {
        const response = await fetch(`http://192.168.224.239:8080/button/button1/${button1 ? 0 : 1}`);
        const data = await response.json();
        setButton1(data.value === "1");
      } else {
        const response = await fetch(`http://192.168.224.239:8080/button/button3/${button3 ? 0 : 1}`);
        const data = await response.json();
        setButton3(data.value === "1");
      }
    } catch (error) {
      console.error("Lỗi khi toggle button:", error);
    }
  };

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const fetchData = async () => {
    try {
      const response = await fetch("http://192.168.224.239:8080/sensor/last-value");
      const jsonData = await response.json();
      setLightIntensity(jsonData.light);
      setHumidity(jsonData.humidity);
      setMoisture(jsonData.moisture);
      setTemperature(jsonData.temperature);
    } catch (error) {
      setHumidity(0);
      setLightIntensity(0);
      setMoisture(0);
      setTemperature(0);
    }
  };

  const fetchButton = async () => {
    try {
      const response = await fetch("http://192.168.224.239:8080/button/last-value");
      const jsonData = await response.json();
      setButton1(jsonData.button1);
      setButton2(jsonData.button2);
      setButton3(jsonData.button3);
    } catch (error) {
      setButton1(false);
      setButton2(false);
      setButton3(false);
    }
  };

  const checkAndDoSchedulingItem = async () => {
    try {
      await fetch("http://192.168.224.239:8080/scheduling-item/check");
    } catch (e) {
      console.error("Lỗi khi kiểm tra scheduling:", e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchButton();
    checkAndDoSchedulingItem();

    const interval = setInterval(() => {
      fetchData();
      fetchButton();
      checkAndDoSchedulingItem();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Sm<Text style={styles.logoBold}>irr</Text>
        </Text>
      </View>

      {/* Ảnh Cây & Tên */}
      <View style={styles.topContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.title}>TRONG NHÀ</Text>
          <Text style={styles.plantName}>CÂY CỦA BẠN</Text>

          {/* Điều khiển thủ công */}
          <Text style={styles.sectionTitle}>THAO TÁC THỦ CÔNG</Text>
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, selectedAction === "water" && styles.selectedButton]}
              onPress={() => setSelectedAction("water")}
            >
              <Ionicons
                name="water"
                size={24}
                color={selectedAction === "water" ? "#FFFFFF" : "#00AEEF"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, selectedAction === "light" && styles.selectedButton]}
              onPress={() => setSelectedAction("light")}
            >
              <Ionicons
                name="flash"
                size={24}
                color={selectedAction === "light" ? "#FFFFFF" : "#FDCB58"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, selectedAction === "fan" && styles.selectedButton]}
              onPress={() => setSelectedAction("fan")}
            >
              <FontAwesome5
                name="fan"
                size={24}
                color={selectedAction === "fan" ? "#FFFFFF" : "#9B59B6"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.waterButtonText}>{getActionText()}</Text>

          <TouchableOpacity
            style={textInButton() === "Bật" ? styles.confirmButton : styles.confirmButtonOn}
            onPress={() => toggleButton()}
          >
            <Text style={styles.confirmButtonText}>{textInButton()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightContainer}>
          <Image source={require("../../assets/images/plant1.png")} style={styles.plantImage} />
        </View>
      </View>

      {/* Thông số môi trường */}
      <Text style={styles.sectionTitle}>THÔNG SỐ MÔI TRƯỜNG</Text>
      <View style={styles.aiContainer}>
        <View style={styles.aiItem}>
          <Ionicons name="sunny-outline" size={24} color="black" />
          <Text style={styles.aiText}>ÁNH SÁNG</Text>
          <Text style={styles.aiValue}>{lightIntensity}</Text>
        </View>

        <View style={styles.aiItem}>
          <Ionicons name="thermometer-outline" size={24} color="black" />
          <Text style={styles.aiText}>NHIỆT ĐỘ</Text>
          <Text style={styles.aiValue}>{temperature} ℃</Text>
        </View>

        <View style={styles.aiItem}>
          <Ionicons name="water-outline" size={24} color="black" />
          <Text style={styles.aiText}>ĐỘ ẨM</Text>
          <Text style={styles.aiValue}>{humidity}ml</Text>
        </View>

        <View style={styles.aiItem}>
          <MaterialCommunityIcons name="sprout" size={24} color="black" />
          <Text style={styles.aiText}>ĐỘ ẨM ĐẤT</Text>
          <Text style={styles.aiValue}>{moisture}%</Text>
        </View>
      </View>

      {/* Micro và WebView */}
      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[styles.customButton, !isVoice ? styles.activeButton : styles.inactiveButton]}
          onPress={toggleMicrophone}
        >
          <Ionicons name={!isVoice ? "mic" : "mic-off"} size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View>
        <WebView
          ref={webviewRef}
          source={{ html: webviewScript }}
          onMessage={handleWebViewMessage}
          style={{ height: 0, width: 0 }} // Ẩn WebView
        />
        {!isVoice ? (
          <Text style={styles.textVoice}>
            Nhấn vào micro để nói: {voiceText}
          </Text>
        ) : (
          <Text style={styles.textVoice}>
            Đang nghe... Nhấn để dừng
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { fontSize: 30, fontWeight: "bold", color: "#98C13F" },
  logoBold: { color: "#159148" },
  topContainer: {
    backgroundColor: "#DEEAD8",
    padding: 10,
    borderBottomLeftRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  leftContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 1,
    justifyContent: "flex-start",
    position: "relative",
  },
  title: { fontSize: 18, color: "gray", marginTop: 10 },
  plantName: { fontSize: 35, fontWeight: "bold" },
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
  confirmButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    width: "90%",
    justifyContent: "center",
  },
  confirmButtonOn: {
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    width: "90%",
    justifyContent: "center",
  },
  confirmButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  aiContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  aiItem: { alignItems: "center" },
  aiText: { fontSize: 12, color: "gray", marginTop: 5 },
  aiValue: { fontSize: 15, fontWeight: "bold", color: "green" },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  customButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00AEEF",
    elevation: 5,
    shadowColor: "#000",
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
    position: "absolute",
    top: 10,
    right: 10,
  },
  plantImage: {
    height: 180,
    position: "absolute",
    bottom: 0,
    right: -10,
    resizeMode: "contain",
  },
  textVoice: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
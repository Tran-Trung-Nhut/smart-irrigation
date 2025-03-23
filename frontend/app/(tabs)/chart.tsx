import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Dummy data cho biểu đồ
const dummyData = {
  humidity: [55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 95, 90, 88, 87, 85, 80, 78, 75, 72, 70, 68, 65, 63, 60],
  soilMoisture: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 88, 89, 86, 82, 78, 75, 70, 66, 64, 62, 60, 58],
  temperature: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 34, 33, 32, 30, 29, 28, 27, 26, 25, 24, 23],
  light: [200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 770, 790, 800, 820, 840, 860, 880, 900, 920, 940, 960, 980],
};

type DataKey = "humidity" | "soilMoisture" | "temperature" | "light";

const ChartScreen = () => {
  const pickerStyle = (lineColor: string) => ({
    height: 50,
    width: Dimensions.get("window").width - 40,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: lineColor,
    elevation: 2,
    marginTop: 10,
    justifyContent: "center",
  });

  const [selectedData, setSelectedData] = useState<DataKey>("humidity");
  const [timeFrame, setTimeFrame] = useState("day");

  const rawData = dummyData[selectedData];

  // Tạo nhãn cho 24 giờ
  const allHourLabels = Array.from({ length: 24 }, (_, i) => `${i + 1}h`);

  const filteredLabels = allHourLabels.filter((_, index) => index % 2 === 0);
  const filteredData = rawData.filter((_, index) => index % 2 === 0);

  const dataLabels = timeFrame === "day" ? filteredLabels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dataToShow = timeFrame === "day" ? filteredData : rawData.slice(0, 7);

  const chartColors = {
    humidity: "rgba(0, 123, 255, 0.5)",
    soilMoisture: "rgba(255, 99, 132, 0.5)",
    temperature: "rgba(255, 159, 64, 0.5)",
    light: "rgba(75, 192, 192, 0.5)",
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    fillShadowGradient: "#4CAF50",
    fillShadowGradientOpacity: 0.1,
    strokeWidth: 2,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#fff",
    },
    propsForBackgroundLines: {
      stroke: "#e3e3e3",
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          Sm<Text style={styles.logoBold}>irr</Text>
        </Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* Dropdown chọn loại dữ liệu */}
      <View style={pickerStyle(chartColors[selectedData])}>
        <Picker selectedValue={selectedData} onValueChange={(itemValue) => setSelectedData(itemValue)} style={styles.picker}>
          <Picker.Item label="Độ ẩm" value="humidity" />
          <Picker.Item label="Độ ẩm đất" value="soilMoisture" />
          <Picker.Item label="Nhiệt độ" value="temperature" />
          <Picker.Item label="Ánh sáng" value="light" />
        </Picker>
      </View>

      

      {/* Biểu đồ theo ngày */}
      <Text style={styles.title}>Biểu đồ theo ngày</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: dataLabels,
            datasets: [
              {
                data: dataToShow,
                color: () => chartColors[selectedData],
              },
            ],
          }}
          width={Math.max(Dimensions.get("window").width - 40, dataLabels.length * 50)}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
      </ScrollView>

      {/* Biểu đồ theo tuần */}
      <Text style={styles.title}>Biểu đồ theo tuần</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                data: rawData.slice(0, 7),
                color: () => chartColors[selectedData],
              },
            ],
          }}
          width={Math.max(Dimensions.get("window").width - 40, 7 * 50)} 
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, paddingRight: 15, backgroundColor: "white" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 30, fontWeight: "bold", color: "#98C13F"},
  logoBold: { color: "#159148", fontWeight: "bold" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
    marginVertical: 20,
  },
  picker: {
    width: "100%",
    alignItems: "center"
  },
});

export default ChartScreen;

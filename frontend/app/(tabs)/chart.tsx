import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type dataSensor = {
  id: string;
  value: string
  feed_id: number;
  feed_key: string;
  created_at: Date;
  created_epoch: number;
  expiration: Date;
}

const ChartScreen = () => {
  const [dataLight, setDataLight] = useState<dataSensor[]>([])
  const [dataTemperature, setDataTemperature] = useState<dataSensor[]>([])
  const [dataMoisture, setDataMoisture] = useState<dataSensor[]>([])
  const [dataHumidity, setDataHumidity] = useState<dataSensor[]>([])
  const [selectedTime, setSeletecTime] = useState<string>("day")

  const chartColors = {
    hour: "rgba(0, 123, 255, 0.5)",
    day: "rgba(255, 99, 132, 0.5)",
    week: "rgba(255, 159, 64, 0.5)",
    month: "rgba(75, 192, 192, 0.5)",
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

  const fetchData = async (time: string) => {
    try {
      // const lightResponse = await fetch(`http://localhost:8080/sensor/anhsang/chart/${time}`)
      const lightResponse = await fetch(`http://192.168.1.32:8080/sensor/anhsang/chart/${time}`)
      const lightData = await lightResponse.json()
      setDataLight(lightData.data);
      
      // const temperatureResponse = await fetch(`http://localhost:8080/sensor/nhietdo/chart/${time}`)
      const temperatureResponse = await fetch(`http://192.168.1.32:8080/sensor/nhietdo/chart/${time}`)
      const temperatureData = await temperatureResponse.json()
      setDataTemperature(temperatureData.data);
      
      // const humidityResponse = await fetch(`http://localhost:8080/sensor/doam/chart/${time}`)
      const humidityResponse = await fetch(`http://192.168.1.32:8080/sensor/doam/chart/${time}`)
      const humidityData = await humidityResponse.json()
      setDataHumidity(humidityData.data);
      
      // const moistureResponse = await fetch(`http://localhost:8080/sensor/do-am-dat/chart/${time}`)
      const moistureResponse = await fetch(`http://192.168.1.32:8080/sensor/do-am-dat/chart/${time}`)
      const moistrureData = await moistureResponse.json()
      setDataMoisture(moistrureData.data);
      
    } catch (error) {
      
    }
  }

  const handleDataShow = (sensor: string): number[] => {
    let values;
    if (sensor === "light") values = dataLight.map(item => parseFloat(item.value));
    else if (sensor === "temperature") values = dataTemperature.map(item => parseFloat(item.value));
    else if (sensor === "moisture") values = dataMoisture.map(item => parseFloat(item.value));
    else values = dataHumidity.map(item => parseFloat(item.value));
  
    return values.filter(value => !isNaN(value) && value !== null && value !== undefined);
  };

  const handleDateShow = (sensor: string): string[] => {
    let dates;
    if (sensor === "light") dates = dataLight.map(item => new Date(item.created_at).toLocaleTimeString());
    else if (sensor === "temperature") dates = dataTemperature.map(item => new Date(item.created_at).toLocaleTimeString());
    else if (sensor === "moisture") dates = dataMoisture.map(item => new Date(item.created_at).toLocaleTimeString());
    else dates = dataHumidity.map(item => new Date(item.created_at).toLocaleTimeString());
    return dates.filter(date => date && date !== "Invalid Date");
  };
  

  useEffect(() => {
    fetchData("day");
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          Sm<Text style={styles.logoBold}>irr</Text>
        </Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      <View style={styles.pickerTime}>
        <Picker selectedValue={selectedTime} onValueChange={(itemValue) => {
          fetchData(itemValue)
        }} style={styles.picker}>
          <Picker.Item label="Theo giờ" value="hour" />
          <Picker.Item label="Theo ngày" value="day" />
          <Picker.Item label="Theo tuần" value="week" />
          <Picker.Item label="Theo tháng" value="month" />
        </Picker>
      </View>
      

      {/* Biểu đồ theo ngày */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: handleDateShow("temperature"),
            datasets: [
              {
                data: handleDataShow("temperature").length > 0
                  ? handleDataShow("temperature")
                  : [0], 
                color: () => chartColors["hour"],
              },
            ],
          }}
          width={Math.max(Dimensions.get("window").width - 40, dataTemperature.length * 50)}
          height={1000}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
      </ScrollView>
      <Text style={styles.title}>Biểu đồ nhiệt độ</Text>


      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: handleDateShow("light"),
            datasets: [
              {
                data: handleDataShow("light").length > 0
                  ? handleDataShow("light")
                  : [0], 
                color: () => chartColors["hour"],
              },
            ],
          }}
          width={Math.max(Dimensions.get("window").width - 40, dataLight.length * 50)}
          height={1000}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
      </ScrollView>
      <Text style={styles.title}>Biểu đồ ánh sáng</Text>


      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: handleDateShow("humidity"),
            datasets: [
              {
                data: handleDataShow("humidity").length > 0
                  ? handleDataShow("humidity")
                  : [0], 
                color: () => chartColors["hour"],
              },
            ],
          }}
          width={Math.max(Dimensions.get("window").width - 40, dataHumidity.length * 50)}
          height={1000}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
      </ScrollView>
      <Text style={styles.title}>Biểu đồ độ ẩm</Text>


      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: handleDateShow("moisture"),
            datasets: [
              {
                data: handleDataShow("moisture").length > 0
                  ? handleDataShow("moisture")
                  : [0], 
                color: () => chartColors["hour"],
              },
            ],
          }}
          width={Math.max(Dimensions.get("window").width - 40, dataMoisture.length * 50)}
          height={1000}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero
        />
      </ScrollView>
      <Text style={styles.title}>Biểu đồ độ ẩm đất</Text>
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
    borderWidth: 2, 
    borderColor: "#4CAF50", 
    borderRadius: 10,
    marginVertical: 10, 
    padding: 10, 
  },
  picker: {
    width: "100%",
    alignItems: "center"
  },

  pickerTime : {
    height: 50,
    width: Dimensions.get("window").width - 40,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
    elevation: 2,
    marginTop: 10,
    justifyContent: "center",
  },
});

export default ChartScreen;

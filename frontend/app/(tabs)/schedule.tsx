import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, List, Card, PaperProvider, Divider, Chip, Menu } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates';
registerTranslation('en', en);
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useCustomFonts from "../../hooks/useFonts";
import { format } from 'date-fns';

// TimePicker Component (Integrated directly in this file)
const TimePicker = ({ value, onChange, label }) => {
  const [visible, setVisible] = useState(false);
  const [hours, setHours] = useState(value ? value.getHours().toString().padStart(2, '0') : '00');
  const [minutes, setMinutes] = useState(value ? value.getMinutes().toString().padStart(2, '0') : '00');

  const handleOpen = () => {
    setHours(value ? value.getHours().toString().padStart(2, '0') : '00');
    setMinutes(value ? value.getMinutes().toString().padStart(2, '0') : '00');
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    // Use default value "00" if field is empty
    const h = hours === '' ? '00' : hours;
    const m = minutes === '' ? '00' : minutes;
    
    // Create a new date object with the selected time
    const newDate = new Date(value);
    newDate.setHours(parseInt(h, 10));
    newDate.setMinutes(parseInt(m, 10));
    
    onChange(newDate);
    handleClose();
  };

  // Format the time for display in the input field
  const formatTime = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View>
      <TextInput
        label={label}
        value={formatTime(value)}
        onFocus={handleOpen}
        style={timePickerStyles.input}
      />
      
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={timePickerStyles.modalOverlay}>
          <View style={timePickerStyles.modalContent}>
            <Text style={timePickerStyles.modalTitle}>Chọn thời gian</Text>
            
            <View style={timePickerStyles.timeContainer}>
              {/* Hours input */}
              <View style={timePickerStyles.timeFieldContainer}>
                <TextInput
                  value={hours}
                  onChangeText={(text) => {
                    // Only allow numbers and limit to 2 digits
                    const filtered = text.replace(/[^0-9]/g, '').slice(0, 2);
                    // Ensure hours are between 0-23
                    if (filtered === '' || parseInt(filtered, 10) <= 23) {
                      setHours(filtered);
                    }
                  }}
                  keyboardType="number-pad"
                  style={timePickerStyles.timeField}
                  maxLength={2}
                />
                <Text style={timePickerStyles.timeLabel}>Giờ</Text>
              </View>
              
              <Text style={timePickerStyles.timeSeparator}>:</Text>
              
              {/* Minutes input */}
              <View style={timePickerStyles.timeFieldContainer}>
                <TextInput
                  value={minutes}
                  onChangeText={(text) => {
                    // Only allow numbers and limit to 2 digits
                    const filtered = text.replace(/[^0-9]/g, '').slice(0, 2);
                    // Ensure minutes are between 0-59
                    if (filtered === '' || parseInt(filtered, 10) <= 59) {
                      setMinutes(filtered);
                    }
                  }}
                  keyboardType="number-pad"
                  style={timePickerStyles.timeField}
                  maxLength={2}
                />
                <Text style={timePickerStyles.timeLabel}>Phút</Text>
              </View>
            </View>
            
            <View style={timePickerStyles.buttonContainer}>
              <TouchableOpacity onPress={handleClose} style={timePickerStyles.button}>
                <Text style={timePickerStyles.buttonText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={timePickerStyles.button}>
                <Text style={[timePickerStyles.buttonText, timePickerStyles.confirmButton]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// TimePicker Styles
const timePickerStyles = StyleSheet.create({
  input: {
    color: 'black',
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  timeFieldContainer: {
    alignItems: 'center',
    width: 100,
  },
  timeField: {
    backgroundColor: '#444',
    color: 'white',
    fontSize: 48,
    width: 100,
    textAlign: 'center',
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a86e8',
  },
  timeLabel: {
    marginTop: 8,
    color: '#ccc',
    fontSize: 16,
  },
  timeSeparator: {
    fontSize: 48,
    marginHorizontal: 10,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#4a86e8',
  },
  confirmButton: {
    fontWeight: 'bold',
  },
});

// Define types for schedule object
type Schedule = {
    startTime: Date;
    startDate: Date;
    device: string;
    duration: number;
};

// Device Dropdown Component
const DeviceDropdown = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);
  const devices = ['Thiết bị 1', 'Thiết bị 2', 'Thiết bị 3'];

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <TouchableOpacity onPress={() => setVisible(true)}>
          <TextInput
            label="Thiết bị"
            value={value}
            editable={false}
            style={styles.textInput}
            right={<TextInput.Icon icon="menu-down" />}
          />
        </TouchableOpacity>
      }
    >
      {devices.map((device) => (
        <Menu.Item
          key={device}
          onPress={() => {
            onChange(device);
            setVisible(false);
          }}
          title={device}
        />
      ))}
    </Menu>
  );
};

function WateringSchedule() {
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [device, setDevice] = useState('Thiết bị 1');
    const [duration, setDuration] = useState(30);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const insets = useSafeAreaInsets();

    const handleAddSchedule = () => {
      // Create complete datetime objects by combining date and time
      const completeStartDateTime = new Date(startDate);
      completeStartDateTime.setHours(
          startTime.getHours(),
          startTime.getMinutes(),
          0, 0
      );
  
      if (duration <= 0) {
        alert('Vui lòng nhập thời lượng tưới hợp lệ.');
        return;
      }
      
      // Store complete datetime objects in the schedule
      const newSchedule: Schedule = { 
          startTime: completeStartDateTime, 
          startDate,
          device,
          duration: Number(duration)
      };
      
      setSchedules([...schedules, newSchedule]);
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatWateringTime = (startTime, duration) => {
      const endTime = new Date(startTime);
      
      endTime.setSeconds(endTime.getSeconds() + duration);
      
      const formatTime = (date) => {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
      };
      
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

    return (
        <PaperProvider>
            <ScrollView style={[styles.container]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>
                        Sm<Text style={styles.logoBold}>irr</Text>
                    </Text>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </View>
                <Text variant="headlineMedium" style={styles.title}>LÊN LỊCH TƯỚI</Text>

                {/* Start Date and Time */}
                <View style={styles.inputContainer}>
                    {/* Start Date - Now 2/3 width */}
                    <View style={styles.dateInputLeft}>
                        <DatePickerInput
                            label="Ngày bắt đầu"
                            value={startDate}
                            onChange={(d) => setStartDate(d || new Date())}
                            locale="vn"
                            style={styles.datePicker}
                            inputMode="date"
                        />
                    </View>
                    
                    {/* Start Time - Now 1/3 width */}
                    <View style={styles.dateInputRight}>
                        <TimePicker
                            label="Giờ tưới"
                            value={startTime}
                            onChange={(newTime) => {
                                // Create a new date that combines the selected date with the new time
                                const combinedDate = new Date(startDate);
                                combinedDate.setHours(newTime.getHours(), newTime.getMinutes());
                                setStartTime(combinedDate);
                            }}
                            style={styles.datePicker}
                        />
                    </View>
                </View>

                {/* Device and Duration */}
                <View style={styles.inputContainer}>
                    {/* Device - Now 2/3 width */}
                    <View style={styles.dateInputLeft}>
                        <DeviceDropdown 
                            value={device}
                            onChange={setDevice}
                        />
                    </View>
                    {/* Duration - Now 1/3 width */}
                    <View style={styles.dateInputRight}>
                        <TextInput
                            label="Tưới trong (giây)" 
                            value={duration.toString()}
                            onChangeText={(text) => {
                                // If user deletes all input, set to empty string
                                if (text === '') {
                                    setDuration(0);
                                } else {
                                    // Update duration if it's a valid number
                                    const newDuration = parseInt(text, 10);
                                    if (!isNaN(newDuration)) {
                                        setDuration(newDuration);
                                    }
                                }
                            }}
                            keyboardType="number-pad"
                            style={styles.textInput}
                        />
                    </View>
                </View>

                <Button mode="contained" onPress={handleAddSchedule} style={styles.addButton}>
                    Thêm lịch
                </Button>

                <Divider style={styles.divider} />

                <Text variant="titleLarge" style={styles.sectionTitle}>Danh sách lịch tưới</Text>
                {schedules.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scheduleList}>
                        {schedules.map((schedule, index) => (
                            <Card 
                                key={index} 
                                style={styles.scheduleCard}
                            >
                                <Card.Content>
                                    <Text style={styles.scheduleCardTitle}>Lịch tưới #{index + 1}</Text>
                                    <Text style={styles.scheduleCardDetail}>
                                        Thời gian tưới: {formatWateringTime(schedule.startTime, schedule.duration)}
                                    </Text>
                                    <Text style={styles.scheduleCardDetail}>
                                        Ngày: {formatDate(schedule.startDate)}
                                    </Text>
                                    <Text style={styles.scheduleCardDetail}>
                                        Thiết bị: {schedule.device}
                                    </Text>
                                </Card.Content>
                            </Card>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.noSchedulesText}>No schedules saved yet.</Text>
                )}
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, paddingRight: 15, backgroundColor: "white"
    },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    logo: { fontSize: 30, fontWeight: "bold", color: "#98C13F"},
    logoBold: { color: "#159148", fontWeight: "bold" },
    title: {
        margin: 15,
        textAlign: 'center',
        color: "FFFFFF",
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    // New styles for the 2/3 and 1/3 column width
    dateInputLeft: {
        flex: 2,
        marginRight: 8,
        color: "black"
    },
    dateInputRight: {
        flex: 1,
        color: "black"
    },
    // Keep the original dateInput for backward compatibility
    dateInput: {
        flex: 1,
        marginRight: 8,
        color: "black"
    },
    textInput: {
        color: "black",
        borderRadius: 10,
    },
    addButton: {
        marginTop: 10,
    },
    sectionTitle: {
        marginTop: 10,
        marginBottom: 12,
        color: "green"
    },
    scheduleList: {
        marginBottom: 10,
    },
    scheduleChip: {
        marginRight: 8,
        marginBottom: 8,
    },
    wateringDatesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    wateringDate: {
        marginRight: 8,
        marginBottom: 8,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        color: "black"
    },
    divider: {
        marginVertical: 5,
    },
    datePicker: {
        borderRadius: 10,
        padding: 0,
        margin: 0,
    },
    noSchedulesText: {
        color: 'gray',
    },
    scheduleCard: {
      marginRight: 12,
      marginBottom: 8,
      elevation: 2,
      backgroundColor: 'white'
    },
    scheduleCardTitle: {
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#159148',
    },
    scheduleCardDetail: {
      fontSize: 14,
      marginBottom: 3,
      color: 'black',
    },
});

export default WateringSchedule;